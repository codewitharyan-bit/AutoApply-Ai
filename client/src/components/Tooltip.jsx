import { useState, useRef, useEffect, useLayoutEffect, useId, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTooltipContext } from '../contexts/TooltipContext'

export default function Tooltip({ content, id, children }) {
  const tooltipId = useId()
  const { activeId, open, close } = useTooltipContext()
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0, dir: 'bottom' })
  const visible = activeId === id

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current?.getBoundingClientRect()
    if (!trigger) return

    const ESTIMATED_WIDTH = 220
    let dir = 'bottom'
    let top
    let left = trigger.left + trigger.width / 2

    if (trigger.bottom + 220 > window.innerHeight) {
      dir = 'top'
      top = trigger.top - 8
    } else {
      top = trigger.bottom + 8
    }

    const half = ESTIMATED_WIDTH / 2
    if (left - half < 8) left = half + 8
    if (left + half > window.innerWidth - 8) left = window.innerWidth - half - 8

    setPos({ top, left, dir })
  }, [])

  useEffect(() => {
    if (!visible) return
    calculatePosition()

    const onScroll = () => calculatePosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [visible, calculatePosition])

  useLayoutEffect(() => {
    if (!visible || !tooltipRef.current) return
    const el = tooltipRef.current
    const actualWidth = el.offsetWidth
    const actualHeight = el.offsetHeight
    const trigger = triggerRef.current?.getBoundingClientRect()
    if (!trigger) return

    let newTop = pos.top
    let newLeft = pos.left

    if (pos.dir === 'top') {
      const rawTop = trigger.top - actualHeight - 8
      newTop = rawTop < 8 ? 8 : rawTop
    }

    const half = actualWidth / 2
    if (newLeft - half < 8) newLeft = half + 8
    if (newLeft + half > window.innerWidth - 8) newLeft = window.innerWidth - half - 8

    if (newTop !== pos.top || newLeft !== pos.left) {
      setPos((prev) => ({ ...prev, top: newTop, left: newLeft }))
    }
  }, [visible, pos.dir])

  useEffect(() => {
    if (!visible) return
    const handler = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) close(id)
    }
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [visible, id, close])

  const arrowDir = pos.dir === 'bottom' ? 'top' : 'bottom'

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => open(id)}
        onMouseLeave={() => close(id)}
        onFocus={() => open(id)}
        onBlur={() => close(id)}
        onClick={(e) => {
          e.stopPropagation()
          visible ? close(id) : open(id)
        }}
        className="inline-flex"
      >
        {children}
      </span>

      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              initial={{ opacity: 0, y: pos.dir === 'bottom' ? 4 : -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: pos.dir === 'bottom' ? 4 : -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              onMouseEnter={() => open(id)}
              onMouseLeave={() => close(id)}
              style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                transform: 'translateX(-50%)',
              }}
              className="z-50 pointer-events-auto min-w-[180px] max-w-[260px] rounded-lg bg-[#1a1a23] border border-border shadow-xl p-2.5 text-[10px] text-text-secondary leading-relaxed whitespace-normal"
            >
              <div
                className="absolute w-2 h-2 bg-[#1a1a23]"
                style={{
                  [arrowDir]: -4.5,
                  left: 'calc(50% - 4px)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'rgba(255,255,255,0.08)',
                  [arrowDir === 'top' ? 'borderBottom' : 'borderTop']: 'none',
                  [arrowDir === 'top' ? 'borderRight' : 'borderLeft']: 'none',
                  transform: 'rotate(45deg)',
                }}
              />
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
