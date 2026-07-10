import { createContext, useContext, useState, useCallback } from 'react'

const TooltipContext = createContext(null)

export function TooltipProvider({ children }) {
  const [activeId, setActiveId] = useState(null)
  const open = useCallback((id) => setActiveId(id), [])
  const close = useCallback((id) => setActiveId((prev) => (prev === id ? null : prev)), [])
  return (
    <TooltipContext.Provider value={{ activeId, open, close }}>
      {children}
    </TooltipContext.Provider>
  )
}

export function useTooltipContext() {
  const ctx = useContext(TooltipContext)
  if (!ctx) throw new Error('useTooltipContext must be used within TooltipProvider')
  return ctx
}
