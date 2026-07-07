import { motion } from 'framer-motion'

function getBarColor(score) {
  if (score >= 80) return 'bg-[#10B981]'
  if (score >= 60) return 'bg-[#3B82F6]'
  if (score >= 40) return 'bg-[#F59E0B]'
  return 'bg-[#EF4444]'
}

function SkeletonSnapshot() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded'
  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-5 space-y-4">
      <div className={`h-4 w-28 ${pulse}`} />
      <div className="space-y-2">
        <div className={`h-5 w-20 ${pulse}`} />
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className={`h-7 w-16 ${pulse}`} />)}
        </div>
      </div>
      <div className="space-y-2">
        <div className={`h-5 w-20 ${pulse}`} />
        <div className="flex gap-1.5">
          {[1, 2].map(i => <div key={i} className={`h-7 w-16 ${pulse}`} />)}
        </div>
      </div>
      <div className="space-y-2">
        <div className={`h-5 w-20 ${pulse}`} />
        <div className={`h-4 w-32 ${pulse}`} />
        <div className={`h-2 w-full ${pulse}`} />
      </div>
    </div>
  )
}

export default function CareerSnapshot({ analysis, loading }) {
  if (loading) return <SkeletonSnapshot />

  if (!analysis) return null

  const {
    top_matching_skills = [],
    missing_skills = [],
    role_readiness = {},
  } = analysis

  const roleEntries = Object.entries(role_readiness)
    .filter(([, score]) => score >= 60)
    .sort(([, a], [, b]) => b - a)
  const topRole = roleEntries[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111114] border border-[#27272A] rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-base text-[#7C3AED]">bar_chart</span>
        <h3 className="text-sm font-bold text-white">Career Snapshot</h3>
      </div>

      {top_matching_skills.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-[#A1A1AA] mb-2">Top Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {top_matching_skills.map(({ skill, count }) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]"
              >
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                {skill}
                <span className="text-[9px] text-[#10B981]/60 ml-0.5">{count}</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {missing_skills.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-[#A1A1AA] mb-2">Missing Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {missing_skills.slice(0, 6).map(({ skill }) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]"
              >
                <span className="material-symbols-outlined text-[12px]">cancel</span>
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] font-semibold text-[#A1A1AA] mb-2">Current Focus</p>
        {topRole ? (
          <>
            <p className="text-sm font-bold text-white">{topRole[0]}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-[#A1A1AA]">Confidence</span>
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[120px]">
                <motion.div
                  className={`h-full rounded-full ${getBarColor(topRole[1])}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${topRole[1]}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-[11px] font-semibold ${getBarColor(topRole[1]).replace('bg-', 'text-')}`}>
                {topRole[1]}%
              </span>
            </div>
          </>
        ) : (
          <p className="text-xs text-[#A1A1AA]">Add preferred roles to your profile</p>
        )}
      </div>
    </motion.div>
  )
}
