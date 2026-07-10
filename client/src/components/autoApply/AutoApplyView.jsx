import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import useAutoApplyPreferences from '../../hooks/useAutoApplyPreferences'
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
      <AutomationLifecycle engine={engine} />
      <OverviewCards engine={engine} preferences={preferences} />
      <AutomationEngineCard engine={engine} />
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
      <QueueSection items={[]} loading={false} />
      <ActivitySection items={[]} loading={false} />

      <SaveBar
        isDirty={isDirty}
        saving={saving}
        onSave={save}
        onReset={reset}
      />
    </div>
  )
}
