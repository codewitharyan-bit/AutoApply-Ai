export default function ResumeActions({ onView, onParse, onReplace, onDelete, parsing }) {
  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
      <button
        onClick={onView}
        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border text-[11px] font-medium text-text-secondary hover:text-text hover:border-primary/20 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">visibility</span>
          View Resume
        </span>
      </button>

      <button
        onClick={onParse}
        disabled={parsing}
        className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-[11px] font-medium text-accent hover:bg-accent/20 transition-colors disabled:opacity-60"
      >
        <span className="flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-[14px] ${parsing ? 'animate-spin' : ''}`}>
            {parsing ? 'sync' : 'auto_awesome'}
          </span>
          {parsing ? 'Parsing...' : 'Parse with AI'}
        </span>
      </button>

      <button
        onClick={onReplace}
        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border text-[11px] font-medium text-text-secondary hover:text-text hover:border-primary/20 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          Replace
        </span>
      </button>

      <button
        onClick={onDelete}
        className="ml-auto px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] font-medium text-rose-400 hover:bg-rose-500/20 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">delete</span>
          Delete
        </span>
      </button>
    </div>
  )
}
