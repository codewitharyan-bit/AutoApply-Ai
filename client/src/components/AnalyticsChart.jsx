import { motion } from 'framer-motion'

const stats = [
  { label: 'Response Rate', value: '24%', change: '+3%', icon: 'reply', color: 'emerald' },
  { label: 'Interview Conversion', value: '12.5%', change: '+2%', icon: 'trending_up', color: 'primary' },
  { label: 'Acceptance Rate', value: '8%', change: '+1%', icon: 'check_circle', color: 'accent' },
  { label: 'Monthly Activity', value: '47', change: '+18%', icon: 'calendar_month', color: 'cyan' },
]

const chartData = [
  { month: 'Jan', apps: 8, interviews: 1 },
  { month: 'Feb', apps: 12, interviews: 2 },
  { month: 'Mar', apps: 15, interviews: 2 },
  { month: 'Apr', apps: 20, interviews: 3 },
  { month: 'May', apps: 28, interviews: 4 },
  { month: 'Jun', apps: 35, interviews: 5 },
]

const spring = { type: 'spring', stiffness: 200, damping: 22 }

export default function AnalyticsChart() {
  const maxApps = Math.max(...chartData.map((d) => d.apps))
  const maxInterviews = Math.max(...chartData.map((d) => d.interviews))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">analytics</span>
          <h3 className="text-base font-bold text-text">Application Analytics</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary/60">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Apps</span>
          <span className="flex items-center gap-1 ml-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Interviews</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/[0.02] rounded-lg p-2.5 border border-border">
            <p className="text-[10px] text-text-secondary/60">{s.label}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-text">{s.value}</span>
              <span className={`text-[10px] font-semibold ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[180px] flex items-end justify-between gap-2 px-1">
        {chartData.map((d, i) => (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
            <div className="w-full flex flex-col items-center gap-0.5 justify-end h-[160px]">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.interviews / maxInterviews) * 100}px` }}
                transition={{ delay: 0.2 + i * 0.05, ...spring }}
                className="w-3/5 bg-accent/60 rounded-t cursor-pointer hover:bg-accent/80 transition-colors"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.apps / maxApps) * 100}px` }}
                transition={{ delay: 0.1 + i * 0.05, ...spring }}
                className="w-3/5 bg-primary/40 rounded-t cursor-pointer hover:bg-primary/60 transition-colors"
              />
            </div>
            <span className="text-[9px] text-text-secondary/60">{d.month}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
