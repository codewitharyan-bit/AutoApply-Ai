const express = require("express");

const {
  createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
} = require("../controllers/application.controller");

const {
  requireAuth,
} = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, createApplication);

router.get("/", requireAuth, getApplications);

router.get("/:id", requireAuth, getApplication);

router.patch("/:id", requireAuth, updateApplication);

router.delete("/:id", requireAuth, deleteApplication);

module.exports = router;