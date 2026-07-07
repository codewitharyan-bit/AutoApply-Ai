const express = require("express");

const router = express.Router();

const { requireAuth } = require("../middleware/auth");

const {
  generateRecommendationsController,
  getJobExplanation,
} = require("../controllers/jobRecommendation.controller");

router.post(
  "/generate",
  requireAuth,
  generateRecommendationsController
);

router.get(
  "/:jobId/explanation",
  requireAuth,
  getJobExplanation
);

module.exports = router;