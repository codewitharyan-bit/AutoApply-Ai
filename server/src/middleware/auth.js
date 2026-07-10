const { getAuth } = require("@clerk/express");

const requireAuth = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({
      source: "requireAuth",
      success: false,
      message: "Unauthorized",
    });
  }

  req.clerkId = auth.userId;

  next();
};

module.exports = { requireAuth };