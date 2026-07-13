import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAILURE_LABELS = {
  excludedCompany: 'Company',
  location: 'Location',
  jobType: 'Job Type',
  experience: 'Experience',
  skills: 'Skills',
  matchScore: 'AI Match',
  resumeScore: 'Resume Score',
}

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

function RejectedCard({ count, expanded, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      onClick={onClick}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 hover:bg-white/[0.03] hover:border-primary/20 transition-all text-left w-full cursor-pointer"
    >
      <p className="text-[11px] text-text-secondary mb-3 flex items-center gap-1">
        Rejected Jobs
        <span className={`material-symbols-outlined text-sm transition-transform ${expanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </p>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-base text-rose-400">cancel</span>
        </div>
        <span className="text-xl font-bold text-text">{count}</span>
      </div>
    </motion.button>
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

export default function OverviewCards({ engine, preferences, testResult }) {
  const [rejectedExpanded, setRejectedExpanded] = useState(false)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatusCard enabled={preferences.enabled} />
        <UsageCard used={engine.usageToday} limit={preferences.daily_limit} />
        {testResult ? (
          <>
            <StatCard label="Scanned" value={testResult.scanned} icon="search" delay={0.08} />
            <StatCard label="Eligible" value={testResult.eligible} icon="check_circle" delay={0.12} />
            <RejectedCard
              count={testResult.rejected}
              expanded={rejectedExpanded}
              onClick={() => setRejectedExpanded((v) => !v)}
            />
          </>
        ) : (
          <>
            <StatCard label="Jobs Matched" value={engine.matchedToday} icon="workspace_premium" delay={0.08} />
            <StatCard label="Queue" value={engine.queueCount} icon="queue" delay={0.12} />
            <LastRunCard lastRun={engine.lastRun} />
          </>
        )}
      </div>

      <AnimatePresence>
        {rejectedExpanded && testResult && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-4 mt-3">
              <p className="text-[11px] text-text-secondary mb-3">Rejection Breakdown</p>
              {(() => {
                const failures = testResult.statistics.failures
                const rejected = testResult.rejected
                const maxVal = Math.max(...Object.values(failures), 1)
                const entries = Object.entries(failures)
                  .filter(([, c]) => c > 0)
                  .sort(([, a], [, b]) => b - a)

                return entries.map(([key, count]) => (
                  <div key={key} className="flex items-center gap-3 py-1">
                    <span className="text-xs text-text-secondary w-24 shrink-0">
                      {FAILURE_LABELS[key] || key}
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${(count / maxVal) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-text w-12 text-right shrink-0">{count}</span>
                    <span className="text-xs text-text-secondary/60 w-14 text-right shrink-0">
                      ({rejected > 0 ? Math.round((count / rejected) * 100) : 0}%)
                    </span>
                  </div>
                ))
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
