const asyncHandler = require('../middleware/asyncHandler');
const {
  getDashboardData,
} = require("../services/dashboard.service");

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardData(req.clerkId);

  return res.json({
    success: true,
    data: dashboard,
  });
});

module.exports = {
  getDashboard,
};