import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-lime-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-rose-400'
}

function getBarColor(score) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-lime-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

function getRoleStars(score) {
  if (score >= 90) return '★★★★★'
  if (score >= 75) return '★★★★☆'
  if (score >= 60) return '★★★☆☆'
  if (score >= 40) return '★★☆☆☆'
  return '★☆☆☆☆'
}

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

function StaleBanner({ onRefresh, refreshing }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-3">
      <span className="material-symbols-outlined text-sm text-amber-400">warning</span>
      <span className="text-xs text-amber-300 flex-1">
        New jobs were imported after this analysis.
      </span>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/30 transition-colors disabled:opacity-60"
      >
        {refreshing ? 'Analyzing...' : 'Refresh'}
      </button>
    </div>
  )
}

function ScoreBar({ label, score, suffix }) {
  if (score === null || score === undefined) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-secondary w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-12 text-right ${getScoreColor(score)}`}>
        {score}{suffix || '%'}
      </span>
    </div>
  )
}

function SkeletonCard() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded'
  return (
    <div className="bg-[#0A0A0F] border border-border rounded-xl p-5 space-y-4">
      <div className={`h-5 w-44 ${pulse}`} />
      <div className="space-y-3">
        <div className={`h-8 w-full ${pulse}`} />
        <div className={`h-8 w-full ${pulse}`} />
      </div>
      <div className={`h-4 w-32 ${pulse}`} />
      <div className="space-y-2">
        {[1, 2, 3].map(i => <div key={i} className={`h-4 w-3/4 ${pulse}`} />)}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => <div key={i} className={`h-4 w-1/2 ${pulse}`} />)}
      </div>
    </div>
  )
}

function EmptyState({ onGenerate, generating }) {
  return (
    <div className="bg-[#0A0A0F] border border-border rounded-xl p-6 text-center flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-xl text-primary">bar_chart</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-text">Career Intelligence</p>
        <p className="text-xs text-text-secondary mt-0.5">Analyze your resume strength and market readiness</p>
      </div>
      <button
        onClick={onGenerate}
        disabled={generating}
        className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
      >
        {generating ? (
          <>
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            Analyzing...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate Analysis
          </>
        )}
      </button>
    </div>
  )
}

export default function CareerIntelligenceCard({ analysis, loading, onGenerate, generating }) {
  if (loading) return <SkeletonCard />

  if (!analysis || (analysis.resume_score == null && analysis.market_score == null)) {
    return <EmptyState onGenerate={onGenerate} generating={generating} />
  }

  const {
    resume_score,
    market_score,
    role_readiness = {},
    top_matching_skills = [],
    missing_skills = [],
    learning_roadmap = [],
    total_jobs_analyzed,
    analysis_version,
    updated_at,
    is_stale,
  } = analysis

  const roleEntries = Object.entries(role_readiness)
    .filter(([, score]) => score >= 60)
    .sort(([, a], [, b]) => b - a)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-5"
    >
      {is_stale && <StaleBanner onRefresh={onGenerate} refreshing={generating} />}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">bar_chart</span>
          <h2 className="text-sm font-bold text-text">Career Intelligence</h2>
          {analysis_version && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] border border-border text-text-secondary/60">
              v{analysis_version}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {updated_at && (
            <span className="text-[10px] text-text-secondary/50">
              Updated {getRelativeTime(updated_at)}
            </span>
          )}
          <button
            onClick={onGenerate}
            disabled={generating}
            className="w-6 h-6 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Regenerate analysis"
          >
            <span className={`material-symbols-outlined text-sm text-text-secondary ${generating ? 'animate-spin' : ''}`}>
              {generating ? 'sync' : 'refresh'}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <ScoreBar label="Resume Score" score={resume_score} />
          <ScoreBar label="Market Readiness" score={market_score} suffix="% (market coverage)" />
        </div>

        {roleEntries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text mb-2">Best Roles</p>
            <div className="space-y-1.5">
              {roleEntries.map(([role, score]) => (
                <div key={role} className="flex items-center gap-2">
                  <span className={`text-xs ${getScoreColor(score)}`}>{getRoleStars(score)}</span>
                  <span className="text-xs text-text-secondary flex-1 truncate">
                    {role}
                  </span>
                  <span className={`text-[11px] font-semibold ${getScoreColor(score)}`}>{score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {top_matching_skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text mb-2">Top Matching Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {top_matching_skills.map(({ skill, count }) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                >
                  <span className="material-symbols-outlined text-[10px]">check_circle</span>
                  {skill}
                  <span className="text-[10px] text-emerald-400/60 ml-0.5">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {missing_skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text mb-2">Top Missing Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {missing_skills.map(({ skill, count }) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-300"
                >
                  <span className="material-symbols-outlined text-[10px]">cancel</span>
                  {skill}
                  <span className="text-[10px] text-rose-400/60 ml-0.5">({count} jobs)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {learning_roadmap.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text mb-2">Learning Roadmap</p>
            <div className="space-y-1">
              {learning_roadmap.map(({ week, skill }) => (
                <div key={week} className="flex items-center gap-2 text-xs">
                  <span className="w-14 shrink-0 text-text-secondary/60 font-mono">Week {week}</span>
                  <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
                  <span className="text-text-secondary">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {total_jobs_analyzed > 0 && (
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <span className="text-[10px] text-text-secondary/50">
              {total_jobs_analyzed} {total_jobs_analyzed === 1 ? 'job' : 'jobs'} analyzed
            </span>
            {analysis_version && (
              <span className="text-[10px] text-text-secondary/30">
                v{analysis_version}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
