const { getAuth } = require("@clerk/express");

const requireAuth = (req, res, next) => {
  const auth = getAuth(req);

  const authHeader = req.headers.authorization || "";

  console.log("=== DASHBOARD ===");
  console.log("Token prefix:", authHeader.substring(0, 80));
  console.log("Auth:", auth);

  if (!auth.userId) {
    console.log("401 FROM REQUIREAUTH");
    return res.status(401).json({
      source: "requireAuth",
      success: false,
      message: "Unauthorized",
    });
  }

  req.clerkId = auth.userId;

  console.log("PASS REQUIREAUTH");

  next();
};

module.exports = { requireAuth };