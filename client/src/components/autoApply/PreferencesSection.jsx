import SettingsCard from './SettingsCard'
import TagInput from './TagInput'

export default function PreferencesSection({ preferences, updatePreference, disabled }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SettingsCard title="Job Filters" description="Location, employment type and experience preferences.">
        <div className="divide-y divide-white/[0.06]">
          <TagInput
            label="Locations"
            description="Cities or regions to target."
            tags={preferences.locations}
            onChange={(v) => updatePreference('locations', v)}
            placeholder="e.g. San Francisco, Remote"
            disabled={disabled}
          />
          <TagInput
            label="Job Types"
            description="Types of employment to include."
            tags={preferences.job_types}
            onChange={(v) => updatePreference('job_types', v)}
            placeholder="e.g. Full Time, Internship"
            disabled={disabled}
          />
          <TagInput
            label="Experience Levels"
            description="Required experience levels."
            tags={preferences.experience_levels}
            onChange={(v) => updatePreference('experience_levels', v)}
            placeholder="e.g. Entry Level, Senior"
            disabled={disabled}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Matching Rules" description="Skills and company preferences for job matching.">
        <div className="divide-y divide-white/[0.06]">
          <TagInput
            label="Required Skills"
            description="Skills the candidate should have."
            tags={preferences.required_skills}
            onChange={(v) => updatePreference('required_skills', v)}
            placeholder="e.g. React, TypeScript"
            disabled={disabled}
          />
          <TagInput
            label="Excluded Companies"
            description="Companies to exclude from auto-apply."
            tags={preferences.excluded_companies}
            onChange={(v) => updatePreference('excluded_companies', v)}
            placeholder="e.g. TCS, Infosys"
            disabled={disabled}
          />
        </div>
      </SettingsCard>
    </div>
  )
}
