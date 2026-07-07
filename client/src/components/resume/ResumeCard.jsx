import { motion } from 'framer-motion'
import ResumeActions from './ResumeActions'

function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ResumeCard({ resume, onView, onParse, onReplace, onDelete, parsing, parsedData, onAccept, onReject, accepting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0F] border border-border rounded-xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl text-primary">picture_as_pdf</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text truncate">{resume.file_name || 'Resume'}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            {resume.created_at && (
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                {formatDate(resume.created_at)}
              </span>
            )}
            {resume.file_size && (
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">storage</span>
                {formatFileSize(resume.file_size)}
              </span>
            )}
          </div>
        </div>
      </div>

      <ResumeActions onView={onView} onParse={onParse} onReplace={onReplace} onDelete={onDelete} parsing={parsing} />

      {parsedData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-5 pt-5 border-t-2 border-amber-500/30 bg-amber-500/[0.03] -mx-5 px-5 pb-5 -mb-5 rounded-b-xl"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lg text-amber-400">auto_awesome</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">AI Resume Analysis</h4>
              <p className="text-[11px] text-amber-400/70 mt-0.5">
                The information below was extracted from your resume. Please review it before applying it to your profile.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {parsedData.skills?.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-text-secondary">Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {parsedData.skills.map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(parsedData.experience) && parsedData.experience.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-text-secondary">Experience</span>
                <div className="flex flex-col gap-2 mt-1">
                  {parsedData.experience.map((exp, i) => (
                    <div key={i} className="p-2 rounded bg-white/[0.02] border border-border">
                      <p className="text-xs font-semibold text-text">{exp.role || 'Role'}{exp.company ? ` at ${exp.company}` : ''}</p>
                      {exp.duration && <p className="text-[10px] text-text-secondary/60">{exp.duration}</p>}
                      {exp.description && <p className="text-[10px] text-text-secondary/80 mt-0.5">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {parsedData.preferred_roles?.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-text-secondary">Preferred Roles</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {parsedData.preferred_roles.map((r) => (
                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(parsedData.education) && parsedData.education.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-text-secondary">Education</span>
                <div className="flex flex-col gap-2 mt-1">
                  {parsedData.education.map((e, i) => (
                    <div key={i} className="p-2 rounded bg-white/[0.02] border border-border">
                      <p className="text-xs font-semibold text-text">{e.degree || 'Degree'}</p>
                      {e.specialization && <p className="text-[10px] text-text-secondary">{e.specialization}</p>}
                      {e.institute && <p className="text-[10px] text-text-secondary/60">{e.institute}{e.graduation_year ? ` · ${e.graduation_year}` : ''}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(parsedData.projects) && parsedData.projects.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-text-secondary">Projects</span>
                <div className="flex flex-col gap-2 mt-1">
                  {parsedData.projects.map((p, i) => (
                    <div key={i} className="p-2 rounded bg-white/[0.02] border border-border">
                      <p className="text-xs font-semibold text-text">{p.name || 'Project'}</p>
                      {p.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {p.technologies.map((t) => (
                            <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t}</span>
                          ))}
                        </div>
                      )}
                      {p.description && <p className="text-[10px] text-text-secondary/80 mt-0.5">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-amber-500/10">
            <button
              onClick={() => onAccept(parsedData)}
              disabled={accepting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-500/90 text-[#0A0A0F] text-xs font-bold transition-all disabled:opacity-50"
            >
              {accepting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Applying...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Apply to Profile
                </>
              )}
            </button>
            <button
              onClick={onReject}
              disabled={accepting}
              className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary text-xs font-semibold transition-all border border-border disabled:opacity-50"
            >
              Discard
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
