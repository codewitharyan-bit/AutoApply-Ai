import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HighlightText from '../HighlightText'

const APPLICATION_STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']

function getRelativeTime(dateString) {
  if (!dateString) return null
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

export default function ApplicationCard({ application, index, onStatusChange, onDelete, highlightQuery }) {
  const navigate = useNavigate()
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const job = application.jobs || {}
  const timeAgo = getRelativeTime(application.created_at)

  const handleStatusChange = async (e) => {
    setUpdating(true)
    await onStatusChange(application.id, e.target.value)
    setUpdating(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(application.id)
    setDeleting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4 hover:bg-white/[0.03] hover:border-primary/20 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center shrink-0">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-sm font-bold text-primary">{job.company?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-text truncate">
              {highlightQuery ? <HighlightText text={job.title || 'Unknown Position'} query={highlightQuery} /> : (job.title || 'Unknown Position')}
            </h3>
            {job.salary && (
              <span className="text-[10px] font-medium text-emerald-400 shrink-0">{job.salary}</span>
            )}
          </div>
          <p className="text-xs text-text-secondary truncate">
            {highlightQuery ? <HighlightText text={job.company} query={highlightQuery} /> : job.company}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {job.location && (
              <span className="text-[10px] text-text-secondary/60 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[10px]">location_on</span>
                {job.location}
              </span>
            )}
            {timeAgo && (
              <span className="text-[10px] text-text-secondary/60">{timeAgo}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description Preview */}
      {job.description && (
        <p className="text-[11px] text-text-secondary/80 leading-relaxed mb-3 line-clamp-2">
          {job.description.length > 120 ? job.description.slice(0, 120) + '...' : job.description}
        </p>
      )}

      {/* Bottom Row: Status + Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <select
            value={application.status || 'saved'}
            onChange={handleStatusChange}
            disabled={updating}
            className={`text-[10px] font-medium px-2 py-1 rounded-full border appearance-none cursor-pointer bg-[#0A0A0F] ${updating ? 'opacity-60' : ''}`}
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-border text-[10px] font-medium text-text-secondary hover:text-text hover:border-primary/20 transition-colors"
        >
          View Details
        </button>

        {job.job_url && (
          <button
            onClick={() => window.open(job.job_url, '_blank', 'noopener,noreferrer')}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-border text-[10px] font-medium text-text-secondary hover:text-text hover:border-primary/20 transition-colors"
          >
            Open Job
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-colors shrink-0 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-sm">
            {deleting ? 'more_horiz' : 'delete'}
          </span>
        </button>
      </div>
    </motion.div>
  )
}
