import { motion } from 'framer-motion'
import { useState } from 'react'

const sparklines = {
  primary: [40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92],
  emerald: [30, 42, 38, 50, 45, 58, 52, 65, 60, 72, 68, 78],
  accent: [20, 35, 28, 45, 38, 52, 48, 60, 55, 68, 62, 75],
  cyan: [25, 30, 35, 28, 40, 35, 48, 42, 55, 50, 58, 52],
  amber: [60, 55, 65, 58, 70, 62, 75, 68, 72, 65, 78, 70],
}

const descriptions = {
  'Jobs Imported Today': 'Total number of job listings imported from all active pipelines in the last 24 hours.',
  'Jobs Matched': 'Number of imported jobs that match your skills, experience, and preferred roles.',
  'Applications Submitted': 'Total applications sent through AutoApply or manually this month.',
  'Interview Rate': 'Percentage of applications that resulted in interview invitations.',
  'AI Match Accuracy': 'Average confidence score of AI-generated job matches across all profiles.',
  'Recent Resume Score': 'ATS compatibility score of your uploaded resume out of 100.',
}

export default function MetricCard({ label, value, icon, trend, trendLabel, color = 'primary', index = 0 }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const sparkData = sparklines[color] || sparklines.primary
  const maxVal = Math.max(...sparkData)
  const minVal = Math.min(...sparkData)
  const range = maxVal - minVal || 1
  const points = sparkData.map((v, i) => `${i * 9},${28 - ((v - minVal) / range) * 22}`).join(' ')
  const desc = descriptions[label] || ''

  const iconColors = {
    primary: 'text-primary',
    accent: 'text-accent',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    cyan: 'text-cyan-400',
  }

  const bgColors = {
    primary: 'bg-primary/10',
    accent: 'bg-accent/10',
    emerald: 'bg-emerald-500/10',
    amber: 'bg-amber-500/10',
    rose: 'bg-rose-500/10',
    cyan: 'bg-cyan-500/10',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-3 hover:bg-white/[0.03] hover:border-primary/20 transition-all relative overflow-hidden group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-12 -mt-12 opacity-[0.03] bg-primary group-hover:opacity-[0.06] transition-opacity" />

      <div className="flex items-start justify-between mb-1 relative z-10">
        <div className={`w-8 h-8 rounded-lg ${bgColors[color]} flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-base ${iconColors[color]}`}>{icon}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {trend && (
            <span className={`text-[11px] font-semibold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
          )}
          <button className="relative text-text-secondary/40 hover:text-text-secondary/60 transition-colors">
            <span className="material-symbols-outlined text-[14px]">info</span>
            {showTooltip && desc && (
              <div className="absolute top-full right-0 mt-1 w-56 p-2 rounded-lg bg-[#1a1a23] border border-border text-[10px] text-text-secondary leading-relaxed shadow-xl z-20 pointer-events-none">
                {desc}
              </div>
            )}
          </button>
        </div>
      </div>

      <p className="text-xl font-bold text-text relative z-10">{value}</p>
      <p className="text-[11px] text-text-secondary mt-0.5 relative z-10">{label}</p>

      {/* Sparkline */}
      <div className="relative z-10 mt-1.5 h-[28px] -mx-0.5">
        <svg viewBox="0 0 100 28" className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={color === 'primary' ? '#6366F1' : color === 'emerald' ? '#34D399' : color === 'accent' ? '#8B5CF6' : color === 'cyan' ? '#22D3EE' : '#F59E0B'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40 group-hover:opacity-70 transition-opacity"
          />
          <defs>
            <linearGradient id={`grad-${color}-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color === 'primary' ? '#6366F1' : color === 'emerald' ? '#34D399' : color === 'accent' ? '#8B5CF6' : color === 'cyan' ? '#22D3EE' : '#F59E0B'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color === 'primary' ? '#6366F1' : color === 'emerald' ? '#34D399' : color === 'accent' ? '#8B5CF6' : color === 'cyan' ? '#22D3EE' : '#F59E0B'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,28 ${points} 100,28`}
            fill={`url(#grad-${color}-${index})`}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </svg>
      </div>

      {trendLabel && (
        <p className="text-[9px] text-text-secondary/50 mt-0.5 relative z-10">{trendLabel}</p>
      )}
    </motion.div>
  )
}
