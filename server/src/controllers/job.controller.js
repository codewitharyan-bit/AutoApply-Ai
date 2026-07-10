const asyncHandler = require('../middleware/asyncHandler');
const {
  getJobs,
  getJobById,
} = require('../services/job.service')

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await getJobs()

  return res.status(200).json({
    success: true,
    data: jobs,
  })
})

const getSingleJob = asyncHandler(async (req, res) => {
  const job = await getJobById(req.params.id)

  return res.status(200).json({
    success: true,
    data: job,
  })
})

const { runJobImport } = require("../services/jobImport.service");
const { scheduleAnalysis } = require("../services/careerAnalysisOrchestrator");

const importJobs = asyncHandler(async (req, res) => {
  const result = await runJobImport(req.clerkId);

  scheduleAnalysis(req.clerkId, { trigger: 'job.import' }).catch(console.error);

  return res.json({
    success: true,
    message: "Jobs imported successfully.",
    data: result,
  });
});

module.exports = {
  getAllJobs,
  getSingleJob,
  importJobs,
}