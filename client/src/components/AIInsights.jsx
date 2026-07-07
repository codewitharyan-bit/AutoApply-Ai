import { motion } from 'framer-motion'
import InsightMetricCard from './InsightMetricCard'

function SkeletonGrid() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded-2xl'
  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-5">
      <div className={`h-4 w-24 ${pulse} mb-4`} />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-28 ${pulse}`} />
        ))}
      </div>
    </div>
  )
}

function EmptyState({ onGenerate, generating }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 text-center flex flex-col items-center gap-3"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-xl text-[#7C3AED]">psychology</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">AI Insights</p>
        <p className="text-xs text-[#A1A1AA] mt-0.5">Generate a career analysis to see personalized insights.</p>
      </div>
      <button
        onClick={onGenerate}
        disabled={generating}
        className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-semibold hover:bg-[#7C3AED]/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
      >
        {generating ? (
          <>
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            Analyzing...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate Career Analysis
          </>
        )}
      </button>
    </motion.div>
  )
}

export default function AIInsights({ insights, loading, onGenerate, generating }) {
  if (loading) return <SkeletonGrid />

  if (!insights || insights.length === 0) {
    return <EmptyState onGenerate={onGenerate} generating={generating} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111114] border border-[#27272A] rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-base text-[#7C3AED]">psychology</span>
        <h3 className="text-sm font-bold text-white">AI Insights</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <InsightMetricCard key={insight.type} insight={insight} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
