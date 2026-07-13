const asyncHandler = require('../middleware/asyncHandler');
const { getPreferences } = require('../services/autoApply.service');
const { getJobs } = require('../services/job.service');
const { getRecommendationsByUser } = require('../services/jobRecommendation.service');
const { getCareerAnalysis } = require('../services/careerAnalysis.service');
const { ENGINE_VERSION, findEligibleJobs } = require('../services/matching.service');

const testMatching = asyncHandler(async (req, res) => {
  const started = Date.now();

  const [preferences, jobs, recommendations, careerAnalysis] = await Promise.all([
    getPreferences(req.clerkId),
    getJobs(),
    getRecommendationsByUser(req.clerkId),
    getCareerAnalysis(req.clerkId),
  ]);

  const result = findEligibleJobs({
    jobs,
    recommendations,
    careerAnalysis,
    preferences,
  });

  return res.json({
    success: true,
    data: {
      ...result,
      meta: {
        engineVersion: ENGINE_VERSION,
        executionTimeMs: Date.now() - started,
        generatedAt: new Date().toISOString(),
      },
    },
  });
});

module.exports = { testMatching };