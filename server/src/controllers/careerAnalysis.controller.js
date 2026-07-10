const asyncHandler = require('../middleware/asyncHandler');
const { generateCareerAnalysis, getCareerAnalysis } = require('../services/careerAnalysis.service');

const generateHandler = asyncHandler(async (req, res) => {
  const { data, created } = await generateCareerAnalysis(req.clerkId);

  return res.status(created ? 201 : 200).json({
    success: true,
    data,
  });
});

const getHandler = asyncHandler(async (req, res) => {
  const data = await getCareerAnalysis(req.clerkId);

  return res.json({
    success: true,
    data: data || null,
  });
});

module.exports = {
  generateHandler,
  getHandler,
};
