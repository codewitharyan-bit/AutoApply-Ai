import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

function orNotSet(value) {
  if (value === null || value === undefined || value === '') return 'Not Set'
  return value
}

function formatExperience(exp) {
  if (!exp) return 'Not Set'
  if (Array.isArray(exp)) {
    if (exp.length === 0) return 'Not Set'
    return `${exp.length} position${exp.length > 1 ? 's' : ''}`
  }
  if (typeof exp === 'string') return exp.trim() || 'Not Set'
  return 'Not Set'
}

function formatArrayLength(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  return arr.length
}

export default function ProfileWidget({ profile, onNavigate }) {
  const { user } = useUser()

  const skills = Array.isArray(profile?.skills) ? profile.skills : []
  const displaySkills = skills.slice(0, 4)
  const extraSkillsCount = Math.max(0, skills.length - 4)
  const experience = profile?.experience
  const experienceDisplay = formatExperience(experience)
  const preferredRoles = Array.isArray(profile?.preferred_roles) ? profile.preferred_roles : []
  const education = Array.isArray(profile?.education) ? profile.education : []
  const projects = Array.isArray(profile?.projects) ? profile.projects : []
  const location = orNotSet(profile?.location)
  const resumeUploaded = !!profile?.resume_url
  const resumeName = profile?.resume_name || null
  const completion = profile?.completion ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">badge</span>
          <h3 className="text-base font-bold text-text">Profile Snapshot</h3>
        </div>
        <button
          onClick={() => onNavigate?.('profile')}
          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Edit
        </button>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border">
          <img
            alt="Avatar"
            className="w-full h-full object-cover"
            src={user?.imageUrl || 'https://ui-avatars.com/api/?name=U&background=6366F1&color=fff&size=40'}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-text">{user?.fullName || 'Your Name'}</p>
          <p className="text-xs text-text-secondary">{location}</p>
        </div>
      </div>

      {/* Resume */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">Resume</span>
          {resumeUploaded ? (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              Uploaded
            </span>
          ) : (
            <button className="text-[10px] text-primary font-medium">Upload</button>
          )}
        </div>
        {resumeUploaded && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-border">
            <span className="material-symbols-outlined text-sm text-primary">description</span>
            <span className="text-xs text-text-secondary truncate">{resumeName || 'Resume uploaded'}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/[0.02] rounded-lg p-2.5 border border-border">
          <p className="text-[10px] text-text-secondary/60">Skills</p>
          <p className="text-sm font-bold text-text">{skills.length}</p>
        </div>
        <div className="bg-white/[0.02] rounded-lg p-2.5 border border-border">
          <p className="text-[10px] text-text-secondary/60">Experience</p>
          <p className="text-sm font-bold text-text">{experienceDisplay}</p>
        </div>
        <div className="bg-white/[0.02] rounded-lg p-2.5 border border-border">
          <p className="text-[10px] text-text-secondary/60">Education</p>
          <p className="text-sm font-bold text-text">{formatArrayLength(education)}</p>
        </div>
        <div className="bg-white/[0.02] rounded-lg p-2.5 border border-border">
          <p className="text-[10px] text-text-secondary/60">Projects</p>
          <p className="text-sm font-bold text-text">{formatArrayLength(projects)}</p>
        </div>
      </div>

      {/* Skills Badges */}
      {displaySkills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-text-secondary mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1">
            {displaySkills.map((skill) => (
              <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {skill}
              </span>
            ))}
            {extraSkillsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-text-secondary border border-border">
                +{extraSkillsCount} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Preferred Roles */}
      {preferredRoles.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-text-secondary mb-1.5">Preferred Roles</p>
          <div className="flex flex-wrap gap-1">
            {preferredRoles.map((role) => (
              <span key={role} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Completion Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">Profile Completion</span>
          <span className="text-xs font-semibold text-primary">{completion}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>
    </motion.div>
  )
}
