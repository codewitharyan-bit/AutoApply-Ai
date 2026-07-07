const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function getResume(token) {
  const response = await fetch(`${API_BASE}/resume`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch resume')
  }

  return result.data
}

export async function uploadResume(token, file, onProgress) {
  const formData = new FormData()
  formData.append('resume', file)

  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      try {
        const result = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && result.success) {
          resolve(result.data)
        } else {
          reject(new Error(result.message || 'Upload failed'))
        }
      } catch {
        reject(new Error('Invalid response from server'))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.open('POST', `${API_BASE}/resume`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.send(formData)
  })
}

export async function parseResume(token) {
  const response = await fetch(`${API_BASE}/resume/parse`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to parse resume')
  }

  return result.data
}

export async function viewResume(token) {
  const response = await fetch(`${API_BASE}/resume/view`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to get resume view URL')
  }

  return result.url
}

export async function applyParsedData(token, data) {
  const response = await fetch(`${API_BASE}/resume/apply-parsed`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to apply parsed data to profile')
  }

  return result.data
}

export async function deleteResume(token) {
  const response = await fetch(`${API_BASE}/resume`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to delete resume')
  }

  return result
}
