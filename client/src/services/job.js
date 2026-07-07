const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getJobs(token) {
  const response = await fetch(`${API_BASE}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch jobs')
  }

  return result.data
}

export async function importJobs(token) {
  const response = await fetch(`${API_BASE}/jobs/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to import jobs')
  }

  return result.data
}

export async function getJob(token, id) {
  const response = await fetch(`${API_BASE}/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch job')
  }

  return result.data
}

export async function getJobExplanation(token, jobId) {
  const response = await fetch(`${API_BASE}/recommendations/${jobId}/explanation`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch explanation')
  }

  return result.data
}
