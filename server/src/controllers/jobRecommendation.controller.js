const {
  generateRecommendations,
} = require("../services/jobRecommendation.service");

const {
  explainJobMatch,
} = require("../services/jobExplanation.service");

const generateRecommendationsController = async (
  req,
  res
) => {
  try {
    const recommendations =
      await generateRecommendations(req.clerkId);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getJobExplanation = async (req, res) => {
  try {
    const explanation = await explainJobMatch(
      req.clerkId,
      req.params.jobId,
    );

    res.json({
      success: true,
      data: explanation,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  generateRecommendationsController,
  getJobExplanation,
};