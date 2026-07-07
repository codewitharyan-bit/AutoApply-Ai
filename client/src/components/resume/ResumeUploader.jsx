import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResumeUploader({ uploading, progress, onFileSelect }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleClick = () => {
    if (uploading) return
    inputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB.')
      e.target.value = ''
      return
    }

    onFileSelect(file)
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB.')
      return
    }

    onFileSelect(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleClick}
        disabled={uploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 ${
          uploading
            ? 'bg-primary/60 text-white cursor-not-allowed'
            : dragOver
              ? 'bg-primary/20 text-primary border-2 border-dashed border-primary'
              : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            Uploading... {progress}%
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Upload Resume
          </>
        )}
      </button>

      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-text-secondary/60 mt-1 text-center">{progress}% uploaded</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
