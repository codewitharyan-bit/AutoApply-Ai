import { useState, useEffect, useCallback, useRef } from 'react'
import { getFreshToken } from '../utils/auth'
import { getPreferences, updatePreferences } from '../services/autoApply'

function deepEqual(a, b) {
  if (a === b) return true
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (Array.isArray(a[key]) && Array.isArray(b[key])) {
      if (a[key].length !== b[key].length) return false
      for (let i = 0; i < a[key].length; i++) {
        if (a[key][i] !== b[key][i]) return false
      }
    } else if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export default function useAutoApplyPreferences(getToken) {
  const [preferences, setPreferences] = useState(null)
  const [savedPreferences, setSavedPreferences] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const mountedRef = useRef(true)
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken

  const fetchPreferences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getFreshToken(getTokenRef.current)
      const data = await getPreferences(token)
      if (data && mountedRef.current) {
        setPreferences(data)
        setSavedPreferences({ ...data })
      } else if (mountedRef.current) {
        setLoading(false)
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchPreferences()
    return () => { mountedRef.current = false }
  }, [fetchPreferences])

  const isDirty = preferences && savedPreferences
    ? !deepEqual(preferences, savedPreferences)
    : false

  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => (prev ? { ...prev, [key]: value } : prev))
  }, [])

  const save = useCallback(async () => {
    if (!preferences || !isDirty) return
    setSaving(true)
    try {
      const token = await getFreshToken(getTokenRef.current)
      const updated = await updatePreferences(token, preferences)
      if (mountedRef.current) {
        setPreferences(updated)
        setSavedPreferences({ ...updated })
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message)
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [preferences, isDirty])

  const reset = useCallback(() => {
    if (savedPreferences) {
      setPreferences({ ...savedPreferences })
    }
  }, [savedPreferences])

  return {
    preferences,
    loading,
    error,
    saving,
    isDirty,
    updatePreference,
    save,
    reset,
    fetchPreferences,
  }
}
