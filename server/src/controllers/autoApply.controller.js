const asyncHandler = require('../middleware/asyncHandler');
const { getPreferences, updatePreferences } = require('../services/autoApply.service');

const getHandler = asyncHandler(async (req, res) => {
  const data = await getPreferences(req.clerkId);
  return res.status(200).json({ success: true, data });
});

const putHandler = asyncHandler(async (req, res) => {
  const data = await updatePreferences(req.clerkId, req.body);
  return res.json({
    success: true,
    message: "Preferences updated successfully.",
    data,
  });
});

module.exports = { getPreferences: getHandler, updatePreferences: putHandler };
