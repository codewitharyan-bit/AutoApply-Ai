import { motion } from 'framer-motion'

const colorMap = {
  match: {
    accent: '#7C3AED',
    bg: 'bg-[#7C3AED]/10',
    text: 'text-[#7C3AED]',
    bar: 'bg-[#7C3AED]',
    border: 'hover:border-[#7C3AED]/30',
    glow: '#7C3AED',
  },
  gap: {
    accent: '#F59E0B',
    bg: 'bg-[#F59E0B]/10',
    text: 'text-[#F59E0B]',
    bar: 'bg-[#F59E0B]',
    border: 'hover:border-[#F59E0B]/30',
    glow: '#F59E0B',
  },
  demand: {
    accent: '#10B981',
    bg: 'bg-[#10B981]/10',
    text: 'text-[#10B981]',
    bar: 'bg-[#10B981]',
    border: 'hover:border-[#10B981]/30',
    glow: '#10B981',
  },
  recommendation: {
    accent: '#3B82F6',
    bg: 'bg-[#3B82F6]/10',
    text: 'text-[#3B82F6]',
    bar: 'bg-[#3B82F6]',
    border: 'hover:border-[#3B82F6]/30',
    glow: '#3B82F6',
  },
}

function parseNumericValue(value) {
  if (!value || value === '--') return { num: null, suffix: '' }
  const cleaned = String(value).replace('%', '').trim()
  const num = parseFloat(cleaned)
  return isNaN(num) ? { num: null, suffix: '' } : { num, suffix: value.includes('%') ? '%' : '' }
}

export default function InsightMetricCard({ insight, index = 0 }) {
  const c = colorMap[insight.type] || colorMap.match
  const { num, suffix } = parseNumericValue(insight.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`bg-[#111114] border border-[#27272A] rounded-2xl p-4 ${c.border} transition-all duration-200 group hover:-translate-y-0.5 relative overflow-hidden`}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.07]"
        style={{ background: c.accent }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
            <span className={`material-symbols-outlined text-base ${c.text}`}>{insight.icon}</span>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary/60">{insight.label}</span>
        </div>
        <p className={`text-2xl font-bold ${c.text}`}>
          {num != null ? `${num}${suffix}` : insight.value}
        </p>
        {num != null && (
          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${c.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(num, 100)}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 + index * 0.06 }}
            />
          </div>
        )}
        <p className="text-[10px] text-[#A1A1AA] mt-2 leading-relaxed">{insight.detail}</p>
      </div>
    </motion.div>
  )
}
