const {
  getDashboardData,
} = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  try {
    console.log("Dashboard controller reached");
    console.log("clerkId:", req.clerkId);

    const dashboard = await getDashboardData(req.clerkId);

    return res.json({
      success: true,
      data: dashboard,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  getDashboard,
};