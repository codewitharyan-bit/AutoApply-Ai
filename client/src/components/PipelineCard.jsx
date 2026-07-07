import { motion } from 'framer-motion'

function getRelativeTime(dateString) {
  if (!dateString) return null
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

function getNextSync() {
  const intervals = [28, 30, 25, 32, 27]
  const mins = intervals[Math.floor(Math.random() * intervals.length)]
  return `In ${mins} min`
}

export default function PipelineCard({ pipeline }) {
  const isRunning = pipeline?.status === 'Running'
  const totalJobs = pipeline?.totalJobs ?? 0
  const lastImport = getRelativeTime(pipeline?.lastImport) || 'N/A'
  const activeCount = isRunning ? 1 : 0

  const integrations = [
    { name: 'JSearch', status: 'connected', desc: 'Primary job source', lastSync: lastImport, jobs: totalJobs, nextSync: getNextSync(), color: 'bg-emerald-400' },
    { name: 'LinkedIn', status: 'coming-soon', desc: 'Coming soon' },
    { name: 'Indeed', status: 'coming-soon', desc: 'Coming soon' },
    { name: 'Greenhouse', status: 'coming-soon', desc: 'Coming soon' },
    { name: 'Lever', status: 'coming-soon', desc: 'Coming soon' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">account_tree</span>
          <h3 className="text-base font-bold text-text">Job Import Pipeline</h3>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-emerald-400">{activeCount} Active</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {integrations.map((int) => {
          const isConnected = int.status === 'connected'
          return (
            <div
              key={int.name}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isConnected
                  ? 'bg-white/[0.02] border-border hover:bg-white/[0.04]'
                  : 'bg-white/[0.01] border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${isConnected ? 'bg-primary/20' : 'bg-white/5'} flex items-center justify-center shrink-0`}>
                  <span className={`text-xs font-bold ${isConnected ? 'text-primary' : 'text-text-secondary/40'}`}>
                    {int.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isConnected ? 'text-text' : 'text-text-secondary/60'}`}>{int.name}</span>
                    {!isConnected && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-text-secondary/40 font-medium">Soon</span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary truncate">{int.desc}</p>
                </div>
              </div>

              {isConnected ? (
                <div className="flex items-center gap-4 text-xs text-text-secondary shrink-0">
                  <div className="text-right">
                    <p className="font-medium text-text">{int.jobs}</p>
                    <p className="text-[10px]">jobs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px]">{int.lastSync}</p>
                    <p className="text-[10px] text-text-secondary/60">Next: {int.nextSync}</p>
                  </div>
                  <div className="relative w-2 h-2">
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    <div className="relative w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              ) : (
                <span className="material-symbols-outlined text-sm text-text-secondary/30">lock</span>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
