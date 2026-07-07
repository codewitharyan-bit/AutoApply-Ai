const supabase = require("../config/supabase");
const { getUserByClerkId } = require("./user.service");

const getDashboardData = async (clerkId) => {
  // Get authenticated user
  const user = await getUserByClerkId(clerkId);

  /* ---------------- Profile ---------------- */

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Failed to fetch profile: ${profileError.message}`);
  }

  /* ---------------- Jobs ---------------- */

  const { data: jobs = [], error: jobsError } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (jobsError) {
    throw new Error(`Failed to fetch jobs: ${jobsError.message}`);
  }

  /* ---------------- Applications ---------------- */

  const { data: applications = [], error: applicationsError } =
    await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id);

  if (applicationsError) {
    throw new Error(
      `Failed to fetch applications: ${applicationsError.message}`
    );
  }

  /* ---------------- Import Logs ---------------- */

  const { data: latestImport, error: importError } =
    await supabase
      .from("import_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (importError) {
    throw new Error(
      `Failed to fetch import logs: ${importError.message}`
    );
  }

  /* ---------------- Recommendations ---------------- */

  const {
  data: recommendations = [],
  error: recommendationError,
} = await supabase
  .from("job_recommendations")
  .select(`
    match_score,
    matched_skills,
    missing_skills,
    recommendation_reason,
    jobs (
      id,
      title,
      company,
      location,
      salary,
      description,
      job_url,
      created_at
    )
  `)
  .eq("user_id", user.id)
  .order("match_score", { ascending: false })
  .limit(5);

if (recommendationError) {
  throw new Error(
    `Failed to fetch recommendations: ${recommendationError.message}`
  );
}

// Flatten for frontend
const recommendedJobs = recommendations.map((rec) => ({
  id: rec.jobs?.id,

  title: rec.jobs?.title,

  company: rec.jobs?.company,

  location: rec.jobs?.location,

  salary: rec.jobs?.salary,

  description: rec.jobs?.description,

  job_url: rec.jobs?.job_url,

  created_at: rec.jobs?.created_at,

  matchScore: rec.match_score,

  matchedSkills: rec.matched_skills,

  missingSkills: rec.missing_skills,

  recommendationReason: rec.recommendation_reason,
}));

  /* ---------------- Dashboard Stats ---------------- */

  const today = new Date().toISOString().split("T")[0];

  const jobsImportedToday = jobs.filter((job) =>
    job.created_at?.startsWith(today)
  ).length;

  const applicationsSubmitted = applications.length;

  const interviews = applications.filter(
    (app) => app.status === "interview"
  ).length;

  const interviewRate =
    applicationsSubmitted === 0
      ? 0
      : Number(
          (
            (interviews / applicationsSubmitted) *
            100
          ).toFixed(1)
        );

  /* ---------------- Completion ---------------- */

  const hasExp = (exp) => {
    if (!exp) return false;

    if (Array.isArray(exp)) {
      return exp.length > 0;
    }

    if (typeof exp === "string") {
      return exp.trim().length > 0;
    }

    return false;
  };

  const calcCompletion = (p) => {
    if (!p) return 0;

    let score = 0;

    if (p.skills?.length > 0) score += 20;
    if (hasExp(p.experience)) score += 25;
    if (p.preferred_roles?.length > 0) score += 20;
    if (p.location?.trim()) score += 15;
    if (p.resume_url) score += 20;
    if (p.education?.length > 0) score += 10;
    if (p.projects?.length > 0) score += 10;

    return Math.min(score, 100);
  };

  /* ---------------- Career Analysis ---------------- */

  const { data: careerAnalysis, error: careerError } = await supabase
    .from("career_analysis")
    .select("resume_score, market_score")
    .eq("user_id", user.id)
    .maybeSingle();

  if (careerError) {
    console.error("Failed to fetch career analysis:", careerError.message);
  }

  /* ---------------- Response ---------------- */

  return {
    profile: profile
      ? {
          ...profile,
          completion: calcCompletion(profile),
        }
      : null,

    stats: {
      jobsImportedToday,

      // Personalized recommendations
      jobsMatched: recommendedJobs.length,

      applicationsSubmitted,

      interviewRate,

      // Future AI features
      aiMatchAccuracy: null,
      resumeScore: careerAnalysis?.resume_score ?? null,
      marketReadiness: careerAnalysis?.market_score ?? null,
    },

    pipeline: {
      status: latestImport?.status ?? "unknown",

      source: latestImport?.source ?? "JSearch",

      jobsImported:
        latestImport?.jobs_imported ?? 0,

      totalJobs: jobs.length,

      lastImport:
        latestImport?.completed_at ?? null,
    },

    recommendedJobs,
  };
};

module.exports = {
  getDashboardData,
};