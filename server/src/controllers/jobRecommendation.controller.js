const asyncHandler = require('../middleware/asyncHandler');
const {
  generateRecommendations,
} = require("../services/jobRecommendation.service");

const {
  explainJobMatch,
} = require("../services/jobExplanation.service");

const generateRecommendationsController = asyncHandler(async (req, res) => {
  const recommendations =
    await generateRecommendations(req.clerkId);

  res.json({
    success: true,
    data: recommendations,
  });
});

const getJobExplanation = asyncHandler(async (req, res) => {
  const explanation = await explainJobMatch(
    req.clerkId,
    req.params.jobId,
  );

  res.json({
    success: true,
    data: explanation,
  });
});

module.exports = {
  generateRecommendationsController,
  getJobExplanation,
};