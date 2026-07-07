const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getDashboard(token, options = {}) {
  const response = await fetch(`${API_BASE}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to fetch dashboard data')
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch dashboard data')
  }

  return result.data
}
