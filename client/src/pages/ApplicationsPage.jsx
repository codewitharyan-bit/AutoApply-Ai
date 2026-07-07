import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getFreshToken } from '../utils/auth'
import { getApplications, updateApplication, deleteApplication } from '../services/application'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import ApplicationCard from '../components/applications/ApplicationCard'
import ApplicationFilters from '../components/applications/ApplicationFilters'
import ApplicationSkeleton from '../components/applications/ApplicationSkeleton'
import EmptyApplications from '../components/applications/EmptyApplications'

const tabNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'jobs', label: 'Jobs', icon: 'work' },
  { id: 'applications', label: 'Applications', icon: 'description' },
  { id: 'ai-recommendations', label: 'AI', icon: 'auto_awesome' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

export default function ApplicationsPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const fetchApplications = useCallback(async () => {
    if (!isLoaded) return
    if (!isSignedIn) {
      navigate('/sign-in')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      if (!token) {
        navigate('/sign-in')
        return
      }
      const data = await getApplications(token)
      setApplications(data || [])
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/sign-in')
        return
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken, isLoaded, isSignedIn, navigate])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const filteredApplications = useMemo(() => {
    let filtered = applications

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((app) => app.status === selectedStatus)
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim()
      filtered = filtered.filter((app) => {
        const job = app.jobs || {}
        return (
          (job.company && job.company.toLowerCase().includes(query)) ||
          (job.title && job.title.toLowerCase().includes(query)) ||
          (job.location && job.location.toLowerCase().includes(query))
        )
      })
    }

    return filtered
  }, [applications, search, selectedStatus])

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = await getFreshToken(getToken)
      await updateApplication(token, appId, newStatus)
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (appId) => {
    if (!confirm('Remove this application?')) return
    try {
      const token = await getFreshToken(getToken)
      await deleteApplication(token, appId)
      setApplications((prev) => prev.filter((a) => a.id !== appId))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSetActiveView = (viewId) => {
    if (viewId === 'applications') return
    const path = viewId === 'dashboard' ? '/dashboard' : `/${viewId}`
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col md:flex-row antialiased">
      <Sidebar activeView="applications" onNavigateHome={() => navigate('/')} />
      <Topbar pipeline={null} />

      <main className="flex-1 md:ml-64 pt-[72px] md:pt-14 pb-[80px] md:pb-0 px-4 md:px-8 w-full max-w-[1440px] mx-auto">
        <div className="py-5 md:py-6 min-h-[calc(100dvh-3.5rem)]">
          {loading ? (
            <ApplicationSkeleton />
          ) : error ? (
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
                <p className="text-sm text-text-secondary max-w-md">{error}</p>
              </div>
              <button
                onClick={fetchApplications}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <ApplicationFilters
                  total={filteredApplications.length}
                  search={search}
                  onSearchChange={setSearch}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />

                {filteredApplications.length === 0 ? (
                  <EmptyApplications />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredApplications.map((app, i) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        index={i}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
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
          const isActive = tab.id === 'applications'
          return (
            <button
              key={tab.id}
              onClick={() => handleSetActiveView(tab.id)}
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
