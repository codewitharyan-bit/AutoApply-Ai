import { useState } from 'react'

export default function TagInput({ label, description, tags = [], onChange, placeholder = 'Type and press Enter', disabled = false }) {
  const [input, setInput] = useState('')

  const addTag = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (tags.includes(trimmed)) return
    onChange([...tags, trimmed])
  }

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
      setInput('')
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="py-3">
      <div className="mb-2">
        <p className="text-sm font-semibold text-text">{label}</p>
        {description && <p className="text-xs text-text-secondary/70 mt-0.5">{description}</p>}
      </div>
      <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-white/[0.02] border border-border min-h-[40px] focus-within:border-primary/40 transition-colors">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {tag}
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeTag(i)}
              className="w-3.5 h-3.5 rounded-full hover:bg-primary/20 flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[10px]">close</span>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input) { addTag(input); setInput('') } }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-text placeholder-text-secondary/40 focus:outline-none disabled:opacity-50"
        />
      </div>
    </div>
  )
}
