import { motion } from 'framer-motion'

const cardData = [
  {
    content: (
      <>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#A1A1AA]">Resume Match Score</span>
          <span className="text-lg font-bold text-green-400">87%</span>
        </div>
        <div className="space-y-0.5 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-1 text-green-400">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            React
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Node.js
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            MongoDB
          </div>
        </div>
        <div className="mt-1.5 text-xs text-[#A1A1AA]">Missing:</div>
        <div className="mt-1 flex gap-2">
          <span className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-2 py-0.5 text-xs text-[#FAFAFA]">Docker</span>
          <span className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-2 py-0.5 text-xs text-[#FAFAFA]">AWS</span>
        </div>
      </>
    ),
    floatDelay: 0,
  },
  {
    content: (
      <>
        <div className="mb-1.5 text-xs text-[#A1A1AA]">Application Status</div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-[10px] font-bold text-primary">G</div>
          <div>
            <div className="text-sm font-medium text-[#FAFAFA]">Software Engineer</div>
            <div className="text-xs text-[#A1A1AA]">Google</div>
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-green-400">Applied</span>
          <span className="text-xs text-[#A1A1AA]">2 Hours Ago</span>
        </div>
      </>
    ),
    floatDelay: 1.3,
  },
  {
    content: (
      <>
        <div className="text-xs text-[#A1A1AA]">Today's Matches</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#FAFAFA]">24</span>
          <span className="text-xs text-[#A1A1AA]">New Jobs Found</span>
        </div>
        <div className="mt-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-white/[0.02] px-2 py-1.5">
          <div className="text-xs text-[#A1A1AA]">Best Match:</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#FAFAFA]">Backend Developer</span>
            <span className="text-xs font-semibold text-green-400">92% Match</span>
          </div>
        </div>
      </>
    ),
    floatDelay: 2.6,
  },
  {
    content: (
      <>
        <div className="mb-2 text-xs text-[#A1A1AA]">AI Suggestion</div>
        <div className="flex items-start gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">AI</div>
          <p className="text-xs leading-relaxed text-[#FAFAFA]">
            "Add Docker experience to improve compatibility by 12%."
          </p>
        </div>
      </>
    ),
    floatDelay: 3.9,
  },
]

function FloatingCard({ children, index, floatDelay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: [0, -6, 0],
        scale: 1,
      }}
      transition={{
        opacity: { type: 'spring', stiffness: 200, damping: 20, delay: 0.8 + index * 0.15 },
        scale: { type: 'spring', stiffness: 200, damping: 20, delay: 0.8 + index * 0.15 },
        y: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatDelay,
        },
      }}
      className="mb-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] p-3 backdrop-blur-sm will-change-transform last:mb-0"
    >
      {children}
    </motion.div>
  )
}

export default function DashboardMockup() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/25 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-blue-500/15 blur-[60px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 18, mass: 1, delay: 0.4 }}
        className="relative w-[300px] md:w-[360px]"
      >
        <div className="absolute inset-0 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#09090B]/60 backdrop-blur-xl shadow-2xl shadow-primary/10" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        <div className="relative flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-[#A1A1AA]">Dashboard</span>
          </div>

          {cardData.map((card, i) => (
            <FloatingCard key={i} index={i} floatDelay={card.floatDelay}>
              {card.content}
            </FloatingCard>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
