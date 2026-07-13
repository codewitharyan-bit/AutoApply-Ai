const asyncHandler = require('../middleware/asyncHandler');
const workerService = require('../services/worker.service');

const runNextJob = asyncHandler(async (req, res) => {
  const result = await workerService.runNextJob(req.clerkId);
  return res.json({ success: true, data: result });
});

const runBatch = asyncHandler(async (req, res) => {
  const result = await workerService.runBatch(req.clerkId);
  return res.json({ success: true, data: result });
});

module.exports = { runNextJob, runBatch };
