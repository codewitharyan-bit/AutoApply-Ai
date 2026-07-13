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

export async function runMatchingTest(token) {
  const response = await fetch(`${API_BASE}/auto-apply/test`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Matching test failed')
  return result.data
}

export async function queueJobs(token, body) {
  const response = await fetch(`${API_BASE}/auto-apply/queue`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Failed to queue jobs')
  return result.data
}

export async function getQueue(token) {
  const response = await fetch(`${API_BASE}/auto-apply/queue`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Failed to fetch queue')
  return result.data
}

export async function removeQueueItem(token, id) {
  const response = await fetch(`${API_BASE}/auto-apply/queue/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Failed to remove queue item')
  return result.data
}

export async function runNextJob(token) {
  const response = await fetch(`${API_BASE}/auto-apply/worker/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Worker run failed')
  return result.data
}

export async function runBatch(token) {
  const response = await fetch(`${API_BASE}/auto-apply/worker/run-all`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Worker batch failed')
  return result.data
}

export async function getActivity(token, { limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset })
  const response = await fetch(`${API_BASE}/auto-apply/activity?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Failed to fetch activity')
  return result.data
}
