import { motion } from 'framer-motion'

export default function ApplicationSkeleton() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded-lg'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-8 w-48 ${pulse}`} />
          <div className={`h-5 w-16 ${pulse}`} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-9 w-64 ${pulse}`} />
          <div className={`h-9 w-32 ${pulse}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-36 ${pulse}`} />
        ))}
      </div>
    </motion.div>
  )
}
