import { motion } from 'framer-motion'

export default function AutoApplyHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-lg text-white">bolt</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text">Auto Apply</h1>
      </div>
      <p className="text-sm text-text-secondary ml-12">Automate your job applications using intelligent rules.</p>
    </motion.div>
  )
}
