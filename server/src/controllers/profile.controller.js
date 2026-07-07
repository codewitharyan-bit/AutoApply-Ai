const {
  getProfileByClerkId,
  updateProfileByClerkId,
} = require('../services/profile.service')
const { scheduleAnalysis } = require('../services/careerAnalysisOrchestrator')

const getProfile = async (req, res) => {
  try {
    const result = await getProfileByClerkId(req.clerkId)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const profile = await updateProfileByClerkId(
      req.clerkId,
      req.body
    )

    scheduleAnalysis(req.clerkId, { trigger: 'profile.update' }).catch(console.error);

    return res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getProfile,
  updateProfile,
}