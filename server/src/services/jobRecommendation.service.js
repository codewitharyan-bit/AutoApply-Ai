const supabase = require('../config/supabase');
const { getUserByClerkId } = require('./user.service');
const { normalizeSkills, displayName, NORMALIZATION_MAP } = require('../utils/skillNormalizer');

const WEIGHTS = {
  REQUIRED_SKILLS: 40,
  PREFERRED_SKILLS: 15,
  PREFERRED_ROLE: 15,
  EXPERIENCE: 15,
  LOCATION: 10,
  EMPLOYMENT_TYPE: 5,
};

const calcRoleScore = (jobTitle, preferredRoles) => {
  if (!preferredRoles || preferredRoles.length === 0 || !jobTitle) return 0;
  const jobLower = jobTitle.toLowerCase();
  for (const role of preferredRoles) {
    const roleLower = role.toLowerCase();
    if (jobLower.includes(roleLower) || roleLower.includes(jobLower)) return 100;
  }
  return 0;
};

const mapProfileLevel = (profileExperienceLevel, profileExperience) => {
  if (typeof profileExperienceLevel === 'string' && profileExperienceLevel.trim()) {
    const level = profileExperienceLevel.trim().toLowerCase();
    if (level === 'fresher') return 0;
    if (level === '0-1 years') return 0;
    if (level === '1-2 years') return 1;
    if (level === '2-3 years') return 1;
    if (level === '3-5 years') return 2;
    if (level === '5-7 years') return 3;
    if (level === '7-10 years') return 4;
    if (level === '10+ years') return 4;
    if (level === 'entry') return 0;
    if (level === 'mid') return 1;
    if (level === 'senior') return 2;
    if (level === 'lead') return 3;
    if (level === 'principal') return 4;
  }

  if (Array.isArray(profileExperience) && profileExperience.length > 0) {
    return Math.min(4, Math.floor(profileExperience.length / 2));
  }

  return 0;
};

const mapJobLevel = (jobExperienceLevel) => {
  if (!jobExperienceLevel || typeof jobExperienceLevel !== 'string') return -1;

  const raw = jobExperienceLevel.trim().toLowerCase();
  if (!raw) return -1;

  if (raw.includes('fresher') || raw.includes('intern') || raw.includes('entry') || raw.includes('junior')) return 0;
  if (raw.includes('mid')) return 1;
  if (raw.includes('senior')) return 2;
  if (raw.includes('lead') || raw.includes('staff')) return 3;
  if (raw.includes('principal') || raw.includes('architect') || raw.includes('director')) return 4;

  const match = raw.match(/(\d+)\s*(\+|to|-)?\s*(\d+)?/);
  if (!match) return -1;

  const startYears = Number(match[1]);
  if (Number.isNaN(startYears)) return -1;

  if (startYears <= 1) return 0;
  if (startYears <= 3) return 1;
  if (startYears <= 5) return 2;
  if (startYears <= 7) return 3;
  return 4;
};

const calcExperienceScore = (jobExperienceLevel, profileExperienceLevel, profileExperience) => {
  const profileLevel = mapProfileLevel(profileExperienceLevel, profileExperience);
  const jobLevel = mapJobLevel(jobExperienceLevel);
  if (jobLevel === -1) return 50;
  const diff = Math.abs(profileLevel - jobLevel);
  if (diff === 0) return 100;
  if (diff === 1) return 70;
  if (diff === 2) return 40;
  return 10;
};

const calcLocationScore = (jobLocation, profileLocation) => {
  if (!profileLocation || !jobLocation) return 50;
  const jl = jobLocation.toLowerCase();
  const pl = profileLocation.toLowerCase();
  if (jl.includes(pl) || pl.includes(jl)) return 100;
  return 30;
};

const calcEmploymentTypeScore = (jobType, preferredTypes) => {
  if (!jobType) return 50;
  if (!preferredTypes || preferredTypes.length === 0) return 100;
  const jt = jobType.toLowerCase();
  for (const pt of preferredTypes) {
    if (pt.toLowerCase() === jt) return 100;
  }
  return 30;
};

const generateReason = (matchedSkills, missingSkills, matchScore, scoreBreakdown) => {
  const parts = [];
  if (matchedSkills.length > 0) {
    const top = matchedSkills.slice(0, 3).join(', ');
    parts.push(`${matchedSkills.length} matching skills found (${top})`);
  }
  if (scoreBreakdown.requiredSkillsScore > 0) {
    parts.push(`Strong required skills match (${Math.round(scoreBreakdown.requiredSkillsScore)}%)`);
  }
  if (missingSkills.length > 0) {
    const top = missingSkills.slice(0, 3).join(', ');
    parts.push(`Missing ${missingSkills.length} key skills (${top})`);
  }
  if (matchScore >= 80) {
    parts.push('Highly recommended');
  } else if (matchScore >= 60) {
    parts.push('Good potential fit');
  }
  return parts.join('. ') || 'Based on your profile';
};

const extractSkillsFromDescription = (description, profileSkillSet) => {
  if (!description) return { matched: [], missing: [] };
  const desc = description.toLowerCase();
  const matched = [];
  const missing = [];

  for (const skill of profileSkillSet) {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (pattern.test(desc)) {
      matched.push(displayName(skill));
    }
  }

  return { matched, missing };
};

const generateRecommendations = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('skills, preferred_roles, location, experience, experience_level')
    .eq('user_id', user.id)
    .single();

  if (profileError) throw profileError;

  const profileSkills = normalizeSkills(profile.skills || []);
  const profileSkillSet = new Set(profileSkills);
  const preferredRoles = Array.isArray(profile.preferred_roles) ? profile.preferred_roles : [];
  const profileLocation = profile.location || '';

  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*');

  if (jobsError) throw jobsError;

  const recommendations = [];

  for (const job of jobs) {
    const requiredSkills = normalizeSkills(job.required_skills || []);
    const preferredSkills = normalizeSkills(job.preferred_skills || []);
    const allJobSkills = [...requiredSkills, ...preferredSkills];

    const requiredSet = new Set(requiredSkills);
    const preferredSet = new Set(preferredSkills);
    const allJobSet = new Set(allJobSkills);

    const matchedSkills = [];
    const missingSkills = [];

    if (allJobSet.size === 0) {
      const extracted = extractSkillsFromDescription(job.description, profileSkillSet);
      matchedSkills.push(...extracted.matched);
    } else {
      for (const skill of allJobSet) {
        if (profileSkillSet.has(skill)) {
          matchedSkills.push(displayName(skill));
        } else if (requiredSet.has(skill)) {
          missingSkills.push(displayName(skill));
        }
      }
    }

    let requiredScore;
    let preferredScore;

    if (allJobSet.size === 0) {
      const desc = (job.description || '').toLowerCase();
      const foundCount = profileSkills.filter((s) => {
        const pattern = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        return pattern.test(desc);
      }).length;
      requiredScore = profileSkills.length === 0 ? 0 : (foundCount / profileSkills.length) * 100;
      preferredScore = 0;
    } else {
      const requiredMatched = requiredSkills.filter((s) => profileSkillSet.has(s)).length;
      requiredScore = requiredSkills.length === 0 ? 50 : (requiredMatched / requiredSkills.length) * 100;

      const preferredMatched = preferredSkills.filter((s) => profileSkillSet.has(s)).length;
      preferredScore = preferredSkills.length === 0 ? 50 : (preferredMatched / preferredSkills.length) * 100;
    }

    const roleScore = calcRoleScore(job.title, preferredRoles);
    const experienceScore = calcExperienceScore(
      job.experience_level,
      profile.experience_level,
      profile.experience,
    );
    const locationScore = calcLocationScore(job.location, profileLocation);
    const employmentScore = calcEmploymentTypeScore(job.employment_type, ['Full-time']);

    const matchScore = Math.round(
      (requiredScore * WEIGHTS.REQUIRED_SKILLS +
        preferredScore * WEIGHTS.PREFERRED_SKILLS +
        roleScore * WEIGHTS.PREFERRED_ROLE +
        experienceScore * WEIGHTS.EXPERIENCE +
        locationScore * WEIGHTS.LOCATION +
        employmentScore * WEIGHTS.EMPLOYMENT_TYPE) /
      100
    );

    const scoreBreakdown = {
      requiredSkillsScore: requiredScore,
      preferredSkillsScore: preferredScore,
      roleScore,
      experienceScore,
      locationScore,
      employmentScore,
    };

    const reason = generateReason(matchedSkills, missingSkills, matchScore, scoreBreakdown);

    recommendations.push({
      user_id: user.id,
      job_id: job.id,
      match_score: matchScore,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      recommendation_reason: reason,
    });
  }

  if (recommendations.length === 0) {
    await supabase
      .from('job_recommendations')
      .delete()
      .eq('user_id', user.id);

    return [];
  }

  const { error: upsertError } = await supabase
    .from('job_recommendations')
    .upsert(recommendations, { onConflict: 'user_id, job_id' });

  if (upsertError) throw upsertError;

  const newJobIds = recommendations.map((r) => r.job_id);

  let deleteQuery = supabase
    .from('job_recommendations')
    .delete()
    .eq('user_id', user.id);

  if (newJobIds.length > 0) {
    deleteQuery = deleteQuery.not(
      'job_id',
      'in',
      `(${newJobIds.join(',')})`
    );
  }

  const { error: deleteError } = await deleteQuery;

  if (deleteError) throw deleteError;

  const top = recommendations
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 20);

  const { data: topJobs } = await supabase
    .from('jobs')
    .select('id, title, company, location, salary, description, job_url, created_at')
    .in('id', top.map((r) => r.job_id));

  const jobMap = new Map((topJobs || []).map((j) => [j.id, j]));

  return top.map((rec) => {
    const job = jobMap.get(rec.job_id);
    return {
      id: rec.job_id,
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      salary: job?.salary || null,
      description: job?.description || '',
      job_url: job?.job_url || '',
      created_at: job?.created_at || null,
      matchScore: rec.match_score,
      matchedSkills: rec.matched_skills,
      missingSkills: rec.missing_skills,
      recommendationReason: rec.recommendation_reason,
    };
  });
};

module.exports = {
  generateRecommendations,
};
