const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getPreferences(token, signal) {
  const response = await fetch(`${API_BASE}/auto-apply`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  if (response.status === 304) return null
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Failed to fetch preferences')
  return result.data
}

export async function updatePreferences(token, preferences) {
  const response = await fetch(`${API_BASE}/auto-apply`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Failed to update preferences')
  return result.data
}
