import { useEffect } from 'react'

export default function useKeyboardShortcut(key, callback) {
  useEffect(() => {
    const handler = (e) => {
      const isModifier = e.metaKey || e.ctrlKey
      if (!isModifier) return
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      e.preventDefault()
      callback(e)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, callback])
}
