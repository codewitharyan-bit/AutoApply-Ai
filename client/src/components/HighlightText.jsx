export default function HighlightText({ text, query, className = '' }) {
  if (!query?.trim() || !text) return <span className={className}>{text}</span>

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark>
          : part
      )}
    </span>
  )
}
