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

const getResumeController = async (req, res) => {
  try {
    const resume = await getResume(req.clerkId);

    return res.json({
      success: true,
      data: resume,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const uploadResumeController = async (req, res) => {
  try {
    const resume = await uploadResume(
      req.clerkId,
      req.file
    );

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: resume,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteResumeController = async (req, res) => {
  try {
    await deleteResume(req.clerkId);

    res.json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewResumeController = async (req, res) => {
  try {
    const url = await getResumeViewUrl(req.clerkId);

    res.json({
      success: true,
      url,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const parseResumeController = async (req, res) => {
  try {
    const parsed = await parseResume(req.clerkId);

    return res.json({
      success: true,
      message: "Resume parsed successfully.",
      data: parsed,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

const applyParsedDataController = async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getResumeController,
  uploadResumeController,
  deleteResumeController,
  parseResumeController,
  viewResumeController,
  applyParsedDataController,
};

