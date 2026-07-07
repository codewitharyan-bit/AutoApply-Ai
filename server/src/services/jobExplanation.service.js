const supabase = require('../config/supabase');
const { getUserByClerkId } = require('./user.service');

const calcRoleScore = (jobTitle, preferredRoles) => {
  if (!preferredRoles || preferredRoles.length === 0 || !jobTitle) return null;
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
  if (!jobExperienceLevel) return null;
  const profileLevel = mapProfileLevel(profileExperienceLevel, profileExperience);
  const jobLevel = mapJobLevel(jobExperienceLevel);
  if (jobLevel === -1) return null;
  const diff = Math.abs(profileLevel - jobLevel);
  if (diff === 0) return 100;
  if (diff === 1) return 70;
  if (diff === 2) return 40;
  return 10;
};

const calcLocationScore = (jobLocation, profileLocation) => {
  if (!profileLocation || !jobLocation) return null;
  const jl = jobLocation.toLowerCase();
  const pl = profileLocation.toLowerCase();
  if (jl.includes(pl) || pl.includes(jl)) return 100;
  return 30;
};

const calcEmploymentTypeScore = (jobType, preferredTypes) => {
  if (!jobType) return null;
  if (!preferredTypes || preferredTypes.length === 0) return null;
  const jt = jobType.toLowerCase();
  for (const pt of preferredTypes) {
    if (pt.toLowerCase() === jt) return 100;
  }
  return 30;
};

const buildSummary = (parts) => {
  const sentences = [];

  if (parts.matchScore !== null && parts.matchScore !== undefined) {
    if (parts.matchScore >= 80) sentences.push('Strong overall match.');
    else if (parts.matchScore >= 60) sentences.push('Good potential fit.');
    else if (parts.matchScore >= 40) sentences.push('Moderate match \u2014 some areas need improvement.');
    else sentences.push('Low match \u2014 significant gaps identified.');
  }

  if (parts.matchedSkills && parts.matchedSkills.length > 0) {
    const top = parts.matchedSkills.slice(0, 3).join(', ');
    sentences.push(`${parts.matchedSkills.length} matching skills found (${top}).`);
  }

  if (parts.missingSkills && parts.missingSkills.length > 0) {
    const top = parts.missingSkills.slice(0, 3).join(', ');
    sentences.push(`Missing ${parts.missingSkills.length} key skills (${top}).`);
  }

  if (parts.roleScore === 100) sentences.push('Your preferred role aligns with this position.');
  else if (parts.roleScore === 0) sentences.push('This role differs from your preferred positions.');

  if (parts.experienceScore === 100) sentences.push('Experience level is an exact match.');
  else if (parts.experienceScore !== null && parts.experienceScore >= 70) sentences.push('Experience level is a close match.');
  else if (parts.experienceScore !== null && parts.experienceScore >= 40) sentences.push('Experience level partially matches.');
  else if (parts.experienceScore !== null) sentences.push('Experience level differs significantly.');

  if (parts.locationScore === 100) sentences.push('Location matches your preference.');
  else if (parts.locationScore === 30) sentences.push('Location differs from your preference.');

  if (parts.employmentScore === 100) sentences.push('Employment type matches your preference.');
  else if (parts.employmentScore === 30) sentences.push('Employment type differs from your preference.');

  return sentences.join(' ') || 'No recommendation data available for this job.';
};

const buildExplanationData = (rec, profile, job) => {
  const matchScore = rec?.match_score ?? null;
  const matchedSkills = rec?.matched_skills ?? [];
  const missingSkills = rec?.missing_skills ?? [];
  const preferredRoles = Array.isArray(profile.preferred_roles) ? profile.preferred_roles : [];

  const roleScore = calcRoleScore(job.title, preferredRoles);
  const experienceScore = calcExperienceScore(
    job.experience_level,
    profile.experience_level,
    profile.experience,
  );
  const locationScore = calcLocationScore(job.location, profile.location);
  const employmentScore = calcEmploymentTypeScore(job.employment_type, ['Full-time']);

  const summary = buildSummary({
    matchScore,
    matchedSkills,
    missingSkills,
    roleScore,
    experienceScore,
    locationScore,
    employmentScore,
  });

  return {
    match_score: matchScore,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    experience: {
      matched: experienceScore !== null && experienceScore >= 70,
      score: experienceScore,
      user_level: profile.experience_level || null,
      job_level: job.experience_level || null,
    },
    role: {
      matched: roleScore === 100,
      score: roleScore,
      preferred_roles: preferredRoles,
      job_title: job.title,
    },
    location: {
      matched: locationScore === 100,
      score: locationScore,
      user_location: profile.location || null,
      job_location: job.location || null,
    },
    employment: {
      matched: employmentScore === 100,
      score: employmentScore,
      job_type: job.employment_type || null,
    },
    summary,
  };
};

const explainJobMatch = async (clerkId, jobId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: rec, error: recError } = await supabase
    .from('job_recommendations')
    .select('match_score, matched_skills, missing_skills, explanation_data, explanation_generated_at')
    .eq('user_id', user.id)
    .eq('job_id', jobId)
    .maybeSingle();

  if (recError) throw recError;

  if (rec?.explanation_data) {
    return rec.explanation_data;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('preferred_roles, location, experience, experience_level')
    .eq('user_id', user.id)
    .single();

  if (profileError) throw profileError;

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('title, location, experience_level, employment_type')
    .eq('id', jobId)
    .single();

  if (jobError) throw jobError;

  const explanation = buildExplanationData(rec, profile, job);

  if (rec) {
    const { error: updateError } = await supabase
      .from('job_recommendations')
      .update({
        explanation_data: explanation,
        explanation_generated_at: new Date().toISOString(),
      })
      .eq('id', rec.id);

    if (updateError) console.error('Failed to cache explanation:', updateError);
  }

  return explanation;
};

module.exports = {
  explainJobMatch,
};
