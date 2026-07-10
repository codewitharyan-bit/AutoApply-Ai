import { motion } from 'framer-motion'

const PLACEHOLDER_ENTRIES = [
  { type: 'success', icon: 'check_circle', text: 'Job matched' },
  { type: 'success', icon: 'check_circle', text: 'Added to queue' },
  { type: 'success', icon: 'check_circle', text: 'Application submitted' },
  { type: 'error', icon: 'cancel', text: 'Application failed' },
]

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
            <p className="text-xs text-text-secondary/60 mt-1">When automation starts you'll see</p>
          </div>
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {PLACEHOLDER_ENTRIES.map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-base ${entry.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {entry.icon}
                </span>
                <span className={`text-xs ${entry.type === 'success' ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                  {entry.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="bg-[#0A0A0F] border border-border rounded-xl p-4 flex items-center gap-3">
              <span className={`material-symbols-outlined text-lg ${item.type === 'success' ? 'text-emerald-400' : item.type === 'skipped' ? 'text-amber-400' : 'text-rose-400'}`}>
                {item.type === 'success' ? 'check_circle' : item.type === 'skipped' ? 'skip_next' : 'cancel'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{item.company}</p>
                <p className="text-xs text-text-secondary">{item.message}</p>
              </div>
              {item.time && <span className="text-[10px] text-text-secondary/60 shrink-0">{item.time}</span>}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
