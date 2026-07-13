const asyncHandler = require('../middleware/asyncHandler');
const queueService = require('../services/queue.service');

const queueJobs = asyncHandler(async (req, res) => {
  const { jobs } = req.body;

  if (!Array.isArray(jobs)) {
    return res.status(400).json({ success: false, message: 'jobs must be an array' });
  }

  const result = await queueService.queueJobs({ clerkId: req.clerkId, jobs });

  return res.json({ success: true, data: result });
});

const getQueue = asyncHandler(async (req, res) => {
  const items = await queueService.getQueue(req.clerkId);

  return res.json({ success: true, data: items });
});

const removeQueueItem = asyncHandler(async (req, res) => {
  await queueService.removeQueueItem(req.params.id, req.clerkId);

  return res.json({ success: true, data: null });
});

const updateQueueStatus = asyncHandler(async (req, res) => {
  const { status, failure_reason } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'status is required' });
  }

  await queueService.updateStatus(req.params.id, req.clerkId, { status, failure_reason });

  return res.json({ success: true, data: null });
});

module.exports = { queueJobs, getQueue, removeQueueItem, updateQueueStatus };