import { motion, AnimatePresence } from 'framer-motion'

export default function SaveBar({ isDirty, saving, onSave, onReset }) {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="sticky bottom-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 pb-4 pt-2 bg-gradient-to-t from-dark via-dark/95 to-transparent"
        >
          <div className="bg-[#0A0A0F] border border-border rounded-xl p-3 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <p className="text-sm text-text-secondary">You have unsaved changes</p>
                <p className="text-[10px] text-text-secondary/50">Save before the automation engine uses the updated rules.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={saving || !isDirty}
                onClick={onReset}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text border border-border hover:bg-white/[0.04] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={saving || !isDirty}
                onClick={onSave}
                className="px-5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
