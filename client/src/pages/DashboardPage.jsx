import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { getFreshToken } from '../utils/auth'
import { getDashboard } from '../services/dashboard'
import { getCareerAnalysis, generateCareerAnalysis } from '../services/careerAnalysis'
import { getProfile, updateProfile } from '../services/profile'
import { getJobs, getJob, importJobs } from '../services/job'
import { getApplications, getApplication, updateApplication, deleteApplication } from '../services/application'
import { getResume } from '../services/resume'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import MetricCard from '../components/MetricCard'
import PipelineCard from '../components/PipelineCard'
import ActivityTerminal from '../components/ActivityTerminal'
import JobCard from '../components/JobCard'
import AnalyticsChart from '../components/AnalyticsChart'
import ProfileWidget from '../components/ProfileWidget'
import AIInsights from '../components/AIInsights'
import CareerIntelligenceCard from '../components/CareerIntelligenceCard'
import QuickStatCard from '../components/QuickStatCard'
import CareerSnapshot from '../components/CareerSnapshot'

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

function formatMetricValue(key, value) {
  if (value === null || value === undefined) return 'N/A'
  if (key === 'interviewRate' || key === 'aiMatchAccuracy') return `${value}%`
  if (key === 'resumeScore') return String(value)
  return String(value)
}

const metricConfigs = [
  { key: 'jobsImportedToday', label: 'Jobs Imported Today', icon: 'download', color: 'primary', trendLabel: 'vs yesterday' },
  { key: 'jobsMatched', label: 'Jobs Matched', icon: 'workspace_premium', color: 'emerald', trendLabel: 'new matches' },
  { key: 'applicationsSubmitted', label: 'Applications Submitted', icon: 'send', color: 'accent', trendLabel: 'this month' },
  { key: 'interviewRate', label: 'Interview Rate', icon: 'calendar_today', color: 'cyan', trendLabel: 'conversion rate' },
  { key: 'aiMatchAccuracy', label: 'AI Match Accuracy', icon: 'psychology', color: 'primary', trendLabel: 'avg score' },
  { key: 'resumeScore', label: 'Recent Resume Score', icon: 'badge', color: 'amber', trendLabel: 'out of 100' },
]

const quickActions = [
  { label: 'Upload Resume', icon: 'upload_file', desc: 'PDF, DOCX supported', iconClass: 'text-primary', bgClass: 'bg-primary/10' },
  { label: 'Import Jobs', icon: 'download', desc: 'Fetch from all sources', iconClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10' },
  { label: 'Generate Cover Letter', icon: 'description', desc: 'AI-powered drafting', iconClass: 'text-accent', bgClass: 'bg-accent/10' },
  { label: 'Start Auto Apply', icon: 'rocket_launch', desc: 'Automated submissions', iconClass: 'text-amber-400', bgClass: 'bg-amber-500/10' },
]

const tabNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'jobs', label: 'Jobs', icon: 'work' },
  { id: 'applications', label: 'Applications', icon: 'description' },
  { id: 'ai-recommendations', label: 'AI', icon: 'auto_awesome' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

function getPipelineStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'running': return 'bg-emerald-400'
    case 'idle': return 'bg-amber-400'
    case 'error': return 'bg-rose-400'
    default: return 'bg-emerald-400'
  }
}

function DashboardSkeleton() {
  const pulse = 'animate-pulse bg-white/[0.04] rounded-lg'
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-2">
          <div className={`h-8 w-64 ${pulse}`} />
          <div className={`h-4 w-48 ${pulse}`} />
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-6 w-20 ${pulse}`} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-24 ${pulse}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-32 ${pulse}`} />
        ))}
      </div>
      <div className={`h-14 ${pulse}`} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`h-64 ${pulse}`} />
            <div className={`h-64 ${pulse}`} />
          </div>
          <div className={`h-64 ${pulse}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`h-48 ${pulse}`} />
            <div className={`h-48 ${pulse}`} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-40 ${pulse}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-2xl text-rose-400">error_outline</span>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-text mb-1">Something went wrong</h2>
        <p className="text-sm text-text-secondary max-w-md">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </motion.div>
  )
}

function DashboardView({ dashboardData, onNavigate, onImportJobs, importState, onGenerateRecommendations, generatingRecommendations, careerAnalysis, careerAnalysisLoading, insights, onGenerateCareerAnalysis, generatingAnalysis }) {
  const { user } = useUser()
  const { stats, pipeline, recommendedJobs, profile } = dashboardData || {}
  const navigate = useNavigate()

  const metrics = metricConfigs.map((cfg, i) => ({
    ...cfg,
    value: cfg.key === 'jobsMatched'
      ? String(recommendedJobs?.length || 0)
      : formatMetricValue(cfg.key, stats?.[cfg.key]),
    trend: null,
    index: i,
  }))

  const mappedJobs = (recommendedJobs || []).map((job) => ({
    ...job,
    posted: getRelativeTime(job.created_at) || '2d ago',
  }))

  const profileCompletion = profile?.completion ?? 0

  const pipelineStatusItems = [
    { name: 'JSearch API', status: pipeline?.status === 'Running' ? 'online' : 'idle', color: getPipelineStatusColor(pipeline?.status) },
    { name: 'AI Engine', status: 'ready', color: 'bg-emerald-400' },
    { name: 'Resume Parser', status: 'online', color: 'bg-emerald-400' },
    { name: 'Auto Apply Queue', status: 'idle', color: 'bg-amber-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 min-h-[calc(100dvh-12rem)]"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text">
            Welcome back, {user?.firstName || 'there'} <span className="inline-block">👋</span>
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">AI-powered job automation command center</p>
        </div>
        <div className="flex items-center gap-2">
          {pipelineStatusItems.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-border">
              <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
              <span className="text-[10px] text-text-secondary whitespace-nowrap">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const isImport = action.label === 'Import Jobs'
          const isUpload = action.label === 'Upload Resume'
          const loading = isImport && importState?.loading
          return (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isImport ? onImportJobs : isUpload ? () => navigate('/resume') : undefined}
              disabled={loading}
              className="bg-[#0A0A0F] border border-border rounded-xl p-3 hover:bg-white/[0.03] hover:border-primary/30 transition-all text-left group disabled:opacity-60"
            >
              <div className={`w-9 h-9 rounded-lg ${action.bgClass} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                {loading ? (
                  <span className="material-symbols-outlined text-lg animate-spin text-emerald-400">sync</span>
                ) : (
                  <span className={`material-symbols-outlined text-lg ${action.iconClass}`}>{action.icon}</span>
                )}
              </div>
              <p className="text-sm font-semibold text-text">{action.label}</p>
              <p className="text-[10px] text-text-secondary/60 mt-0.5">
                {isImport && importState?.message ? importState.message : action.desc}
              </p>
            </motion.button>
          )
        })}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {metrics.map(({ key, ...m }) => (
          <MetricCard key={key} {...m} />
        ))}
      </div>

      {/* Career Intelligence */}
      <CareerIntelligenceCard
        analysis={careerAnalysis}
        loading={careerAnalysisLoading}
        onGenerate={onGenerateCareerAnalysis}
        generating={generatingAnalysis}
      />

      {/* Profile Completion Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/20 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg text-primary">flag</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Profile {profileCompletion}% Complete</p>
            <p className="text-[11px] text-text-secondary">Add your skills and experience to unlock better matches</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0"
        >
          Complete Profile
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PipelineCard pipeline={pipeline} />
            <ProfileWidget profile={profile} onNavigate={onNavigate} />
          </div>
          <AnalyticsChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ActivityTerminal />
          </div>
        </div>

        {/* Right Column: AI Insights + Recommended Jobs */}
        <div className="flex flex-col gap-3">
          <AIInsights
            insights={insights}
            loading={careerAnalysisLoading}
            onGenerate={onGenerateCareerAnalysis}
            generating={generatingAnalysis}
          />
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text">AI Recommended Jobs</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">{mappedJobs.length} matches</span>
              <button
                onClick={onGenerateRecommendations}
                disabled={generatingRecommendations}
                className="w-6 h-6 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Regenerate recommendations"
              >
                <span className={`material-symbols-outlined text-sm text-text-secondary ${generatingRecommendations ? 'animate-spin' : ''}`}>
                  {generatingRecommendations ? 'sync' : 'refresh'}
                </span>
              </button>
            </div>
          </div>

          {mappedJobs.length === 0 ? (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-6 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-text-secondary/30">auto_awesome</span>
              <div>
                <p className="text-sm text-text-secondary">No personalized recommendations available.</p>
              </div>
              <button
                onClick={onGenerateRecommendations}
                disabled={generatingRecommendations}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {generatingRecommendations ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Generate Recommendations
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mappedJobs.slice(0, 3).map((job, i) => (
                <div
                  key={job.id || job.job_url || i}
                  onClick={() => onNavigate('ai-recommendations')}
                  className="bg-[#0A0A0F] border border-border rounded-xl p-3 hover:bg-white/[0.03] hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    {job.matchScore != null && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {job.matchScore}%
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text truncate">{job.title}</p>
                      <p className="text-[10px] text-text-secondary truncate">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-text-secondary/60">{job.location}</span>
                    {job.salary && <span className="text-[10px] font-semibold text-emerald-400 ml-auto">{job.salary}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {job.matchedSkills?.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 leading-none">
                        {skill}
                      </span>
                    ))}
                    {job.missingSkills?.slice(0, 2).map((skill) => (
                      <span key={skill} className="text-[9px] px-1 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 leading-none">
                        {skill}
                      </span>
                    ))}
                    {((job.matchedSkills?.length || 0) + (job.missingSkills?.length || 0)) > 5 && (
                      <span className="text-[9px] text-text-secondary/50 leading-none self-center">+ more</span>
                    )}
                  </div>
                </div>
              ))}
              {mappedJobs.length > 3 && (
                <button
                  onClick={() => onNavigate('ai-recommendations')}
                  className="text-xs text-primary font-medium hover:underline text-center pt-1"
                >
                  View all {mappedJobs.length} recommendations
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function JobDetailPanel({ job, onClose }) {
  if (!job) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-5 mb-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-lg font-bold text-primary">{job.company?.charAt(0) || '?'}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">{job.title}</h2>
            <p className="text-sm text-text-secondary">{job.company} &middot; {job.location}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] transition-colors">
          <span className="material-symbols-outlined text-sm text-text-secondary">close</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-border text-text-secondary">{job.type || 'Full-time'}</span>
        {job.salary && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{job.salary}</span>}
        {job.match && <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{job.match}% AI Match</span>}
      </div>

      {job.description && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text mb-2">Description</h3>
          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>
      )}

      {job.missingSkills?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text mb-2">Missing Skills</h3>
          <div className="flex flex-wrap gap-1">
            {job.missingSkills.map((skill) => (
              <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function JobsView({ getToken }) {
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await getJobs(token)
      setAllJobs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleJobClick = async (job) => {
    if (selectedJob?.id === job.id) {
      setSelectedJob(null)
      return
    }
    try {
      const token = await getFreshToken(getToken)
      const detail = await getJob(token, job.id)
      setSelectedJob(detail)
    } catch {
      setSelectedJob(job)
    }
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Jobs</h1>
        <p className="text-sm text-text-secondary mb-6">Browse and manage job listings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-white/[0.04] rounded-xl" />
          ))}
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Jobs</h1>
        <p className="text-sm text-text-secondary mb-6">Browse and manage job listings</p>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-rose-400">{error}</p>
          <button onClick={fetchJobs} className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  const jobs = (allJobs || []).map((job) => ({
    ...job,
    posted: getRelativeTime(job.created_at),
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Jobs</h1>
      <p className="text-sm text-text-secondary mb-6">Browse and manage job listings</p>

      <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />

      {jobs.length === 0 ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-text-secondary/30 mb-2">work</span>
          <p className="text-sm text-text-secondary">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {jobs.map((job, i) => (
            <JobCard key={job.id || job.job_url || i} job={job} index={i} onViewDetails={() => handleJobClick(job)} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

const APPLICATION_STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']

const statusColors = {
  saved: 'bg-white/[0.04] border-border text-text-secondary',
  applied: 'bg-primary/10 border-primary/20 text-primary',
  interview: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  offer: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  rejected: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  withdrawn: 'bg-white/[0.02] border-white/10 text-text-secondary/60',
}

function ApplicationsView({ getToken }) {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchApps = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await getApplications(token)
      setApps(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      const token = await getFreshToken(getToken)
      await updateApplication(token, appId, newStatus)
      setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)))
      if (selectedApp?.id === appId) setSelectedApp((prev) => ({ ...prev, status: newStatus }))
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (appId) => {
    if (!confirm('Remove this application?')) return
    setDeleting(appId)
    try {
      const token = await getFreshToken(getToken)
      await deleteApplication(token, appId)
      setApps((prev) => prev.filter((a) => a.id !== appId))
      if (selectedApp?.id === appId) setSelectedApp(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleAppClick = async (app) => {
    if (selectedApp?.id === app.id) {
      setSelectedApp(null)
      return
    }
    try {
      const token = await getFreshToken(getToken)
      const detail = await getApplication(token, app.id)
      setSelectedApp(detail)
    } catch {
      setSelectedApp(app)
    }
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Applications</h1>
        <p className="text-sm text-text-secondary mb-6">Track your submitted applications</p>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse bg-white/[0.04] rounded-xl" />
          ))}
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Applications</h1>
        <p className="text-sm text-text-secondary mb-6">Track your submitted applications</p>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-rose-400">{error}</p>
          <button onClick={fetchApps} className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Applications</h1>
      <p className="text-sm text-text-secondary mb-6">Track your submitted applications</p>

      {/* Selected Application Detail */}
      {selectedApp && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0F] border border-border rounded-xl p-5 mb-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center">
                {selectedApp.jobs?.logo ? (
                  <img src={selectedApp.jobs.logo} alt={selectedApp.jobs.company} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-lg font-bold text-primary">{selectedApp.jobs?.company?.charAt(0) || '?'}</span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">{selectedApp.jobs?.title || selectedApp.job_id}</h2>
                <p className="text-sm text-text-secondary">{selectedApp.jobs?.company} &middot; {selectedApp.jobs?.location}</p>
              </div>
            </div>
            <button onClick={() => setSelectedApp(null)} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] transition-colors">
              <span className="material-symbols-outlined text-sm text-text-secondary">close</span>
            </button>
          </div>

          {selectedApp.jobs?.description && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-text mb-2">Description</h3>
              <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">{selectedApp.jobs.description}</p>
            </div>
          )}

          {selectedApp.jobs?.salary && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-text mb-2">Salary</h3>
              <p className="text-xs text-emerald-400">{selectedApp.jobs.salary}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <span className="text-xs text-text-secondary">Status:</span>
            <div className="relative">
              <select
                value={selectedApp.status || 'saved'}
                onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                disabled={updating === selectedApp.id}
                className={`text-xs px-2 py-1 rounded-lg border appearance-none cursor-pointer ${statusColors[selectedApp.status] || statusColors.saved} ${updating === selectedApp.id ? 'opacity-60' : ''}`}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleDelete(selectedApp.id)}
              disabled={deleting === selectedApp.id}
              className="ml-auto px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors disabled:opacity-60"
            >
              {deleting === selectedApp.id ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Application List */}
      {apps.length === 0 ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-text-secondary/30 mb-2">description</span>
          <p className="text-sm text-text-secondary">No applications yet. Save a job to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app, i) => {
            const job = app.jobs || {}
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-[#0A0A0F] border rounded-xl p-4 hover:bg-white/[0.03] transition-all cursor-pointer ${selectedApp?.id === app.id ? 'border-primary/30' : 'border-border hover:border-primary/20'}`}
                onClick={() => handleAppClick(app)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center shrink-0">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-sm font-bold text-primary">{job.company?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-text truncate">{job.title || app.job_id}</h4>
                      {app.created_at && <span className="text-[10px] text-text-secondary/60 shrink-0">{getRelativeTime(app.created_at)}</span>}
                    </div>
                    <p className="text-xs text-text-secondary truncate">{job.company}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full border shrink-0 ${statusColors[app.status] || statusColors.saved}`}>
                    {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Saved'}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(app.id) }}
                    disabled={deleting === app.id}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-colors shrink-0 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function ResumeView({ getToken }) {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchResume = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await getResume(token)
      setResume(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchResume()
  }, [fetchResume])

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Resume</h1>
      <p className="text-sm text-text-secondary mb-6">Manage your resume and optimize for AI matching</p>

      {loading ? (
        <div className="h-64 animate-pulse bg-white/[0.04] rounded-xl" />
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-rose-400">{error}</p>
          <button onClick={fetchResume} className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
            Retry
          </button>
        </div>
      ) : resume ? (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text">Uploaded Resume</h3>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-border mb-4">
            <span className="material-symbols-outlined text-lg text-primary">description</span>
            <div>
              <p className="text-sm font-semibold text-text">{resume.filename || resume.name || 'Resume'}</p>
              {resume.file_size && (
                <p className="text-xs text-text-secondary">{(resume.file_size / 1024).toFixed(1)} KB</p>
              )}
            </div>
            {resume.file_url && (
              <a
                href={resume.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Download
              </a>
            )}
          </div>
          {resume.parsed_data && (
            <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
              {typeof resume.parsed_data === 'string' ? resume.parsed_data : JSON.stringify(resume.parsed_data, null, 2)}
            </div>
          )}
          {resume.score !== undefined && resume.score !== null && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-text-secondary">Resume Score:</span>
              <span className="text-lg font-bold text-primary">{resume.score}/100</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-text-secondary/30 mb-2">badge</span>
          <p className="text-sm text-text-secondary">No resume found. Upload your resume to get started.</p>
        </div>
      )}
    </motion.div>
  )
}

function AIRecommendationsView({ recommendedJobs, onGenerateRecommendations, generatingRecommendations, insights, careerAnalysis, careerAnalysisLoading, onGenerateCareerAnalysis, generatingAnalysis }) {
  const jobs = recommendedJobs || []
  const navigate = useNavigate()

  const topRole = careerAnalysis
    ? Object.entries(careerAnalysis.role_readiness || {}).sort((a, b) => b[1] - a[1])[0]
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Recommendations</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Intelligent job matches personalized for you</p>
        </div>
        <button
          onClick={onGenerateRecommendations}
          disabled={generatingRecommendations}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-1.5 shadow-[0_0_16px_rgba(124,58,237,0.15)]"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          {generatingRecommendations ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <QuickStatCard
          icon="badge"
          value={careerAnalysis?.resume_score != null ? `${careerAnalysis.resume_score}%` : '--'}
          label="Resume Score"
          color="purple"
          index={0}
        />
        <QuickStatCard
          icon="trending_up"
          value={careerAnalysis?.market_score != null ? `${careerAnalysis.market_score}%` : '--'}
          label="Market Readiness"
          color="emerald"
          index={1}
        />
        <QuickStatCard
          icon="workspace_premium"
          value={String(jobs.length)}
          label="Jobs Matched"
          color="amber"
          index={2}
        />
        <QuickStatCard
          icon="flag"
          value={topRole?.[0] || 'N/A'}
          label="Best Career Path"
          color="blue"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-5">
        <div className="flex flex-col gap-4">
          <AIInsights
            insights={insights}
            loading={careerAnalysisLoading}
            onGenerate={onGenerateCareerAnalysis}
            generating={generatingAnalysis}
          />
          <CareerSnapshot analysis={careerAnalysis} loading={careerAnalysisLoading} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]/40 text-lg pointer-events-none">search</span>
              <input
                className="w-full bg-[#111114] border border-[#27272A] rounded-2xl py-2.5 pl-10 pr-14 text-sm text-white placeholder-[#A1A1AA]/40 outline-none focus:border-[#7C3AED]/40 transition-colors"
                placeholder="Search jobs..."
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-[#27272A] text-[10px] text-[#A1A1AA]/40 font-mono pointer-events-none">&#8984;K</kbd>
            </div>
            <button className="w-9 h-9 rounded-2xl bg-[#111114] border border-[#27272A] flex items-center justify-center hover:border-[#7C3AED]/30 transition-colors">
              <span className="material-symbols-outlined text-lg text-[#A1A1AA]">filter_list</span>
            </button>
          </div>

          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111114] border border-[#27272A] rounded-2xl p-10 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#3B82F6]/10 border border-[#27272A] flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-[#7C3AED]">auto_awesome</span>
              </div>
              <div>
                <p className="text-base font-semibold text-white">No personalized recommendations yet</p>
                <p className="text-sm text-[#A1A1AA] mt-1">Generate recommendations based on your skills and preferences.</p>
              </div>
              <button
                onClick={onGenerateRecommendations}
                disabled={generatingRecommendations}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-1.5 shadow-[0_0_16px_rgba(124,58,237,0.15)]"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                {generatingRecommendations ? 'Generating...' : 'Generate Recommendations'}
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {jobs.map((job, i) => (
                <JobCard
                  key={job.id || job.job_url || i}
                  job={job}
                  index={i}
                  onViewDetails={() => navigate(`/jobs/${job.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ProfileView({ getToken }) {
  const experienceLevelOptions = [
    'Fresher',
    '0-1 Years',
    '1-2 Years',
    '2-3 Years',
    '3-5 Years',
    '5-7 Years',
    '7-10 Years',
    '10+ Years',
  ]

  const { user } = useUser()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ location: '', experience_level: 'Fresher', experience: [{ role: '', company: '', duration: '', description: '' }], skills: '', preferred_roles: '', education: [{ degree: '', specialization: '', institute: '', graduation_year: '' }], projects: [{ name: '', technologies: '', description: '' }] })

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await getProfile(token)
      setProfileData(data)
      const exp = Array.isArray(data?.experience) ? data.experience : []
      const edu = Array.isArray(data?.education) ? data.education : []
      const proj = Array.isArray(data?.projects) ? data.projects : []
      setForm({
        location: data?.location || '',
        experience_level: data?.experience_level || 'Fresher',
        experience: exp.length > 0 ? exp.map((e) => ({ role: e.role || '', company: e.company || '', duration: e.duration || '', description: e.description || '' })) : [{ role: '', company: '', duration: '', description: '' }],
        skills: Array.isArray(data?.skills) ? data.skills.join(', ') : '',
        preferred_roles: Array.isArray(data?.preferred_roles) ? data.preferred_roles.join(', ') : '',
        education: edu.length > 0 ? edu.map((e) => ({ degree: e.degree || '', specialization: e.specialization || '', institute: e.institute || '', graduation_year: e.graduation_year || '' })) : [{ degree: '', specialization: '', institute: '', graduation_year: '' }],
        projects: proj.length > 0 ? proj.map((p) => ({ name: p.name || '', technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '', description: p.description || '' })) : [{ name: '', technologies: '', description: '' }],
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getFreshToken(getToken)
      const payload = {
        location: form.location || null,
        experience_level: form.experience_level || 'Fresher',
        experience: form.experience.map((e) => ({
          role: e.role.trim(),
          company: e.company.trim(),
          duration: e.duration.trim(),
          description: e.description.trim(),
        })).filter((e) => e.role || e.company || e.description),
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        preferred_roles: form.preferred_roles ? form.preferred_roles.split(',').map((r) => r.trim()).filter(Boolean) : [],
        education: form.education.map((e) => ({
          degree: e.degree.trim(),
          specialization: e.specialization.trim(),
          institute: e.institute.trim(),
          graduation_year: e.graduation_year.trim(),
        })).filter((e) => e.degree || e.institute),
        projects: form.projects.map((p) => ({
          name: p.name.trim(),
          technologies: p.technologies ? p.technologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
          description: p.description.trim(),
        })).filter((p) => p.name),
      }
      const updated = await updateProfile(token, payload)
      setProfileData(updated)
      setEditing(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const skills = Array.isArray(profileData?.skills) ? profileData.skills : []
  const experience = Array.isArray(profileData?.experience) ? profileData.experience : []
  const education = Array.isArray(profileData?.education) ? profileData.education : []
  const projects = Array.isArray(profileData?.projects) ? profileData.projects : []
  const preferredRoles = Array.isArray(profileData?.preferred_roles) ? profileData.preferred_roles : []

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Profile</h1>
        <p className="text-sm text-text-secondary mb-6">Manage your professional profile</p>
        <div className="h-64 animate-pulse bg-white/[0.04] rounded-xl" />
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Profile</h1>
        <p className="text-sm text-text-secondary mb-6">Manage your professional profile</p>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-rose-400">{error}</p>
          <button onClick={fetchProfile} className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl md:text-3xl font-bold text-text">Profile</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
      <p className="text-sm text-text-secondary mb-6">Manage your professional profile</p>

      {/* Profile Header */}
      <div className="bg-[#0A0A0F] border border-border rounded-xl p-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
            <img
              alt="Avatar"
              className="w-full h-full object-cover"
              src={user?.imageUrl || 'https://ui-avatars.com/api/?name=U&background=6366F1&color=fff&size=56'}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">{user?.fullName || 'Your Name'}</h2>
            <p className="text-sm text-text-secondary">{profileData?.location || 'Location not set'}</p>
            <p className="text-xs text-primary mt-0.5">{profileData?.experience_level || 'Fresher'}</p>
          </div>
        </div>
      </div>

      {editing ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0F] border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text">Edit Profile</h3>
            <button onClick={() => { setEditing(false); fetchProfile() }} className="text-xs text-text-secondary hover:text-text transition-colors">Cancel</button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Experience Level</label>
              <select
                value={form.experience_level}
                onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/40 transition-colors"
              >
                {experienceLevelOptions.map((level) => (
                  <option key={level} value={level} className="bg-[#0A0A0F]">
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">Experience</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, experience: [...form.experience, { role: '', company: '', duration: '', description: '' }] })}
                  className="text-[10px] text-primary font-medium"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {form.experience.map((entry, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-text-secondary/60">#{i + 1}</span>
                      {form.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, experience: form.experience.filter((_, j) => j !== i) })}
                          className="text-[10px] text-rose-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={entry.role} onChange={(e) => { const upd = [...form.experience]; upd[i] = { ...upd[i], role: e.target.value }; setForm({ ...form, experience: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Role" />
                      <input type="text" value={entry.company} onChange={(e) => { const upd = [...form.experience]; upd[i] = { ...upd[i], company: e.target.value }; setForm({ ...form, experience: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Company" />
                    </div>
                    <input type="text" value={entry.duration} onChange={(e) => { const upd = [...form.experience]; upd[i] = { ...upd[i], duration: e.target.value }; setForm({ ...form, experience: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors mt-1.5" placeholder="Duration (e.g. Jan 2024 - Present)" />
                    <textarea value={entry.description} onChange={(e) => { const upd = [...form.experience]; upd[i] = { ...upd[i], description: e.target.value }; setForm({ ...form, experience: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors resize-y mt-1.5" placeholder="Description" rows={2} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Preferred Roles (comma-separated)</label>
              <input
                type="text"
                value={form.preferred_roles}
                onChange={(e) => setForm({ ...form, preferred_roles: e.target.value })}
                className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="Backend Engineer, Full Stack Developer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">Education</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, education: [...form.education, { degree: '', specialization: '', institute: '', graduation_year: '' }] })}
                  className="text-[10px] text-primary font-medium"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {form.education.map((entry, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-text-secondary/60">#{i + 1}</span>
                      {form.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, education: form.education.filter((_, j) => j !== i) })}
                          className="text-[10px] text-rose-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={entry.degree} onChange={(e) => { const upd = [...form.education]; upd[i] = { ...upd[i], degree: e.target.value }; setForm({ ...form, education: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Degree" />
                      <input type="text" value={entry.specialization} onChange={(e) => { const upd = [...form.education]; upd[i] = { ...upd[i], specialization: e.target.value }; setForm({ ...form, education: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Specialization" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <input type="text" value={entry.institute} onChange={(e) => { const upd = [...form.education]; upd[i] = { ...upd[i], institute: e.target.value }; setForm({ ...form, education: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Institute" />
                      <input type="text" value={entry.graduation_year} onChange={(e) => { const upd = [...form.education]; upd[i] = { ...upd[i], graduation_year: e.target.value }; setForm({ ...form, education: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Year" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">Projects</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, projects: [...form.projects, { name: '', technologies: '', description: '' }] })}
                  className="text-[10px] text-primary font-medium"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {form.projects.map((entry, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-text-secondary/60">#{i + 1}</span>
                      {form.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, projects: form.projects.filter((_, j) => j !== i) })}
                          className="text-[10px] text-rose-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input type="text" value={entry.name} onChange={(e) => { const upd = [...form.projects]; upd[i] = { ...upd[i], name: e.target.value }; setForm({ ...form, projects: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors" placeholder="Project name" />
                    <input type="text" value={entry.technologies} onChange={(e) => { const upd = [...form.projects]; upd[i] = { ...upd[i], technologies: e.target.value }; setForm({ ...form, projects: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors mt-1.5" placeholder="Technologies (comma-separated)" />
                    <textarea value={entry.description} onChange={(e) => { const upd = [...form.projects]; upd[i] = { ...upd[i], description: e.target.value }; setForm({ ...form, projects: upd }) }} className="w-full bg-white/[0.04] border border-border rounded-lg px-2 py-1.5 text-xs text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors resize-y mt-1.5" placeholder="Description" rows={2} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="self-start px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Preferred Roles */}
          {preferredRoles.length > 0 && (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
              <h3 className="text-base font-bold text-text mb-3">Preferred Roles</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferredRoles.map((role) => (
                  <span key={role} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
              <h3 className="text-base font-bold text-text mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
              <h3 className="text-base font-bold text-text mb-3">Experience</h3>
              <div className="flex flex-col gap-3">
                {experience.map((exp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-border">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-sm font-semibold text-text">{exp.role || 'Role'}</p>
                        {exp.company && (
                          <p className="text-xs text-text-secondary">{exp.company}</p>
                        )}
                      </div>
                      {exp.duration && (
                        <span className="text-[10px] text-text-secondary/60 shrink-0 ml-2">{exp.duration}</span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-text-secondary/80 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
              <h3 className="text-base font-bold text-text mb-3">Education</h3>
              <div className="flex flex-col gap-3">
                {education.map((edu, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-border">
                    <p className="text-sm font-semibold text-text">{edu.degree || 'Degree'}</p>
                    {edu.specialization && (
                      <p className="text-xs text-text-secondary">{edu.specialization}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {edu.institute && (
                        <span className="text-[11px] text-text-secondary/60">{edu.institute}</span>
                      )}
                      {edu.graduation_year && (
                        <span className="text-[11px] text-text-secondary/40">{edu.graduation_year}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
              <h3 className="text-base font-bold text-text mb-3">Projects</h3>
              <div className="flex flex-col gap-3">
                {projects.map((proj, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-border">
                    <p className="text-sm font-semibold text-text mb-1">{proj.name || 'Project'}</p>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {proj.technologies.map((tech) => (
                          <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-xs text-text-secondary/80 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length === 0 && experience.length === 0 && education.length === 0 && projects.length === 0 && preferredRoles.length === 0 && (
            <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-text-secondary/30 mb-2">person</span>
              <p className="text-sm text-text-secondary">No profile data yet. Upload and parse your resume to get started.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

function SettingsView() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">Settings</h1>
      <p className="text-sm text-text-secondary mb-6">Configure your preferences</p>
      <div className="bg-[#0A0A0F] border border-border rounded-xl p-8 text-center">
        <span className="material-symbols-outlined text-3xl text-text-secondary/30 mb-2">settings</span>
        <p className="text-sm text-text-secondary">Settings panel coming soon</p>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const activeView = location.pathname.replace('/', '') || 'dashboard'
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async (signal = undefined) => {
    if (!isLoaded) return
    if (!isSignedIn) {
      navigate('/sign-in')
      return
    }
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await getDashboard(token, { signal })
      setDashboardData(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      if (err.message === 'Unauthorized') {
        navigate('/sign-in')
        return
      }
      setError(err.message)
    }
  }, [getToken, isLoaded, isSignedIn, navigate])

  const [importState, setImportState] = useState({ loading: false, message: '' })
  const [generating, setGenerating] = useState(false)
  const [careerAnalysis, setCareerAnalysis] = useState(null)
  const [careerAnalysisLoading, setCareerAnalysisLoading] = useState(true)
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false)

  const fetchCareerAnalysis = useCallback(async (signal = undefined) => {
    if (!isLoaded || !isSignedIn) return
    try {
      const token = await getFreshToken(getToken)
      const data = await getCareerAnalysis(token, { signal })
      setCareerAnalysis(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      if (err.message === 'Not Found' || err.message === 'Career analysis not found') {
        setCareerAnalysis(null)
        return
      }
      console.error(err)
    }
  }, [getToken, isLoaded, isSignedIn])

  const refreshCareerData = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchCareerAnalysis()])
  }, [fetchDashboard, fetchCareerAnalysis])

  const handleImportJobs = useCallback(async () => {
    setImportState({ loading: true, message: 'Importing...' })
    try {
      const token = await getFreshToken(getToken)
      const data = await importJobs(token)
      setImportState({ loading: false, message: `Imported ${data?.imported || 0} jobs` })
      await refreshCareerData()
    } catch (err) {
      setImportState({ loading: false, message: err.message })
    }
  }, [getToken, refreshCareerData])

  const handleGenerateRecommendations = useCallback(async () => {
    setGenerating(true)
    try {
      const token = await getFreshToken(getToken)
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/recommendations/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to generate recommendations')
      }
      await refreshCareerData()
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setGenerating(false)
    }
  }, [getToken, refreshCareerData])

  const handleGenerateCareerAnalysis = useCallback(async () => {
    setGeneratingAnalysis(true)
    try {
      const token = await getFreshToken(getToken)
      await generateCareerAnalysis(token)
      await refreshCareerData()
    } catch (err) {
      alert(err.message)
    } finally {
      setGeneratingAnalysis(false)
    }
  }, [getToken, refreshCareerData])

  useEffect(() => {
    const controller = new AbortController()

    if (activeView === 'dashboard' || activeView === 'ai-recommendations') {
      setLoading(true)
      setCareerAnalysisLoading(true)
      Promise.allSettled([
        fetchDashboard(controller.signal),
        fetchCareerAnalysis(controller.signal),
      ]).finally(() => {
        setLoading(false)
        setCareerAnalysisLoading(false)
      })
    } else {
      setLoading(false)
      setCareerAnalysisLoading(false)
    }

    return () => controller.abort()
  }, [activeView, fetchDashboard, fetchCareerAnalysis])

  const derivedInsights = useMemo(() => {
    if (!careerAnalysis) return null
    const { resume_score, market_score, missing_skills = [], role_readiness = {} } = careerAnalysis
    const roleEntries = Object.entries(role_readiness).sort((a, b) => b[1] - a[1])
    const topRole = roleEntries[0]
    const topMissing = missing_skills[0]

    return [
      {
        type: 'match',
        icon: 'target',
        label: 'Resume Quality',
        value: resume_score != null ? `${resume_score}%` : '--',
        detail: topRole
          ? `Your resume scores ${resume_score}/100 — ${topRole[0]} readiness: ${topRole[1]}%`
          : `Your resume scores ${resume_score}/100`,
        color: 'text-primary',
      },
      {
        type: 'demand',
        icon: 'trending_up',
        label: 'Market Readiness',
        value: market_score != null ? `${market_score}%` : '--',
        detail: `Your skills cover ${market_score}% of in-demand skills across your target roles.`,
        color: 'text-emerald-400',
      },
      {
        type: 'gap',
        icon: 'construction',
        label: 'Biggest Skill Gap',
        value: topMissing?.skill || 'None identified',
        detail: topMissing
          ? `Learning ${topMissing.skill} could open more matching opportunities.`
          : 'Your skills already align well with current market demand.',
        color: 'text-amber-400',
      },
      {
        type: 'recommendation',
        icon: 'auto_awesome',
        label: 'Best Career Path',
        value: topRole?.[0] || 'Insufficient data',
        detail: topRole
          ? `Readiness: ${topRole[1]}% — Based on your skills and experience.`
          : 'Add preferred roles to your profile for personalized guidance.',
        color: 'text-accent',
      },
    ]
  }, [careerAnalysis])

  const renderView = () => {
    if (loading && !dashboardData) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardSkeleton />
          </motion.div>
        </AnimatePresence>
      )
    }

    if (error) {
      return <ErrorState message={error} onRetry={fetchDashboard} />
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView
          dashboardData={dashboardData}
          careerAnalysis={careerAnalysis}
          careerAnalysisLoading={careerAnalysisLoading}
          insights={derivedInsights}
          onGenerateCareerAnalysis={handleGenerateCareerAnalysis}
          generatingAnalysis={generatingAnalysis}
          onNavigate={(viewId) => { const path = viewId === 'dashboard' ? '/dashboard' : `/${viewId}`; navigate(path) }}
          onImportJobs={handleImportJobs}
          importState={importState}
          onGenerateRecommendations={handleGenerateRecommendations}
          generatingRecommendations={generating}
        />
      case 'jobs':
        return <JobsView getToken={getToken} />
      case 'applications':
        return <ApplicationsView getToken={getToken} />
      case 'resume':
        return <ResumeView getToken={getToken} />
      case 'ai-recommendations':
        return (
          <AIRecommendationsView
            recommendedJobs={dashboardData?.recommendedJobs}
            careerAnalysis={careerAnalysis}
            insights={derivedInsights}
            careerAnalysisLoading={careerAnalysisLoading}
            onGenerateCareerAnalysis={handleGenerateCareerAnalysis}
            generatingAnalysis={generatingAnalysis}
            onGenerateRecommendations={handleGenerateRecommendations}
            generatingRecommendations={generating}
          />
        )
      case 'profile':
        return <ProfileView getToken={getToken} />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView
          dashboardData={dashboardData}
          careerAnalysis={careerAnalysis}
          careerAnalysisLoading={careerAnalysisLoading}
          insights={derivedInsights}
          onGenerateCareerAnalysis={handleGenerateCareerAnalysis}
          generatingAnalysis={generatingAnalysis}
          onNavigate={(viewId) => { const path = viewId === 'dashboard' ? '/dashboard' : `/${viewId}`; navigate(path) }}
          onImportJobs={handleImportJobs}
          importState={importState}
          onGenerateRecommendations={handleGenerateRecommendations}
          generatingRecommendations={generating}
        />
    }
  }

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col md:flex-row antialiased">
      <Sidebar activeView={activeView} onNavigateHome={() => navigate('/')} />
      <Topbar pipeline={dashboardData?.pipeline} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-[72px] md:pt-14 pb-[80px] md:pb-0 px-4 md:px-8 w-full max-w-[1440px] mx-auto">
        <div className="py-5 md:py-6">
          <AnimatePresence mode="wait">
            <div key={activeView}>
              {renderView()}
            </div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-3 border-t border-border mb-[80px] md:mb-0">
          <div className="text-[11px] font-mono text-text-secondary/60">
            AutoApply AI v1.0.0 &middot; Engineered for performance
          </div>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'API Docs', 'Support'].map((link) => (
              <a key={link} className="text-xs text-text-secondary/60 hover:text-primary transition-colors" href="#">
                {link}
              </a>
            ))}
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-border flex justify-around items-center px-2 py-1 pb-safe">
        {tabNav.map((tab) => {
          const isActive = activeView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                const path = tab.id === 'dashboard' ? '/dashboard' : `/${tab.id}`
                navigate(path)
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] py-2 px-2 rounded-xl active:scale-90 transition-all duration-200 ${
                isActive ? 'bg-primary/10' : ''
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className={`text-[9px] font-semibold mt-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-text-secondary'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
