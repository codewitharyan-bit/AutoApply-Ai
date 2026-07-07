import { motion } from 'framer-motion'

export default function EmptyResume({ onUpload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-12 text-center"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-2xl text-primary">badge</span>
      </div>
      <h2 className="text-lg font-bold text-text mb-1">No resume uploaded</h2>
      <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
        Upload your resume as a PDF to let our AI analyze your skills and find the best job matches.
      </p>
      <button
        onClick={onUpload}
        className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">upload_file</span>
        Upload Resume
      </button>
    </motion.div>
  )
}
