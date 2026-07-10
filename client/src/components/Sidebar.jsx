import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'jobs', label: 'Jobs', icon: 'work' },
  { id: 'applications', label: 'Applications', icon: 'description' },
  { id: 'resume', label: 'Resume', icon: 'badge' },
  { id: 'ai-recommendations', label: 'AI Recommendations', icon: 'auto_awesome' },
  { id: 'auto-apply', label: 'Auto Apply', icon: 'bolt' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

const spring = { type: 'spring', stiffness: 300, damping: 30 }

export default function Sidebar({ activeView, onNavigateHome }) {
  const navigate = useNavigate()
  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#0A0A0F] border-r border-border z-40">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <span className="text-lg font-bold text-text">AutoApply</span>
        </button>
        <p className="text-[11px] text-text-secondary mt-1 ml-9">AI Job Automation</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                const path = item.id === 'dashboard' ? '/dashboard' : `/${item.id}`
                navigate(path)
              }}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-primary/15 rounded-lg border border-primary/20"
                  transition={spring}
                />
              )}
              <span className="relative z-10 material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
                  transition={spring}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="px-3 py-3 border-t border-border flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}
