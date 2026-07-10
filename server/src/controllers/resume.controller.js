const asyncHandler = require('../middleware/asyncHandler');
const {
  getResume,
  uploadResume,
  deleteResume,
  getResumeViewUrl,
} = require("../services/resume.service");

const {
  parseResume,
} = require("../services/resumeParser.service");

const {
  updateProfileByClerkId,
} = require("../services/profile.service");
const { scheduleAnalysis } = require("../services/careerAnalysisOrchestrator");

const getResumeController = asyncHandler(async (req, res) => {
  const resume = await getResume(req.clerkId);

  return res.json({
    success: true,
    data: resume,
  });
});

const uploadResumeController = asyncHandler(async (req, res) => {
  const resume = await uploadResume(
    req.clerkId,
    req.file
  );

  res.status(201).json({
    success: true,
    message: "Resume uploaded successfully.",
    data: resume,
  });
});

const deleteResumeController = asyncHandler(async (req, res) => {
  await deleteResume(req.clerkId);

  res.json({
    success: true,
    message: "Resume deleted successfully.",
  });
});

const viewResumeController = asyncHandler(async (req, res) => {
  const url = await getResumeViewUrl(req.clerkId);

  res.json({
    success: true,
    url,
  });
});

const parseResumeController = asyncHandler(async (req, res) => {
  const parsed = await parseResume(req.clerkId);

  return res.json({
    success: true,
    message: "Resume parsed successfully.",
    data: parsed,
  });
});

const applyParsedDataController = asyncHandler(async (req, res) => {
  const { skills, experience, education, projects, preferred_roles } = req.body;

  if (!skills && !experience && !education && !projects && !preferred_roles) {
    return res.status(400).json({
      success: false,
      message: "No parsed data provided. Send skills, experience, education, projects, or preferred_roles.",
    });
  }

  const profile = await updateProfileByClerkId(req.clerkId, {
    skills,
    experience,
    education,
    projects,
    preferred_roles,
  });

  scheduleAnalysis(req.clerkId, { trigger: 'resume.apply' }).catch(console.error);

  return res.json({
    success: true,
    message: "Parsed resume data applied to profile successfully.",
    data: profile,
  });
});

module.exports = {
  getResumeController,
  uploadResumeController,
  deleteResumeController,
  parseResumeController,
  viewResumeController,
  applyParsedDataController,
};

