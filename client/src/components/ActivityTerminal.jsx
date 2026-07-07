import { motion } from 'framer-motion'

const logs = [
  { time: '10:23:04', msg: 'Imported 42 jobs from JSearch', level: 'info' },
  { time: '10:22:50', msg: 'Resume parsed successfully', level: 'success' },
  { time: '10:22:15', msg: 'Generated cover letter for Senior Frontend Engineer at TechCorp', level: 'info' },
  { time: '10:21:44', msg: 'Matched 8 jobs to your profile', level: 'match' },
  { time: '10:20:30', msg: 'Auto Apply queued for 3 positions', level: 'info' },
  { time: '10:19:55', msg: 'Application submitted to MobileFirst (React Native Lead)', level: 'success' },
  { time: '10:18:22', msg: 'Skill gap detected: Docker missing from profile', level: 'warn' },
  { time: '10:17:10', msg: 'AI match score updated for backend roles: 81%', level: 'info' },
  { time: '10:15:00', msg: 'Import cycle started from JSearch', level: 'info' },
]

const levelStyles = {
  info: 'text-text-secondary',
  success: 'text-emerald-400',
  match: 'text-primary',
  warn: 'text-amber-400',
  error: 'text-rose-400',
}

export default function ActivityTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">terminal</span>
          <h3 className="text-base font-bold text-text">Activity Terminal</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 tracking-wide">LIVE</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-auto max-h-[280px] min-h-[200px]">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex gap-2.5 py-1.5 px-2 rounded hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-[11px] font-mono text-text-secondary/40 shrink-0 w-16 pt-0.5">{log.time}</span>
            <span className={`text-xs font-mono ${levelStyles[log.level] || 'text-text-secondary'}`}>
              {log.msg}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
