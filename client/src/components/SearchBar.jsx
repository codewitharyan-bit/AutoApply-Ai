import { forwardRef, useCallback } from 'react'

const SearchBar = forwardRef(function SearchBar({ value, onChange, placeholder, loading, onClear, shortcut }, ref) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (value) {
        onClear?.()
      } else {
        ref?.current?.blur()
      }
    }
  }, [value, onClear, ref])

  return (
    <div className="relative mb-4">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-text-secondary/40 pointer-events-none">
        {loading ? 'sync' : 'search'}
      </span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
      />
      {loading && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-text-secondary/40 animate-spin">sync</span>
      )}
      {!loading && value && (
        <button
          onClick={() => onClear?.()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-text-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
      {!loading && !value && shortcut && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-border text-[10px] text-text-secondary/40 font-mono">{shortcut}</kbd>
        </div>
      )}
    </div>
  )
})

export default SearchBar
