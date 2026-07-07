import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function EmptyApplications() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-12 text-center"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-2xl text-primary">description</span>
      </div>
      <h2 className="text-lg font-bold text-text mb-1">No applications yet</h2>
      <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
        Start by browsing available jobs and save the ones that match your profile.
      </p>
      <button
        onClick={() => navigate('/jobs')}
        className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">work</span>
        Browse Jobs
      </button>
    </motion.div>
  )
}
