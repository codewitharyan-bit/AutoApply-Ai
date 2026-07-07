const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getProfile(token) {
  const response = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch profile')
  }

  return result.data
}

export async function updateProfile(token, data) {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to update profile')
  }

  return result.data
}
