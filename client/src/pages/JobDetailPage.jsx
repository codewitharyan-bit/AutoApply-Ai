import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getFreshToken } from '../utils/auth'
import { getJob } from '../services/job'
import { saveApplication } from '../services/application'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import JobMatchExplanation from '../components/JobMatchExplanation'

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

const tabNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'jobs', label: 'Jobs', icon: 'work' },
  { id: 'applications', label: 'Applications', icon: 'description' },
  { id: 'ai-recommendations', label: 'AI', icon: 'auto_awesome' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

export default function JobDetailPage() {
  const { id } = useParams()
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveState, setSaveState] = useState('idle')
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      navigate('/sign-in')
      return
    }
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const t = await getFreshToken(getToken)
        if (!t) {
          navigate('/sign-in')
          return
        }
        setToken(t)
        const data = await getJob(t, id)
        setJob(data)
      } catch (err) {
        if (err.message === 'Unauthorized') {
          navigate('/sign-in')
          return
        }
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, getToken, isLoaded, isSignedIn, navigate])

  const handleSave = async () => {
    if (saveState === 'saving' || saveState === 'saved') return
    setSaveState('saving')
    try {
      const token = await getFreshToken(getToken)
      await saveApplication(token, job.id)
      setSaveState('saved')
    } catch (err) {
      setSaveState(err.message === 'Job already saved.' ? 'saved' : 'idle')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex flex-col md:flex-row antialiased">
        <Sidebar activeView="jobs" onNavigateHome={() => navigate('/')} />
        <Topbar pipeline={null} />
        <main className="flex-1 md:ml-64 pt-[72px] md:pt-14 px-4 md:px-8 w-full max-w-[1440px] mx-auto">
          <div className="py-5 md:py-6 space-y-4">
            <div className="h-8 w-64 animate-pulse bg-white/[0.04] rounded-lg" />
            <div className="h-4 w-48 animate-pulse bg-white/[0.04] rounded-lg" />
            <div className="h-64 animate-pulse bg-white/[0.04] rounded-xl" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-dark text-text flex flex-col md:flex-row antialiased">
        <Sidebar activeView="jobs" onNavigateHome={() => navigate('/')} />
        <Topbar pipeline={null} />
        <main className="flex-1 md:ml-64 pt-[72px] md:pt-14 px-4 md:px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-rose-400">error_outline</span>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-text mb-1">Job not found</h2>
              <p className="text-sm text-text-secondary max-w-md">{error || 'Could not load job details.'}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col md:flex-row antialiased">
      <Sidebar activeView="jobs" onNavigateHome={() => navigate('/')} />
      <Topbar pipeline={null} />

      <main className="flex-1 md:ml-64 pt-[72px] md:pt-14 pb-[80px] md:pb-0 px-4 md:px-8 w-full max-w-[1440px] mx-auto">
        <div className="py-5 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors mb-4"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                {job.logo ? (
                  <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary">{job.company?.charAt(0) || '?'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-text">{job.title}</h1>
                  {job.salary && (
                    <span className="text-sm font-semibold text-emerald-400">{job.salary}</span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">{job.company}</p>
                <div className="flex items-center gap-3 mt-1">
                  {job.location && (
                    <span className="text-xs text-text-secondary/60 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {job.location}
                    </span>
                  )}
                  {job.created_at && (
                    <span className="text-xs text-text-secondary/60">{getRelativeTime(job.created_at)}</span>
                  )}
                  {job.type && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-border text-text-secondary">{job.type}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleSave}
                disabled={saveState === 'saving' || saveState === 'saved'}
                className={`px-4 py-2 rounded-lg border text-xs font-medium transition-colors ${
                  saveState === 'saved'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-white/[0.04] border-border text-text-secondary hover:text-text hover:bg-white/[0.06]'
                } disabled:opacity-60`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  {saveState === 'saved' ? 'bookmark' : 'bookmark_border'}
                </span>
                {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : 'Save'}
              </button>
              {job.job_url && (
                <a
                  href={job.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-white text-xs font-medium hover:bg-primary/30 transition-colors"
                >
                  Apply on Site
                </a>
              )}
            </div>

            {/* AI Match Explanation */}
            {token && (
              <div className="mb-6">
                <JobMatchExplanation token={token} jobId={id} />
              </div>
            )}

            {/* Description */}
            {job.description && (
              <div className="bg-[#0A0A0F] border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-text mb-3">Job Description</h2>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
          </motion.div>
        </div>

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

      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-border flex justify-around items-center px-2 py-1 pb-safe">
        {tabNav.map((tab) => {
          const isActive = tab.id === 'jobs'
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
