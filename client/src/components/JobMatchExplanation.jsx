import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getJobExplanation } from '../services/job'

function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-lime-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-rose-400'
}

function getScoreBg(score) {
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20'
  if (score >= 60) return 'bg-lime-500/10 border-lime-500/20'
  if (score >= 40) return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-rose-500/10 border-rose-500/20'
}

function getBarColor(score) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-lime-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

function matchLabel(label) {
  return label === true ? 'Yes' : label === false ? 'No' : null
}

function MatchBar({ label, score, sub }) {
  if (score === null || score === undefined) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-secondary w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5 w-24 justify-end">
        {sub && (
          <span className="text-[10px] text-text-secondary/50 truncate">{sub}</span>
        )}
        <span className={`text-xs font-semibold w-8 text-right ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
    </div>
  )
}

function SkillChip({ label, matched }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
        matched
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
      }`}
    >
      <span className="material-symbols-outlined text-[10px]">
        {matched ? 'check_circle' : 'cancel'}
      </span>
      {label}
    </span>
  )
}

export default function JobMatchExplanation({ token, jobId }) {
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchExplanation = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getJobExplanation(token, jobId)
        if (!cancelled) setExplanation(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchExplanation()

    return () => { cancelled = true }
  }, [token, jobId])

  if (loading) {
    return (
      <div className="bg-[#0A0A0F] border border-border rounded-xl p-5 space-y-4">
        <div className="h-5 w-36 animate-pulse bg-white/[0.04] rounded" />
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse bg-white/[0.04] rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full animate-pulse bg-white/[0.04] rounded" />
            <div className="h-3 w-3/4 animate-pulse bg-white/[0.04] rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-full animate-pulse bg-white/[0.04] rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 text-rose-400">
          <span className="material-symbols-outlined text-sm">error_outline</span>
          <span className="text-xs font-medium">{error}</span>
        </div>
      </div>
    )
  }

  if (!explanation) return null

  const { match_score, matched_skills: matchedSkills, missing_skills: missingSkills, experience, role, location, employment, summary } = explanation
  const hasRecommendation = match_score !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
        <h2 className="text-sm font-bold text-text">AI Match Explanation</h2>
      </div>

      {!hasRecommendation ? (
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="material-symbols-outlined text-sm">info</span>
          <p className="text-xs">Generate AI recommendations first to see your match score.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center ${getScoreBg(match_score)}`}>
              <span className={`text-lg font-bold ${getScoreColor(match_score)}`}>{match_score}%</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary leading-relaxed">{summary}</p>
            </div>
          </div>

          {(matchedSkills.length > 0 || missingSkills.length > 0) && (
            <div>
              <p className="text-xs font-semibold text-text mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((s) => (
                  <SkillChip key={`match-${s}`} label={s} matched />
                ))}
                {missingSkills.map((s) => (
                  <SkillChip key={`miss-${s}`} label={s} matched={false} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <MatchBar
              label="Role Match"
              score={role?.score}
              sub={matchLabel(role?.matched)}
            />
            <MatchBar
              label="Experience"
              score={experience?.score}
              sub={experience?.user_level ? `${experience.user_level} → ${experience.job_level}` : null}
            />
            <MatchBar
              label="Location"
              score={location?.score}
              sub={location?.user_location ? `${location.user_location} → ${location.job_location}` : null}
            />
            <MatchBar
              label="Employment Type"
              score={employment?.score}
              sub={employment?.job_type || null}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
