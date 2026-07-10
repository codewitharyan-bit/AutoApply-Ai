const STEPS = [
  { key: 'preferences', label: 'Preferences', icon: 'tune' },
  { key: 'matching', label: 'Matching', icon: 'travel_explore' },
  { key: 'queue', label: 'Queue', icon: 'queue' },
  { key: 'submit', label: 'Submit', icon: 'rocket_launch' },
]

function getStepState(engine) {
  const status = engine?.status || 'offline'
  if (status === 'offline') return { prefs: 'idle', match: 'idle', queue: 'idle', submit: 'idle' }
  if (status === 'running') return { prefs: 'done', match: 'done', queue: 'active', submit: 'idle' }
  if (status === 'paused') return { prefs: 'done', match: 'done', queue: 'paused', submit: 'idle' }
  return { prefs: 'done', match: 'done', queue: 'done', submit: 'done' }
}

const stateStyles = {
  done: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    icon: 'check_circle',
    line: 'bg-emerald-400/40',
  },
  active: {
    dot: 'bg-amber-400 animate-pulse',
    text: 'text-amber-400',
    icon: 'hourglass_top',
    line: 'bg-amber-400/40',
  },
  paused: {
    dot: 'bg-amber-400/60',
    text: 'text-amber-400/60',
    icon: 'pause_circle',
    line: 'bg-amber-400/20',
  },
  idle: {
    dot: 'bg-white/[0.08]',
    text: 'text-text-secondary/40',
    icon: 'radio_button_unchecked',
    line: 'bg-white/[0.06]',
  },
}

export default function AutomationLifecycle({ engine }) {
  const states = getStepState(engine)

  const stepKeys = ['preferences', 'matching', 'queue', 'submit']

  return (
    <div className="bg-[#0A0A0F] border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const s = states[step.key]
          const style = stateStyles[s] || stateStyles.idle
          const isLast = i === STEPS.length - 1
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full ${style.dot} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-sm ${s === 'done' ? 'text-white' : style.text}`}>
                    {style.icon}
                  </span>
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${style.text}`}>{step.label}</span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-px mx-2 ${style.line}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
