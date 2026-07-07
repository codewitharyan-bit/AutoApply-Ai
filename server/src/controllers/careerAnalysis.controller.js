const { generateCareerAnalysis, getCareerAnalysis } = require('../services/careerAnalysis.service');

const generateHandler = async (req, res) => {
  try {
    const { data, created } = await generateCareerAnalysis(req.clerkId);

    return res.status(created ? 201 : 200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('[CareerAnalysis] Generate error:', err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getHandler = async (req, res) => {
  try {
    const data = await getCareerAnalysis(req.clerkId);

    return res.json({
      success: true,
      data: data || null,
    });
  } catch (err) {
    console.error('[CareerAnalysis] Fetch error:', err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  generateHandler,
  getHandler,
};
