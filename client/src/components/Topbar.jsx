import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const notifications = [
  { id: 1, title: 'Import Complete', detail: '42 new jobs fetched from JSearch', time: '2 min ago', icon: 'download', color: 'text-emerald-400' },
  { id: 2, title: 'Match Found', detail: 'Senior Frontend role matches 94% of your profile', time: '15 min ago', icon: 'workspace_premium', color: 'text-primary' },
  { id: 3, title: 'Application Sent', detail: 'Auto-applied to React Native Lead at MobileFirst', time: '1 hr ago', icon: 'send', color: 'text-accent' },
]

export default function Topbar({ pipeline }) {
  const { user } = useUser()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="hidden md:block fixed top-0 left-64 right-0 z-30 bg-dark/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-14 px-6 max-w-[1440px] mx-auto">
        {/* Brand + Search */}
        <div className="flex items-center gap-6 flex-1">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
            <span className="text-sm font-bold text-text">AutoApply</span>
          </button>

          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-text-secondary/60">search</span>
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              className="w-full bg-white/[0.04] border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-text-secondary/40">
              <span className="px-1 py-0.5 rounded bg-white/[0.04] border border-border font-mono">⌘</span>
              <span className="px-1 py-0.5 rounded bg-white/[0.04] border border-border font-mono">K</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Import Status Badge */}
          {pipeline?.status === 'Running' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <div className="relative w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-medium text-emerald-400">Import Active</span>
            </div>
          )}

          {/* Pipeline Status */}
          <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">sync</span>
              <span className="text-xs text-text-secondary">Pipeline: <span className="text-text font-medium">{pipeline?.status || 'Idle'}</span></span>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-text-secondary">notifications</span>
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-[8px] font-bold text-white flex items-center justify-center">{notifications.length}</span>
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-[#14141e] border border-border shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-xs font-semibold text-text">Notifications</span>
                    <button className="text-[10px] text-primary hover:text-primary/80 transition-colors">Mark all read</button>
                  </div>
                  <div className="flex flex-col">
                    {notifications.map((n) => (
                      <button key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left border-b border-border/50 last:border-0">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                          <span className={`material-symbols-outlined text-sm ${n.color}`}>{n.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-text">{n.title}</p>
                          <p className="text-[11px] text-text-secondary mt-0.5">{n.detail}</p>
                          <p className="text-[10px] text-text-secondary/50 mt-0.5">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-border text-center">
                    <button className="text-[10px] text-text-secondary/60 hover:text-text transition-colors">View all notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-border">
            <img
              alt="Avatar"
              className="w-full h-full object-cover"
              src={user?.imageUrl || 'https://ui-avatars.com/api/?name=U&background=6366F1&color=fff&size=32'}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
