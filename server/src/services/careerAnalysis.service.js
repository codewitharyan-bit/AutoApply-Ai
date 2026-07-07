const supabase = require('../config/supabase');
const { getUserByClerkId } = require('./user.service');
const { normalizeSkills, normalizeRole, getRoleDisplayName } = require('../utils/skillNormalizer');

const ANALYSIS_VERSION = 1;

const hasItems = (val) => {
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'string') return val.trim().length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return false;
};

const calcProfileCompletion = (profile) => {
  if (!profile) return 0;
  let score = 0;
  if (profile.skills?.length > 0) score += 20;
  if (Array.isArray(profile.experience) && profile.experience.length > 0) score += 25;
  if (profile.preferred_roles?.length > 0) score += 20;
  if (profile.location?.trim()) score += 15;
  if (profile.resume_url) score += 20;
  if (profile.education?.length > 0) score += 10;
  if (profile.projects?.length > 0) score += 10;
  return Math.min(score, 100);
};

const calcResumeScore = (profile) => {
  if (!profile) return 0;

  let score = 0;

  if (profile.resume_url) score += 10;
  if (hasItems(profile.skills)) score += 20;
  if (hasItems(profile.projects)) score += 15;
  if (hasItems(profile.experience)) score += 20;
  if (hasItems(profile.education)) score += 10;
  if (hasItems(profile.preferred_roles)) score += 10;

  const completion = profile.completion ?? 0;
  score += Math.round((completion / 100) * 15);

  return Math.min(score, 100);
};

const calcMarketData = (recommendedJobs, userSkills) => {
  if (!recommendedJobs || recommendedJobs.length === 0) {
    return {
      marketScore: 0,
      topMatchingSkills: [],
      missingSkills: [],
    };
  }

  const freq = {};

  for (const rec of recommendedJobs) {
    const required = rec.jobs?.required_skills || [];
    const preferred = rec.jobs?.preferred_skills || [];

    for (const skill of required) {
      const key = skill.toLowerCase().trim();
      freq[key] = (freq[key] || 0) + 2;
    }

    for (const skill of preferred) {
      const key = skill.toLowerCase().trim();
      freq[key] = (freq[key] || 0) + 1;
    }
  }

  const sortedSkills = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const userSkillSet = new Set(userSkills.map(s => s.toLowerCase().trim()));

  let userMatchCount = 0;
  const matchingSkills = [];
  const missingSkills = [];

  for (const [skill, count] of sortedSkills) {
    if (userSkillSet.has(skill)) {
      userMatchCount++;
      matchingSkills.push({ skill, count });
    } else {
      missingSkills.push({ skill, count });
    }
  }

  const marketScore = sortedSkills.length === 0
    ? 0
    : Math.round((userMatchCount / sortedSkills.length) * 100);

  return { marketScore, topMatchingSkills: matchingSkills, missingSkills };
};

const calcRoleReadiness = (allJobs, recommendationsByJob, preferredRoles) => {
  if (!preferredRoles || preferredRoles.length === 0) return {};

  const roleGroups = new Map();

  for (const role of preferredRoles) {
    const normalized = normalizeRole(role);
    if (!normalized) continue;
    if (!roleGroups.has(normalized)) {
      roleGroups.set(normalized, []);
    }
    roleGroups.get(normalized).push(role);
  }

  const result = {};

  for (const [normalized, originalRoles] of roleGroups) {
    const matchingJobIds = new Set();

    for (const job of allJobs) {
      if (!job.title) continue;
      const jobNorm = normalizeRole(job.title);
      if (jobNorm === normalized) {
        matchingJobIds.add(job.id);
      }
    }

    if (matchingJobIds.size === 0) {
      result[normalized] = 0;
      continue;
    }

    let totalScore = 0;
    let count = 0;

    for (const jobId of matchingJobIds) {
      const rec = recommendationsByJob.get(jobId);
      if (rec && rec.match_score >= 60) {
        totalScore += rec.match_score;
        count++;
      }
    }

    const displayName = getRoleDisplayName(normalized);

    if (count === 0) {
      result[displayName] = 0;
    } else {
      result[displayName] = Math.round(totalScore / count);
    }
  }

  return result;
};

const generateRoadmap = (missingSkills) => {
  if (!missingSkills || missingSkills.length === 0) return [];

  return missingSkills.map((item, index) => ({
    week: index + 1,
    skill: item.skill,
    count: item.count,
  }));
};

const generateCareerAnalysis = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) {
    throw new Error('Complete your profile first before generating a career analysis.');
  }

  const { data: recommendations, error: recError } = await supabase
    .from('job_recommendations')
    .select(`
      match_score,
      matched_skills,
      jobs (
        id,
        title,
        required_skills,
        preferred_skills
      )
    `)
    .eq('user_id', user.id)
    .gte('match_score', 60);

  if (recError) throw recError;

  const allRecommended = recommendations || [];

  const recommendedJobs = allRecommended.filter(r => r.jobs);

  const recommendationsByJob = new Map();
  for (const rec of allRecommended) {
    if (rec.jobs) {
      recommendationsByJob.set(rec.jobs.id, rec);
    }
  }

  const { data: allJobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id, title');

  if (jobsError) throw jobsError;

  const { data: latestImport, error: importError } = await supabase
    .from('import_logs')
    .select('completed_at')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (importError) throw importError;

  const profileCompletion = calcProfileCompletion(profile);

  const resumeScore = calcResumeScore({ ...profile, completion: profileCompletion });

  const userSkills = normalizeSkills(profile.skills || []);

  const { marketScore, topMatchingSkills, missingSkills } = calcMarketData(
    recommendedJobs,
    userSkills,
  );

  const preferredRoles = Array.isArray(profile.preferred_roles)
    ? profile.preferred_roles
    : [];

  const roleReadiness = calcRoleReadiness(
    allJobs || [],
    recommendationsByJob,
    preferredRoles,
  );

  const learningRoadmap = generateRoadmap(missingSkills);

  const totalJobsAnalyzed = recommendedJobs.length;

  const payload = {
    user_id: user.id,
    resume_score: resumeScore,
    market_score: marketScore,
    role_readiness: roleReadiness,
    top_matching_skills: topMatchingSkills,
    missing_skills: missingSkills,
    learning_roadmap: learningRoadmap,
    total_jobs_analyzed: totalJobsAnalyzed,
    last_job_import: latestImport?.completed_at || null,
    analysis_version: ANALYSIS_VERSION,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from('career_analysis')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let result;
  let created = false;
  if (existing) {
    const { data, error: updateError } = await supabase
      .from('career_analysis')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) throw updateError;
    result = data;
  } else {
    const { data, error: insertError } = await supabase
      .from('career_analysis')
      .insert(payload)
      .select()
      .single();

    if (insertError) throw insertError;
    result = data;
    created = true;
  }

  return { data: result, created };
};

const getCareerAnalysis = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from('career_analysis')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: latestImport } = await supabase
    .from('import_logs')
    .select('completed_at')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const isStale = !!(
    latestImport?.completed_at &&
    (!data.last_job_import || new Date(latestImport.completed_at) > new Date(data.last_job_import))
  );

  return { ...data, is_stale: isStale };
};

module.exports = {
  generateCareerAnalysis,
  getCareerAnalysis,
};
