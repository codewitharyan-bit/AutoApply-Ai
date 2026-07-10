import { motion } from 'framer-motion'

const STATUS_MAP = {
  offline: { label: 'Offline', color: 'bg-text-secondary/30' },
  running: { label: 'Running', color: 'bg-emerald-400' },
  paused: { label: 'Paused', color: 'bg-amber-400' },
  error: { label: 'Error', color: 'bg-rose-400' },
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

export default function AutomationEngineCard({ engine }) {
  const statusInfo = STATUS_MAP[engine?.status] || STATUS_MAP.offline
  const dailyLimit = engine?.dailyLimit || 10
  const usagePct = dailyLimit > 0 ? Math.min(((engine?.usageToday || 0) / dailyLimit) * 100, 100) : 0

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
    </motion.div>
  )
}
