import { motion } from 'framer-motion'

const accentMap = {
  purple: { bg: 'bg-[#7C3AED]/10', icon: 'text-[#7C3AED]', border: 'hover:border-[#7C3AED]/30', glow: '#7C3AED' },
  emerald: { bg: 'bg-[#10B981]/10', icon: 'text-[#10B981]', border: 'hover:border-[#10B981]/30', glow: '#10B981' },
  amber: { bg: 'bg-[#F59E0B]/10', icon: 'text-[#F59E0B]', border: 'hover:border-[#F59E0B]/30', glow: '#F59E0B' },
  blue: { bg: 'bg-[#3B82F6]/10', icon: 'text-[#3B82F6]', border: 'hover:border-[#3B82F6]/30', glow: '#3B82F6' },
}

export default function QuickStatCard({ icon, value, label, color = 'purple', trend, index = 0 }) {
  const c = accentMap[color] || accentMap.purple

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-[#111114] border border-[#27272A] rounded-2xl p-4 ${c.border} transition-all duration-200 group relative overflow-hidden`}
    >
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.08]"
        style={{ background: c.glow }}
      />
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-lg ${c.icon}`}>{icon}</span>
        </div>
        {trend != null && (
          <span className={`text-[10px] font-semibold ${trend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-white mt-2 relative z-10">{value}</p>
      <p className="text-[11px] text-[#A1A1AA] mt-0.5 relative z-10">{label}</p>
    </motion.div>
  )
}
