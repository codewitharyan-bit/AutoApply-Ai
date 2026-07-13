import { motion } from 'framer-motion'

const EVENT_STYLES = {
  queued: { icon: 'queue', color: 'text-text-secondary' },
  started: { icon: 'play_circle', color: 'text-blue-400' },
  completed: { icon: 'check_circle', color: 'text-emerald-400' },
  failed: { icon: 'cancel', color: 'text-rose-400' },
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export default function ActivitySection({ items = [], loading = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-base font-bold text-text mb-3">Recent Activity</h2>
      {loading ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl text-text-secondary animate-spin">sync</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-6">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl text-primary">history</span>
            </div>
            <p className="text-sm text-text-secondary">No activity yet</p>
            <p className="text-xs text-text-secondary/60 mt-1">Queue a job or run the worker to see events</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const style = EVENT_STYLES[item.event] || { icon: 'circle', color: 'text-text-secondary' }
            return (
              <div key={item.id} className="bg-[#0A0A0F] border border-border rounded-xl p-4 flex items-center gap-3">
                <span className={`material-symbols-outlined text-lg ${style.color}`}>
                  {style.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{item.message}</p>
                </div>
                <span className="text-[10px] text-text-secondary/60 shrink-0">{formatTime(item.createdAt)}</span>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
