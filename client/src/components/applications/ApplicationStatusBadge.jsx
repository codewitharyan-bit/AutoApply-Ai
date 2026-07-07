const statusColors = {
  saved: 'bg-white/[0.04] border-border text-text-secondary',
  applied: 'bg-primary/10 border-primary/20 text-primary',
  interview: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  offer: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  rejected: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  withdrawn: 'bg-white/[0.02] border-white/10 text-text-secondary/60',
}

export default function ApplicationStatusBadge({ status }) {
  const s = status || 'saved'
  return (
    <span className={`text-[10px] font-medium px-2 py-1 rounded-full border shrink-0 ${statusColors[s] || statusColors.saved}`}>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  )
}
