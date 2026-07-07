const supabase = require('../config/supabase')

const EXPERIENCE_LEVELS = new Set([
  'Fresher',
  '0-1 Years',
  '1-2 Years',
  '2-3 Years',
  '3-5 Years',
  '5-7 Years',
  '7-10 Years',
  '10+ Years',
])

const normalizeExperienceLevel = (value) => {
  if (typeof value !== 'string') return 'Fresher'
  const trimmed = value.trim()
  if (!trimmed) return 'Fresher'
  return EXPERIENCE_LEVELS.has(trimmed) ? trimmed : 'Fresher'
}

const hasExperience = (exp) => {
  if (!exp) return false
  if (Array.isArray(exp)) return exp.length > 0
  if (typeof exp === "string") return exp.trim().length > 0
  return false
}

const calcCompletion = (profile) => {
  if (!profile) return 0
  let score = 0
  if (profile.skills?.length > 0) score += 20
  if (hasExperience(profile.experience)) score += 25
  if (profile.preferred_roles?.length > 0) score += 20
  if (profile.location?.trim()) score += 15
  if (profile.resume_url) score += 20
  if (profile.education?.length > 0) score += 10
  if (profile.projects?.length > 0) score += 10
  return Math.min(score, 100)
}

const getProfileByClerkId = async (clerkId) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single()

  if (userError) {
    throw new Error(userError.message)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  return { ...profile, completion: calcCompletion(profile) }
}

const normalizeExperienceForDb = (exp) => {
  if (!exp) return []
  if (Array.isArray(exp)) return exp
  if (typeof exp === "string") {
    const trimmed = exp.trim()
    if (!trimmed) return []
    return [{ description: trimmed }]
  }
  return []
}

const updateProfileByClerkId = async (clerkId, profileData) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single()

  if (userError) {
    throw new Error(userError.message)
  }

  const payload = { ...profileData, updated_at: new Date().toISOString() }

  if (payload.experience !== undefined) {
    payload.experience = normalizeExperienceForDb(payload.experience)
  }

  if (payload.experience_level !== undefined) {
    payload.experience_level = normalizeExperienceLevel(payload.experience_level)
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return { ...data, completion: calcCompletion(data) }
}

module.exports = {
  getProfileByClerkId,
  updateProfileByClerkId,
}