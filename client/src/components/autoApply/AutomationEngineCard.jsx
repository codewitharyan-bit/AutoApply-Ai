import { motion } from 'framer-motion'

const STATUS_MAP = {
  offline: { label: 'Offline', color: 'bg-text-secondary/30' },
  running: { label: 'Running', color: 'bg-emerald-400' },
  paused: { label: 'Paused', color: 'bg-amber-400' },
  error: { label: 'Error', color: 'bg-rose-400' },
}

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec} sec ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hr ago`
  return new Date(dateStr).toLocaleDateString()
}

function EngineField({ label, value, status }) {
  return (
    <div>
      <p className="text-[11px] text-text-secondary mb-1">{label}</p>
      {status !== undefined ? (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status}`} />
          <span className="text-sm font-semibold text-text">{value}</span>
        </div>
      ) : (
        <span className="text-sm font-semibold text-text">{value}</span>
      )}
    </div>
  )
}

export default function AutomationEngineCard({ engine, testResult }) {
  const statusInfo = STATUS_MAP[engine?.status] || STATUS_MAP.offline
  const dailyLimit = engine?.dailyLimit || 10
  const usagePct = dailyLimit > 0 ? Math.min(((engine?.usageToday || 0) / dailyLimit) * 100, 100) : 0
  const meta = testResult?.meta

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-5"
    >
      <h2 className="text-base font-bold text-text mb-4">Engine Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <EngineField label="Status" value={statusInfo.label} status={statusInfo.color} />
        <EngineField label="Last Scan" value={engine?.lastScan || 'Never'} />
        <EngineField label="Last Match" value={engine?.lastMatch || 'Never'} />
        <EngineField label="Next Run" value={engine?.nextRun || '--'} />
        <div>
          <p className="text-[11px] text-text-secondary mb-1">Daily Usage</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text">{engine?.usageToday || 0} / {dailyLimit}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] mt-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${usagePct}%` }} />
          </div>
        </div>
      </div>
      {meta && (
        <div className="mt-4 pt-3 border-t border-border flex gap-4 text-[11px] text-text-secondary/60">
          <span>Engine v{meta.engineVersion}</span>
          {meta.generatedAt && <span>Generated {timeAgo(meta.generatedAt)}</span>}
          <span>{meta.executionTimeMs} ms execution</span>
        </div>
      )}
    </motion.div>
  )
}
