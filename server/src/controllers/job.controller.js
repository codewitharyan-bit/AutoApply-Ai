const {
  getJobs,
  getJobById,
} = require('../services/job.service')

const getAllJobs = async (req, res) => {
  try {
    const jobs = await getJobs()

    return res.status(200).json({
      success: true,
      data: jobs,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getSingleJob = async (req, res) => {
  try {
    const job = await getJobById(req.params.id)

    return res.status(200).json({
      success: true,
      data: job,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const { runJobImport } = require("../services/jobImport.service");
const { scheduleAnalysis } = require("../services/careerAnalysisOrchestrator");

const importJobs = async (req, res) => {
  try {

    const result = await runJobImport(req.clerkId);

    scheduleAnalysis(req.clerkId, { trigger: 'job.import' }).catch(console.error);

    return res.json({
      success: true,
      message: "Jobs imported successfully.",
      data: result,
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
  getAllJobs,
  getSingleJob,
  importJobs,
}