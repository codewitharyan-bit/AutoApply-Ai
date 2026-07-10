export default function SettingsCard({ title, description, children, className = '' }) {
  return (
    <div className={`bg-[#0A0A0F] border border-border rounded-xl p-5 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-text">{title}</h2>
          {description && <p className="text-xs text-text-secondary/70 mt-0.5">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
