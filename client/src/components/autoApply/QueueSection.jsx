import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_STYLES = {
  pending: { dot: 'bg-amber-400', label: 'Pending' },
  processing: { dot: 'bg-blue-400', label: 'Processing' },
  completed: { dot: 'bg-emerald-400', label: 'Completed' },
  failed: { dot: 'bg-rose-400', label: 'Failed' },
  skipped: { dot: 'bg-text-secondary/30', label: 'Skipped' },
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec} sec ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hr ago`
  return new Date(dateStr).toLocaleDateString()
}

function renderCheckRow({ passed, label, value }) {
  if (passed === null) return null
  return (
    <div className="flex items-center gap-2 py-1">
      <span className={`material-symbols-outlined text-sm ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
        {passed ? 'check_circle' : 'cancel'}
      </span>
      <span className="text-xs text-text-secondary">{label}</span>
      {value && <span className="text-xs font-medium text-text">{value}</span>}
    </div>
  )
}

function renderSkillsSection(matchedSkills, missingSkills) {
  const hasMatched = matchedSkills?.length > 0
  const hasMissing = missingSkills?.length > 0
  if (!hasMatched && !hasMissing) return null
  return (
    <div className="py-1">
      <div className="flex items-center gap-2 pb-1">
        <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
        <span className="text-xs text-text-secondary">Skills</span>
      </div>
      <div className="pl-7 space-y-1">
        {hasMatched && (
          <div>
            <p className="text-[11px] text-text-secondary/60 pb-0.5">Matched</p>
            {matchedSkills.map((s, i) => (
              <p key={i} className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="text-emerald-400">•</span> {s}
              </p>
            ))}
          </div>
        )}
        {hasMissing && (
          <div>
            <p className="text-[11px] text-text-secondary/60 pb-0.5">Missing</p>
            {missingSkills.map((s, i) => (
              <p key={i} className="text-xs text-text-secondary flex items-center gap-1">
                <span className="text-text-secondary/40">•</span> {s}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function renderScoreRow({ label, score, min }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-xs font-semibold text-text">{score}%</span>
      <span className="text-[11px] text-text-secondary/60">Minimum required: {min}%</span>
    </div>
  )
}

function renderWarnings(warnings) {
  if (!warnings || warnings.length === 0) return null
  return (
    <div className="pt-2 mt-2 border-t border-border">
      <p className="text-[11px] text-text-secondary/60 pb-1">Warnings</p>
      {warnings.map((w, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className={`material-symbols-outlined text-sm ${w.severity === 'warning' ? 'text-amber-400' : 'text-text-secondary/40'}`}>
            {w.severity === 'warning' ? 'warning' : 'info'}
          </span>
          <span className="text-xs text-text-secondary">{w.message}</span>
        </div>
      ))}
    </div>
  )
}

export default function QueueSection({ items = [], loading = false, testResult, queueItems, onRemoveItem }) {
  const [expandedId, setExpandedId] = useState(null)
  const eligibleJobs = testResult?.jobs || []
  const showQueue = queueItems?.length > 0

  const toggleExpanded = (id) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-base font-bold text-text mb-3">
        {showQueue ? `Pending Queue (${queueItems.length})` : testResult ? `Eligible Jobs — ${testResult.eligible} ready` : 'Application Queue'}
      </h2>
      {loading ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl text-text-secondary animate-spin">sync</span>
        </div>
      ) : showQueue ? (
        <div className="flex flex-col gap-2">
          {queueItems.map((item) => {
            const style = STATUS_STYLES[item.status] || STATUS_STYLES.pending
            return (
              <div key={item.id} className="bg-[#0A0A0F] border border-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{item.job?.title || 'Unknown'}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{item.job?.company || ''}</p>
                    <p className="text-xs text-text-secondary/60 mt-0.5 truncate">
                      {[item.job?.location, item.job?.employmentType, item.job?.remoteType].filter(Boolean).join(' • ')}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span className="text-xs text-text-secondary">{style.label}</span>
                      </div>
                      <span className="text-[11px] text-text-secondary/60">#{item.position}</span>
                      <span className="text-[11px] text-text-secondary/60">{timeAgo(item.queuedAt)}</span>
                    </div>
                    <div className="flex gap-4 mt-1.5">
                      <div>
                        <span className="text-[11px] text-text-secondary/60">AI Match </span>
                        <span className="text-xs font-semibold text-text">{item.matchScore}%</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-text-secondary/60">Resume Score </span>
                        <span className="text-xs font-semibold text-text">{item.resumeScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    {item.job?.jobUrl && (
                      <a
                        href={item.job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">open_in_new</span>
                      </a>
                    )}
                    {onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm text-text-secondary/60 hover:text-rose-400">close</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <p className="text-xs text-text-secondary/60 text-center pt-2">
            Click <span className="text-blue-400 font-semibold">Run Next</span> to process one job or <span className="text-indigo-400 font-semibold">Run All</span> to process all pending jobs.
          </p>
        </div>
      ) : eligibleJobs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {eligibleJobs.map((item) => {
            const isExpanded = expandedId === item.job.id
            return (
              <div key={item.job.id} className="bg-[#0A0A0F] border border-border rounded-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">{item.job.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{item.job.company}</p>
                      <p className="text-xs text-text-secondary/60 mt-0.5 truncate">
                        {[item.job.location, item.job.employment_type, item.job.remote_type].filter(Boolean).join(' • ')}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <span className="text-[11px] text-text-secondary/60">AI Match </span>
                          <span className="text-xs font-semibold text-text">{item.matchScore}%</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-text-secondary/60">Resume Score </span>
                          <span className="text-xs font-semibold text-text">{item.resumeScore}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3 shrink-0">
                      {item.job.job_url && (
                        <a
                          href={item.job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm text-primary">open_in_new</span>
                        </a>
                      )}
                      <button
                        onClick={() => toggleExpanded(item.job.id)}
                        className="text-[11px] text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Matching Details</span>
                        <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-border pt-3 space-y-0.5">
                        {renderCheckRow({ passed: item.checks.location, label: 'Location', value: item.job.location })}
                        {renderCheckRow({ passed: item.checks.jobType, label: 'Employment Type', value: item.job.employment_type })}
                        {renderCheckRow({ passed: item.checks.experience, label: 'Experience', value: item.job.experience_level })}
                        {renderSkillsSection(item.matchedSkills, item.missingSkills)}
                        {renderScoreRow({ label: 'AI Match', score: item.scoreBreakdown.aiMatch, min: item.scoreBreakdown.minimumRequired.aiMatch })}
                        {renderScoreRow({ label: 'Resume Score', score: item.scoreBreakdown.resume, min: item.scoreBreakdown.minimumRequired.resume })}
                        {renderWarnings(item.warnings)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
          <p className="text-xs text-text-secondary/60 text-center pt-2">
            Automation not started. These jobs are ready for the queue.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-primary">queue</span>
          </div>
          <div>
            <p className="text-sm text-text-secondary">No pending applications.</p>
            <p className="text-xs text-text-secondary/60 mt-1 max-w-sm">
              Jobs matching your rules will appear here before they are submitted automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="bg-[#0A0A0F] border border-border rounded-xl p-4">
              <p className="text-sm text-text">{item.job}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
