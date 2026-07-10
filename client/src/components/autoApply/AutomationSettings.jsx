import SettingsCard from './SettingsCard'
import ToggleSetting from './ToggleSetting'
import SliderSetting from './SliderSetting'
import NumberSetting from './NumberSetting'

export default function AutomationSettings({ preferences, updatePreference, disabled }) {
  return (
    <SettingsCard title="Automation" description="Configure how Auto Apply behaves.">
      {disabled && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
          Automation is disabled.
          <br />
          <span className="text-xs text-amber-400/70">Enable Auto Apply above to edit automation rules.</span>
        </div>
      )}
      <div className="divide-y divide-white/[0.06]">
        <ToggleSetting
          label="Enable Auto Apply"
          description="Allow the system to automatically apply to matching jobs."
          value={preferences.enabled}
          onChange={(v) => updatePreference('enabled', v)}
        />
        <ToggleSetting
          label="Allow Remote"
          description="Include remote positions when searching for matches."
          value={preferences.allow_remote}
          onChange={(v) => updatePreference('allow_remote', v)}
          disabled={disabled}
        />
        <SliderSetting
          label="Minimum Match Score"
          description="Minimum AI confidence score required to submit an application."
          value={preferences.minimum_match_score}
          onChange={(v) => updatePreference('minimum_match_score', v)}
          disabled={disabled}
        />
        <SliderSetting
          label="Minimum Resume Score"
          description="Minimum resume compatibility score required."
          value={preferences.minimum_resume_score}
          onChange={(v) => updatePreference('minimum_resume_score', v)}
          disabled={disabled}
        />
        <NumberSetting
          label="Daily Limit"
          description="Maximum number of automated applications per day."
          value={preferences.daily_limit}
          min={1}
          max={100}
          onChange={(v) => updatePreference('daily_limit', v)}
          disabled={disabled}
        />
      </div>
    </SettingsCard>
  )
}
