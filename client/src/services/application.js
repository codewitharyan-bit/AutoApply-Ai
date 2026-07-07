const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function saveApplication(token, jobId) {
  const response = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobId }),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to save job')
  }

  return result.data
}

export async function getApplications(token) {
  const response = await fetch(`${API_BASE}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch applications')
  }

  return result.data
}

export async function getApplication(token, id) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch application')
  }

  return result.data
}

export async function updateApplication(token, id, status) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to update application')
  }

  return result.data
}

export async function deleteApplication(token, id) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to delete application')
  }

  return result.data
}
