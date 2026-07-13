const ENGINE_VERSION = '1.0';

const JOB_FIELDS = [
  'id',
  'title',
  'company',
  'location',
  'employment_type',
  'job_url',
  'remote_type',
];

const CHECK_KEYS = [
  'company',
  'location',
  'jobType',
  'experience',
  'skills',
  'matchScore',
  'resumeScore',
];

const FAILURE_KEYS = [
  'excludedCompany',
  'location',
  'jobType',
  'experience',
  'skills',
  'matchScore',
  'resumeScore',
];

const RULES = [
  { key: 'company',    statistic: 'excludedCompany', fn: matchesExcludedCompany },
  { key: 'location',   statistic: 'location',         fn: matchesLocation },
  { key: 'jobType',    statistic: 'jobType',           fn: matchesJobType },
  { key: 'experience', statistic: 'experience',        fn: matchesExperience },
  { key: 'skills',     statistic: 'skills',            fn: matchesRequiredSkills },
  { key: 'matchScore', statistic: 'matchScore',        fn: matchesMatchScore },
  { key: 'resumeScore',statistic: 'resumeScore',       fn: matchesResumeScore },
];

function normalizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str.toLowerCase().trim();
}

function includesIgnoreCase(text, search) {
  return normalizeText(text).includes(normalizeText(search));
}

function pickJobFields(job) {
  const dto = {};
  for (const field of JOB_FIELDS) {
    dto[field] = job[field] ?? null;
  }
  return dto;
}

function matchesExcludedCompany(job, _rec, _analysis, preferences) {
  const excluded = preferences.excluded_companies || [];
  if (excluded.length === 0) return true;

  const company = normalizeText(job.company);
  if (!company) return true;

  const isExcluded = excluded.some(c => normalizeText(c) === company);
  if (isExcluded) {
    return { eligible: false, reason: 'Company is excluded', failedRule: 'excludedCompany' };
  }
  return true;
}

function matchesLocation(job, _rec, _analysis, preferences) {
  const allowRemote = preferences.allow_remote;
  if (allowRemote && job.remote_type === 'remote') return true;

  const locations = preferences.locations || [];
  if (locations.length === 0) return true;

  const jobLocation = normalizeText(job.location);
  if (!jobLocation) {
    return { eligible: false, reason: 'Location not specified', failedRule: 'location' };
  }

  const matches = locations.some(loc => includesIgnoreCase(jobLocation, loc));
  if (!matches) {
    return { eligible: false, reason: 'Location mismatch', failedRule: 'location' };
  }
  return true;
}

function matchesJobType(job, _rec, _analysis, preferences) {
  const jobTypes = preferences.job_types || [];
  if (jobTypes.length === 0) return true;

  const jobType = normalizeText(job.employment_type);
  if (!jobType) {
    return { eligible: false, reason: 'Job type not specified', failedRule: 'jobType' };
  }

  const matches = jobTypes.some(jt => includesIgnoreCase(jobType, jt));
  if (!matches) {
    return { eligible: false, reason: 'Job type mismatch', failedRule: 'jobType' };
  }
  return true;
}

function matchesExperience(job, _rec, _analysis, preferences) {
  const expLevels = preferences.experience_levels || [];
  if (expLevels.length === 0) return true;

  const jobExp = normalizeText(job.experience_level);
  if (!jobExp) {
    return { eligible: false, reason: 'Experience not specified', failedRule: 'experience' };
  }

  const matches = expLevels.some(el => includesIgnoreCase(jobExp, el));
  if (!matches) {
    return { eligible: false, reason: 'Experience mismatch', failedRule: 'experience' };
  }
  return true;
}

function matchesRequiredSkills(job, _rec, _analysis, preferences) {
  const preferredSkills = preferences.required_skills || [];
  if (preferredSkills.length === 0) return true;

  const jobSkills = (job.required_skills || []).map(s => normalizeText(s));
  if (jobSkills.length === 0) {
    return { eligible: false, reason: 'Job has no required skills listed', failedRule: 'skills' };
  }

  const preferredNorm = preferredSkills.map(s => normalizeText(s));

  const anyMatch = preferredNorm.some(ps => jobSkills.includes(ps));
  if (!anyMatch) {
    return { eligible: false, reason: 'Required skills mismatch', failedRule: 'skills' };
  }
  return true;
}

function matchesMatchScore(job, recommendation, _analysis, preferences) {
  const minScore = preferences.minimum_match_score ?? 80;
  const matchScore = recommendation?.match_score ?? 0;

  if (matchScore < minScore) {
    return { eligible: false, reason: 'AI match score too low', failedRule: 'matchScore' };
  }
  return true;
}

function matchesResumeScore(job, _rec, careerAnalysis, preferences) {
  const minScore = preferences.minimum_resume_score ?? 75;
  const resumeScore = careerAnalysis?.resume_score ?? 0;

  if (resumeScore < minScore) {
    return { eligible: false, reason: 'Resume score too low', failedRule: 'resumeScore' };
  }
  return true;
}

function collectWarnings(job) {
  const warnings = [];

  if (!job.salary) {
    warnings.push({
      code: 'salary_unlisted',
      severity: 'info',
      message: 'Salary not listed',
    });
  }

  if (!job.experience_level) {
    warnings.push({
      code: 'experience_unlisted',
      severity: 'info',
      message: 'Experience level not specified',
    });
  }

  if (!job.job_url) {
    warnings.push({
      code: 'no_company_url',
      severity: 'info',
      message: 'Company website not available',
    });
  }

  if (!job.required_skills || job.required_skills.length === 0) {
    warnings.push({
      code: 'no_required_skills',
      severity: 'info',
      message: 'No required skills listed',
    });
  }

  return warnings;
}

function buildSummary(matchedSkills, missingSkills) {
  const matched = matchedSkills?.length || 0;
  const missing = missingSkills?.length || 0;
  const total = matched + missing;
  return {
    matched,
    missing,
    total,
    percentage: total > 0 ? Math.round((matched / total) * 100) : 0,
  };
}

function evaluateJob(job, recommendation, careerAnalysis, preferences) {
  const checks = {};
  for (const key of CHECK_KEYS) {
    checks[key] = null;
  }

  for (const rule of RULES) {
    const outcome = rule.fn(job, recommendation, careerAnalysis, preferences);

    if (outcome === true) {
      checks[rule.key] = true;
    } else {
      checks[outcome.failedRule] = false;
      return {
        job: pickJobFields(job),
        eligible: false,
        reason: outcome.reason,
        failedRule: outcome.failedRule,
        matchScore: 0,
        resumeScore: 0,
        scoreBreakdown: {
          aiMatch: 0,
          resume: 0,
          minimumRequired: {
            aiMatch: preferences.minimum_match_score ?? 80,
            resume: preferences.minimum_resume_score ?? 75,
          },
        },
        matchedSkills: [],
        missingSkills: [],
        summary: { matched: 0, missing: 0, total: 0, percentage: 0 },
        warnings: [],
        checks,
      };
    }
  }

  const matchScore = recommendation?.match_score ?? 0;
  const resumeScore = careerAnalysis?.resume_score ?? 0;
  const matchedSkills = recommendation?.matched_skills || [];
  const missingSkills = recommendation?.missing_skills || [];

  return {
    job: pickJobFields(job),
    eligible: true,
    reason: null,
    failedRule: null,
    matchScore,
    resumeScore,
    scoreBreakdown: {
      aiMatch: matchScore,
      resume: resumeScore,
      minimumRequired: {
        aiMatch: preferences.minimum_match_score ?? 80,
        resume: preferences.minimum_resume_score ?? 75,
      },
    },
    matchedSkills,
    missingSkills,
    summary: buildSummary(matchedSkills, missingSkills),
    warnings: collectWarnings(job),
    checks,
  };
}

function findEligibleJobs({ jobs, recommendations, careerAnalysis, preferences }) {
  const recsMap = new Map();
  if (recommendations) {
    for (const rec of recommendations) {
      recsMap.set(rec.job_id, rec);
    }
  }

  const eligibleJobs = [];
  const rejectedJobs = [];
  const statistics = {
    passed: 0,
    failed: 0,
    failures: {},
  };
  for (const key of FAILURE_KEYS) {
    statistics.failures[key] = 0;
  }

  const jobList = jobs || [];
  for (const job of jobList) {
    const recommendation = recsMap.get(job.id) || null;
    const result = evaluateJob(job, recommendation, careerAnalysis, preferences);

    if (result.eligible) {
      eligibleJobs.push(result);
      statistics.passed++;
    } else {
      rejectedJobs.push(result);
      statistics.failed++;
      statistics.failures[result.failedRule]++;
    }
  }

  return {
    scanned: jobList.length,
    eligible: eligibleJobs.length,
    rejected: rejectedJobs.length,
    statistics,
    jobs: eligibleJobs,
    rejectedJobs,
  };
}

module.exports = {
  ENGINE_VERSION,
  findEligibleJobs,
};
