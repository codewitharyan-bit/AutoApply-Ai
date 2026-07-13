import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getFreshToken } from '../../utils/auth'
import useAutoApplyPreferences from '../../hooks/useAutoApplyPreferences'
import { runMatchingTest, queueJobs, getQueue, removeQueueItem, runNextJob, runBatch, getActivity } from '../../services/autoApply'
import AutoApplyHeader from './AutoApplyHeader'
import AutomationLifecycle from './AutomationLifecycle'
import OverviewCards from './OverviewCards'
import AutomationEngineCard from './AutomationEngineCard'
import AutomationSettings from './AutomationSettings'
import PreferencesSection from './PreferencesSection'
import QueueSection from './QueueSection'
import ActivitySection from './ActivitySection'
import SaveBar from './SaveBar'
import AutoApplySkeleton from './AutoApplySkeleton'

export default function AutoApplyView() {
  const { getToken } = useAuth()
  const {
    preferences,
    loading,
    error,
    saving,
    isDirty,
    updatePreference,
    save,
    reset,
    fetchPreferences,
  } = useAutoApplyPreferences(getToken)

  const [testResult, setTestResult] = useState(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testError, setTestError] = useState(null)
  const [workflowState, setWorkflowState] = useState({
    scanStarted: false,
    queued: false,
    submitted: false,
  })

  const [queueItems, setQueueItems] = useState([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState(null)

  const [workerState, setWorkerState] = useState({ state: 'idle', processedCount: 0 })
  const [runNextLoading, setRunNextLoading] = useState(false)
  const [runBatchLoading, setRunBatchLoading] = useState(false)
  const [activityItems, setActivityItems] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)

  const fetchActivity = useCallback(async () => {
    try {
      const token = await getFreshToken(getToken)
      const items = await getActivity(token)
      setActivityItems(items)
    } catch {
      // activity may be empty
    }
  }, [getToken])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const token = await getFreshToken(getToken)
        const [queue, _activity] = await Promise.all([
          getQueue(token),
          getActivity(token).catch(() => []),
        ])
        if (!cancelled) {
          setQueueItems(queue)
          setActivityItems(_activity)
        }
      } catch {
        // queue may be empty
      }
    }
    load()
    return () => { cancelled = true }
  }, [getToken, fetchActivity])

  const handleRunTest = async () => {
    setWorkflowState(prev => ({ ...prev, scanStarted: true }))
    setTestLoading(true)
    setTestError(null)
    setTestResult(null)
    try {
      const token = await getFreshToken(getToken)
      const data = await runMatchingTest(token)
      setTestResult(data)
    } catch (err) {
      setTestResult(null)
      setTestError(err.message)
    } finally {
      setTestLoading(false)
    }
  }

  const handleQueueJobs = async () => {
    if (!testResult?.jobs?.length) return
    setQueueLoading(true)
    setQueueError(null)
    try {
      const token = await getFreshToken(getToken)
      const body = {
        jobs: testResult.jobs.map((j) => ({
          jobId: j.job.id,
          matchScore: j.matchScore,
          resumeScore: j.resumeScore,
        })),
      }
      const result = await queueJobs(token, body)
      setQueueItems(result.items)
      setWorkflowState(prev => ({ ...prev, queued: true }))
    } catch (err) {
      setQueueError(err.message)
    } finally {
      setQueueLoading(false)
    }
  }

  const handleRemoveQueueItem = async (id) => {
    try {
      const token = await getFreshToken(getToken)
      await removeQueueItem(token, id)
      setQueueItems((prev) => prev.filter((item) => item.id !== id))
    } catch {
      // silently fail
    }
  }

  const refreshQueueAndActivity = async () => {
    try {
      const token = await getFreshToken(getToken)
      const [queue, activity] = await Promise.all([
        getQueue(token).catch(() => []),
        getActivity(token).catch(() => []),
      ])
      setQueueItems(queue)
      setActivityItems(activity)
    } catch {
      // silently fail
    }
  }

  const handleRunNext = async () => {
    setRunNextLoading(true)
    try {
      const token = await getFreshToken(getToken)
      const result = await runNextJob(token)
      setWorkerState(result.worker)
      if (result.job?.status === 'completed') {
        setWorkflowState(prev => ({ ...prev, submitted: true }))
      }
      await refreshQueueAndActivity()
    } catch {
      // silently fail
    } finally {
      setRunNextLoading(false)
    }
  }

  const handleRunBatch = async () => {
    setRunBatchLoading(true)
    try {
      const token = await getFreshToken(getToken)
      const result = await runBatch(token)
      setWorkerState(result.worker)
      if (result.summary?.completed > 0) {
        setWorkflowState(prev => ({ ...prev, submitted: true }))
      }
      await refreshQueueAndActivity()
    } catch {
      // silently fail
    } finally {
      setRunBatchLoading(false)
    }
  }

  const pendingCount = queueItems.filter((i) => i.status === 'pending').length

  if (loading) return <AutoApplySkeleton />

  if (error) {
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
          <p className="text-sm text-text-secondary max-w-md">{error}</p>
        </div>
        <button
          onClick={fetchPreferences}
          className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </motion.div>
    )
  }

  if (!preferences) return null

  const engine = {
    status: 'offline',
    usageToday: 0,
    dailyLimit: preferences.daily_limit,
    queueCount: 0,
    matchedToday: 0,
    submittedToday: 0,
    failedToday: 0,
    lastRun: null,
    lastScan: null,
    lastMatch: null,
    nextRun: null,
  }

  const disabled = !preferences.enabled

  return (
    <div className="flex flex-col gap-5 min-h-[calc(100dvh-12rem)]">
      <AutoApplyHeader />

      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {testResult?.eligible > 0 && (
            <button
              onClick={handleQueueJobs}
              disabled={queueLoading}
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {queueLoading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  Queuing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">queue</span>
                  Queue {testResult.eligible} Eligible Jobs
                </>
              )}
            </button>
          )}
          {pendingCount > 0 && (
            <>
              <button
                onClick={handleRunNext}
                disabled={runNextLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {runNextLoading ? (
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                )}
                Run Next
              </button>
              <button
                onClick={handleRunBatch}
                disabled={runBatchLoading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {runBatchLoading ? (
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">playlist_play</span>
                )}
                Run All ({pendingCount})
              </button>
            </>
          )}
          <button
            onClick={handleRunTest}
            disabled={testLoading}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {testLoading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                Scanning...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">travel_explore</span>
                Scan & Queue
              </>
            )}
          </button>
        </div>
      </div>

      {testError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400"
        >
          {testError}
        </motion.div>
      )}

      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold mb-1">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Matching completed
          </div>
          <div className="text-xs text-text-secondary">
            {testResult.scanned} jobs scanned • {testResult.eligible} eligible • {testResult.rejected} rejected
          </div>
          <div className="text-[11px] text-text-secondary/60 mt-0.5">
            Engine v{testResult.meta.engineVersion} • {testResult.meta.executionTimeMs} ms
          </div>
        </motion.div>
      )}

      <AutomationLifecycle workflowState={workflowState} testResult={testResult} testLoading={testLoading} workerState={workerState} />
      <OverviewCards engine={engine} preferences={preferences} testResult={testResult} />
      <AutomationEngineCard engine={engine} testResult={testResult} />
      <AutomationSettings
        preferences={preferences}
        updatePreference={updatePreference}
        disabled={disabled}
      />
      <PreferencesSection
        preferences={preferences}
        updatePreference={updatePreference}
        disabled={disabled}
      />
      <QueueSection
        items={[]}
        loading={queueLoading}
        testResult={testResult}
        queueItems={queueItems}
        onRemoveItem={handleRemoveQueueItem}
      />
      <ActivitySection items={activityItems} loading={activityLoading} />

      <SaveBar
        isDirty={isDirty}
        saving={saving}
        onSave={save}
        onReset={reset}
      />
    </div>
  )
}
