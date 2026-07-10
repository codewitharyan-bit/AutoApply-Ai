import { motion } from 'framer-motion'

export default function QueueSection({ items = [], loading = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-base font-bold text-text mb-3">Application Queue</h2>
      {loading ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl text-text-secondary animate-spin">sync</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-primary">queue</span>
          </div>
          <div>
            <p className="text-sm text-text-secondary">No pending applications.</p>
            <p className="text-xs text-text-secondary/60 mt-1 max-w-sm">
              Jobs matching your rules will appear here before they are submitted automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="bg-[#0A0A0F] border border-border rounded-xl p-4">
              <p className="text-sm text-text">{item.job}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
