const asyncHandler = require('../middleware/asyncHandler');
const {
  getProfileByClerkId,
  updateProfileByClerkId,
} = require('../services/profile.service')
const { scheduleAnalysis } = require('../services/careerAnalysisOrchestrator')

const getProfile = asyncHandler(async (req, res) => {
  const result = await getProfileByClerkId(req.clerkId)

  return res.status(200).json({
    success: true,
    data: result,
  })
})

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfileByClerkId(
    req.clerkId,
    req.body
  )

  scheduleAnalysis(req.clerkId, { trigger: 'profile.update' }).catch(console.error);

  return res.json({
    success: true,
    data: profile,
  })
})

module.exports = {
  getProfile,
  updateProfile,
}