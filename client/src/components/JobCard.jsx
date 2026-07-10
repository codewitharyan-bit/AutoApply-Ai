import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@clerk/clerk-react'
import { getFreshToken } from '../utils/auth'
import { saveApplication } from '../services/application'
import CircularScore from './CircularScore'
import HighlightText from './HighlightText'

function getScoreLabel(score) {
  if (score == null) return ''
  if (score >= 90) return 'Excellent Match'
  if (score >= 75) return 'Strong Match'
  if (score >= 60) return 'Good Match'
  return 'Basic Match'
}

function formatReason(reason) {
  if (!reason) return []
  return reason.split('.').filter(s => s.trim().length > 0)
}

export default function JobCard({ job, index = 0, onViewDetails, highlightQuery }) {
  const { getToken } = useAuth()
  const [saveState, setSaveState] = useState('idle')
  const [error, setError] = useState(null)
  const matchScore = job.matchScore
  const reasons = formatReason(job.recommendationReason)

  const handleSave = async () => {
    if (saveState === 'saving' || saveState === 'saved' || saveState === 'already_saved') return
    setSaveState('saving')
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      await saveApplication(token, job.id)
      setSaveState('saved')
    } catch (err) {
      if (err.message === 'Job already saved.') {
        setSaveState('already_saved')
      } else {
        setSaveState('idle')
        setError(err.message)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#111114] border border-[#27272A] rounded-2xl p-5 hover:border-[#7C3AED]/20 transition-all duration-200 hover:-translate-y-0.5 group relative overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-[0.02] group-hover:opacity-[0.04] transition-opacity bg-[#7C3AED]" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/20 border border-[#27272A] flex items-center justify-center shrink-0 overflow-hidden">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-[#7C3AED]">{job.company?.charAt(0) || '?'}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#7C3AED] transition-colors">
                    {highlightQuery ? <HighlightText text={job.title} query={highlightQuery} /> : job.title}
                  </h4>
                  {job.posted && (
                    <span className="text-[10px] text-[#A1A1AA]/60 shrink-0">{job.posted}</span>
                  )}
                </div>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  {highlightQuery ? <HighlightText text={job.company} query={highlightQuery} /> : job.company}
                </p>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <CircularScore score={matchScore} size={52} strokeWidth={4} />
                {matchScore != null && (
                  <span className="text-[8px] text-[#A1A1AA]/60 mt-1 whitespace-nowrap">{getScoreLabel(matchScore)}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-[#27272A] text-[#A1A1AA]">{job.type || 'Full-time'}</span>
              <span className="text-[11px] text-[#A1A1AA]/70">{job.location}</span>
              {job.salary && (
                <span className="text-[12px] font-semibold text-[#10B981] ml-auto">{job.salary}</span>
              )}
            </div>
          </div>
        </div>

        {job.matchedSkills && job.matchedSkills.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold text-[#10B981] mb-1.5">Matched Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.matchedSkills.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]"
                >
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {job.missingSkills && job.missingSkills.length > 0 && (
          <div className="mt-2.5">
            <p className="text-[10px] font-semibold text-[#EF4444] mb-1.5">Missing Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.missingSkills.map((skill) => (
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

        {reasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#27272A]">
            <p className="text-[10px] font-semibold text-[#A1A1AA] mb-1.5">Why this job?</p>
            <div className="space-y-0.5">
              {reasons.slice(0, 4).map((reason, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[12px] text-[#10B981] shrink-0 mt-0.5">check</span>
                  <span className="text-[11px] text-[#A1A1AA]/80 leading-relaxed">{reason.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#27272A]">
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#27272A] text-[#A1A1AA] text-[11px] font-medium hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            View Details
          </button>
          <button
            onClick={handleSave}
            disabled={saveState === 'saving' || saveState === 'saved' || saveState === 'already_saved'}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              saveState === 'saved' || saveState === 'already_saved'
                ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#7C3AED]'
                : 'border-[#27272A] text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
            } ${saveState === 'saving' ? 'opacity-60' : ''}`}
            title={saveState === 'saved' ? 'Saved' : 'Save job'}
          >
            <span className="material-symbols-outlined text-[14px]">
              {saveState === 'saved' || saveState === 'already_saved' ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
          <button className="flex-1 py-1.5 rounded-xl bg-white/[0.04] border border-[#27272A] text-white text-[11px] font-medium hover:bg-white/[0.08] transition-all">
            Apply
          </button>
          <button className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-[11px] font-semibold hover:opacity-90 transition-all shadow-[0_0_16px_rgba(124,58,237,0.15)]">
            Auto Apply
          </button>
        </div>

        {error && (
          <p className="text-[11px] text-[#EF4444] mt-2">{error}</p>
        )}
      </div>
    </motion.div>
  )
}
