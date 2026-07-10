import { motion } from 'framer-motion'

function StatusCard({ enabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 hover:bg-white/[0.03] hover:border-primary/20 transition-all"
    >
      <p className="text-[11px] text-text-secondary mb-3">Status</p>
      <div className="flex items-center gap-2.5">
        <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-text-secondary/30'}`} />
        <span className={`text-base font-bold ${enabled ? 'text-emerald-400' : 'text-text-secondary'}`}>
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </motion.div>
  )
}

function UsageCard({ used, limit }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 hover:bg-white/[0.03] hover:border-primary/20 transition-all"
    >
      <p className="text-[11px] text-text-secondary mb-3">Today's Usage</p>
      <p className="text-xl font-bold text-text mb-2">{used} <span className="text-sm text-text-secondary font-normal">/ {limit}</span></p>
      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </motion.div>
  )
}

function StatCard({ label, value, icon, delay = 0.08 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 hover:bg-white/[0.03] hover:border-primary/20 transition-all"
    >
      <p className="text-[11px] text-text-secondary mb-3">{label}</p>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-base text-primary">{icon}</span>
        </div>
        <span className="text-xl font-bold text-text">{value}</span>
      </div>
    </motion.div>
  )
}

function LastRunCard({ lastRun }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 hover:bg-white/[0.03] hover:border-primary/20 transition-all"
    >
      <p className="text-[11px] text-text-secondary mb-3">Last Run</p>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-base text-accent">schedule</span>
        </div>
        <span className="text-base font-bold text-text">{lastRun || 'Never'}</span>
      </div>
    </motion.div>
  )
}

export default function OverviewCards({ engine, preferences }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <StatusCard enabled={preferences.enabled} />
      <UsageCard used={engine.usageToday} limit={preferences.daily_limit} />
      <StatCard label="Jobs Matched" value={engine.matchedToday} icon="workspace_premium" delay={0.08} />
      <StatCard label="Queue" value={engine.queueCount} icon="queue" delay={0.12} />
      <LastRunCard lastRun={engine.lastRun} />
    </div>
  )
}
