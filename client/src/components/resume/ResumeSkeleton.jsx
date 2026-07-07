import { motion } from 'framer-motion'

export default function ResumeSkeleton() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded-lg'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="space-y-2">
          <div className={`h-8 w-48 ${pulse}`} />
          <div className={`h-4 w-64 ${pulse}`} />
        </div>
        <div className={`h-9 w-36 ${pulse}`} />
      </div>

      <div className={`h-48 ${pulse}`} />
    </motion.div>
  )
}
