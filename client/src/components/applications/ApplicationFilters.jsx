const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

export default function ApplicationFilters({ total, selectedStatus, onStatusChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text">Applications</h1>
        <span className="text-xs text-text-secondary bg-white/[0.04] px-2 py-0.5 rounded-full border border-border">
          {total} total
        </span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white/[0.04] border border-border rounded-lg px-3 py-1.5 text-sm text-text appearance-none cursor-pointer focus:outline-none focus:border-primary/40 transition-colors"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
