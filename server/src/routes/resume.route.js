const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const { requireAuth } = require("../middleware/auth");

const {
  getResumeController,
  uploadResumeController,
  deleteResumeController,
  viewResumeController,
  parseResumeController,
  applyParsedDataController
} = require("../controllers/resume.controller");

router.get(
  "/",
  requireAuth,
  getResumeController
);

router.post(
  "/",
  requireAuth,
  upload.single("resume"),
  uploadResumeController
);

router.delete(
  "/",
  requireAuth,
  deleteResumeController
);

router.get(
  "/view",
  requireAuth,
  viewResumeController
);

router.post(
  "/parse",
  requireAuth,
  parseResumeController
);

router.post(
  "/apply-parsed",
  requireAuth,
  applyParsedDataController
);

module.exports = router;