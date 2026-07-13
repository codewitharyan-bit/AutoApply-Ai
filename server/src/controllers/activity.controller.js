const asyncHandler = require('../middleware/asyncHandler');
const activityService = require('../services/activity.service');

const getActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const offset = parseInt(req.query.offset, 10) || 0;

  const items = await activityService.listActivity({
    clerkId: req.clerkId,
    limit,
    offset,
  });

  return res.json({ success: true, data: items });
});

module.exports = { getActivity };
