export default function NumberSetting({ label, description, value, min = 1, max = 100, onChange, disabled = false }) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1)
  }
  const handleIncrement = () => {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        {description && <p className="text-xs text-text-secondary/70 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={handleDecrement}
          className="w-8 h-8 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm text-text-secondary">remove</span>
        </button>
        <span className="w-10 text-center text-sm font-bold text-text tabular-nums">{value}</span>
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={handleIncrement}
          className="w-8 h-8 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm text-text-secondary">add</span>
        </button>
      </div>
    </div>
  )
}
