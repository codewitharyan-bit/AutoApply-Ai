import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getFreshToken } from '../utils/auth'
import { getResume, uploadResume, viewResume, deleteResume, parseResume, applyParsedData } from '../services/resume'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import ResumeCard from '../components/resume/ResumeCard'
import ResumeSkeleton from '../components/resume/ResumeSkeleton'
import EmptyResume from '../components/resume/EmptyResume'
import ResumeUploader from '../components/resume/ResumeUploader'
import CareerIntelligenceCard from '../components/CareerIntelligenceCard'

const tabNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'jobs', label: 'Jobs', icon: 'work' },
  { id: 'applications', label: 'Applications', icon: 'description' },
  { id: 'ai-recommendations', label: 'AI', icon: 'auto_awesome' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

export default function ResumePage() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [accepting, setAccepting] = useState(false)
  const inputRef = useRef(null)

  const fetchResume = useCallback(async () => {
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
      const data = await getResume(token)
      setResume(data)
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
    fetchResume()
  }, [fetchResume])

  const handleUpload = async (file) => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await uploadResume(token, file, setUploadProgress)
      setResume(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleAcceptParsed = async (data) => {
    setAccepting(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      await applyParsedData(token, data)
      setParsedData(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setAccepting(false)
    }
  }

  const handleRejectParsed = () => {
    setParsedData(null)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      await deleteResume(token)
      setResume(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleParse = async () => {
    setParsing(true)
    setError(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await parseResume(token)
      setParsedData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setParsing(false)
    }
  }

  const handleView = async () => {
    try {
      setError(null)
      const token = await getFreshToken(getToken)
      const url = await viewResume(token)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err.message)
    }
  }

  const triggerFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      e.target.value = ''
      return
    }

    handleUpload(file)
    e.target.value = ''
  }

  const handleSetActiveView = (viewId) => {
    if (viewId === 'resume') return
    const path = viewId === 'dashboard' ? '/dashboard' : `/${viewId}`
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col md:flex-row antialiased">
      <Sidebar activeView="resume" onNavigateHome={() => navigate('/')} />
      <Topbar pipeline={null} />

      <main className="flex-1 md:ml-64 pt-[72px] md:pt-14 pb-[80px] md:pb-0 px-4 md:px-8 w-full max-w-[1440px] mx-auto">
        <div className="py-5 md:py-6 min-h-[calc(100dvh-3.5rem)]">
          {loading ? (
            <ResumeSkeleton />
          ) : error && !uploading ? (
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
                onClick={fetchResume}
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text">Resume</h1>
                    <p className="text-sm text-text-secondary mt-0.5">Manage your resume and optimize for AI matching</p>
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <ResumeUploader
                    uploading={uploading}
                    progress={uploadProgress}
                    onFileSelect={handleUpload}
                  />
                </div>

                {/* Error message for upload failures */}
                {error && uploading === false && resume && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
                    {error}
                  </div>
                )}

                {/* Content */}
                {!resume ? (
                  <EmptyResume onUpload={triggerFilePicker} />
                ) : (
                  <>
                    <ResumeCard
                      resume={resume}
                      onView={handleView}
                      onParse={handleParse}
                      onReplace={triggerFilePicker}
                      onDelete={handleDelete}
                      parsing={parsing}
                      parsedData={parsedData}
                      onAccept={handleAcceptParsed}
                      onReject={handleRejectParsed}
                      accepting={accepting}
                    />
                    <div className="mt-5">
                      <CareerIntelligenceCard />
                    </div>
                  </>
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
          const isActive = tab.id === 'resume'
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
