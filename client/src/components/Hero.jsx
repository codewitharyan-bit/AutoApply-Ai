import { motion } from 'framer-motion'
import DashboardMockup from './DashboardMockup'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20, mass: 1 } },
}

export default function Hero() {
  return (
    <section className="relative mx-auto mt-20 flex max-w-7xl flex-col items-center gap-8 overflow-hidden px-6 py-10 md:flex-row md:py-16 md:min-h-[calc(100vh-80px)]">
      <div className="pointer-events-none absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />

      <div className="flex-1">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-3.5 py-1 text-xs text-[#A1A1AA]">
              <span className="flex h-2 w-2 rounded-full bg-green-400" />
              AI-Powered Job Application Platform
            </div>
          </motion.div>

          <motion.h1 variants={item} className="mt-4 text-4xl font-bold leading-tight text-[#FAFAFA] md:text-5xl md:leading-[1.15]">
            Land More Interviews{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Without Wasting Hours Applying
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-3 max-w-lg text-base leading-relaxed text-[#A1A1AA]">
            Analyze job descriptions, identify skill gaps, generate tailored applications, and track every opportunity from one intelligent dashboard.
          </motion.p>

          <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-colors duration-200 hover:bg-white/[0.04]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div variants={item} className="mt-5 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#FAFAFA]">10,000+</span>
              <span className="text-sm text-[#A1A1AA]">Applications Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#FAFAFA]">85%</span>
              <span className="text-sm text-[#A1A1AA]">Match Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#FAFAFA]">24/7</span>
              <span className="text-sm text-[#A1A1AA]">AI Assistance</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex-1">
        <DashboardMockup />
      </div>
    </section>
  )
}
