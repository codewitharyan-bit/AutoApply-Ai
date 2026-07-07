const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getCareerAnalysis(token, options = {}) {
  const response = await fetch(`${API_BASE}/career-analysis`, {
    headers: { Authorization: `Bearer ${token}` },
    ...options,
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch career analysis')
  }

  return result.data
}

export async function generateCareerAnalysis(token, options = {}) {
  const response = await fetch(`${API_BASE}/career-analysis/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    ...options,
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to generate career analysis')
  }

  return result.data
}
