import { SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24, mass: 1 } },
}

const icon = (
  <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

function FloatingCard({ children, index, floatDelay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: [0, -3, 0],
        scale: 1,
      }}
      transition={{
        opacity: { type: 'spring', stiffness: 280, damping: 24, delay: 0.8 + index * 0.12 },
        scale: { type: 'spring', stiffness: 280, damping: 24, delay: 0.8 + index * 0.12 },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
      }}
      className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] p-2 backdrop-blur-sm will-change-transform"
    >
      {children}
    </motion.div>
  )
}

export default function SignInPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#09090B]">
      {/* Fixed background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute left-1/3 top-1/3 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative flex h-full flex-col md:flex-row">
        {/* Brand panel - 50% */}
        <div className="flex items-center justify-center md:h-full md:w-1/2 px-6 py-4 md:py-0 md:px-8">
          <div className="w-full max-w-[520px]">
            <motion.div variants={stagger} initial="hidden" animate="show">
              {/* Logo */}
              <motion.div variants={fadeUp} className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-lg shadow-primary/25">
                  A
                </div>
                <span className="text-sm font-semibold text-[#FAFAFA]">AutoApply AI</span>
              </motion.div>

              {/* Badge */}
              <motion.div variants={fadeUp}>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-2.5 py-0.5 text-[9px] text-[#A1A1AA]">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-400" />
                  AI-Powered Job Application Platform
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} className="text-2xl font-bold leading-tight text-[#FAFAFA] md:text-[28px] md:leading-[1.15]">
                Land More Interviews{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  With AI
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p variants={fadeUp} className="mt-1 max-w-md text-xs leading-relaxed text-[#A1A1AA]">
                Analyze job descriptions, identify skill gaps, and generate tailored applications — all from one intelligent dashboard.
              </motion.p>

              {/* Stats */}
              <motion.div variants={fadeUp} className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#FAFAFA]">10,000+</span>
                  <span className="text-[10px] text-[#A1A1AA]">Applications Analyzed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#FAFAFA]">85%</span>
                  <span className="text-[10px] text-[#A1A1AA]">Match Accuracy</span>
                </div>
              </motion.div>

              {/* Floating cards */}
              <motion.div variants={fadeUp} className="mt-3 grid gap-1.5 sm:grid-cols-2">
                <FloatingCard index={0} floatDelay={0}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#A1A1AA]">Resume Match Score</span>
                    <span className="text-sm font-bold text-green-400">87%</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-[9px] text-[#A1A1AA]">
                    <div className="flex items-center gap-1 text-green-400">{icon} React</div>
                    <div className="flex items-center gap-1 text-green-400">{icon} Node.js</div>
                  </div>
                  <div className="mt-1 flex gap-1">
                    <span className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-1.5 py-0.5 text-[8px] text-[#FAFAFA]">Docker</span>
                    <span className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-1.5 py-0.5 text-[8px] text-[#FAFAFA]">AWS</span>
                  </div>
                </FloatingCard>

                <FloatingCard index={1} floatDelay={1.5}>
                  <div className="text-[9px] text-[#A1A1AA]">Today's Matches</div>
                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#FAFAFA]">24</span>
                    <span className="text-[9px] text-[#A1A1AA]">New Jobs</span>
                  </div>
                  <div className="mt-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-white/[0.02] px-1.5 py-0.5">
                    <div className="text-[8px] text-[#A1A1AA]">Best Match:</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#FAFAFA]">Senior Frontend</span>
                      <span className="text-[9px] font-semibold text-green-400">92%</span>
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard index={2} floatDelay={3}>
                  <div className="flex items-start gap-1.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-primary/20 text-[7px] text-primary">AI</div>
                    <div>
                      <div className="text-[9px] text-[#A1A1AA]">AI Suggestion</div>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-[#FAFAFA]">
                        "Add Docker experience to improve match score by 12%."
                      </p>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Auth panel - 50% */}
        <div className="flex items-center justify-center md:h-full md:w-1/2 px-6 py-4 md:py-0 md:px-8">
          <div className="w-full max-w-[460px]">
            {/* Mobile header */}
            <div className="mb-4 text-center md:hidden">
              <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-lg shadow-primary/25">
                A
              </div>
              <h1 className="text-base font-bold text-[#FAFAFA]">Welcome back</h1>
              <p className="mt-0.5 text-[10px] text-[#A1A1AA]">Sign in to AutoApply AI</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.15 }}
            >
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/[0.03] p-5 backdrop-blur-sm">
                {/* Desktop header */}
                <div className="mb-3 hidden md:block">
                  <h2 className="text-lg font-bold text-[#FAFAFA]">Welcome back</h2>
                  <p className="mt-0.5 text-xs text-[#A1A1AA]">Sign in to continue to your dashboard</p>
                </div>

                <SignIn
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'bg-transparent shadow-none p-0',
                      header: 'hidden',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton:
                        'flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#09090B] px-3 py-1.5 text-xs font-medium text-[#FAFAFA] transition-all duration-200 hover:bg-[#12121A] hover:border-[rgba(255,255,255,0.2)] hover:shadow-[0_0_12px_rgba(99,102,241,0.08)]',
                      socialButtonsBlockButtonText: 'text-[#FAFAFA] text-xs font-medium',
                      socialButtonsBlockButtonArrow: 'text-[#A1A1AA]',
                      dividerLine: 'bg-[rgba(255,255,255,0.08)]',
                      dividerText: 'text-[#52525B] text-[10px] font-medium',
                      formFieldLabel: 'block text-xs font-medium text-[#A1A1AA] mb-0.5',
                      formFieldInput:
                        'w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#09090B] px-3 py-1.5 text-xs text-[#FAFAFA] placeholder-[#52525B] transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none focus:shadow-[0_0_10px_rgba(99,102,241,0.1)]',
                      formFieldInputShowPasswordButton: 'text-[#A1A1AA] hover:text-[#FAFAFA]',
                      formButtonPrimary:
                        'w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-[0.98]',
                      formFieldErrorText: 'text-red-400 text-xs mt-0.5',
                      footerAction: 'mt-2 flex items-center justify-center gap-1 text-xs',
                      footerActionText: 'text-xs text-[#A1A1AA]',
                      footerActionLink: 'text-xs font-medium text-primary transition-colors duration-200 hover:text-primary/80 hover:underline',
                      identityPreviewText: 'text-[#FAFAFA] text-xs',
                      identityPreviewEditButton: 'text-primary text-xs font-medium hover:text-primary/80',
                      otpCodeFieldInput:
                        'border border-[rgba(255,255,255,0.12)] bg-[#09090B] text-[#FAFAFA] rounded-lg w-full h-8 text-center text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none',
                      alternativeMethodsBlockButton:
                        'text-[#A1A1AA] text-xs border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-1 hover:bg-[#12121A] hover:text-[#FAFAFA] transition-all duration-200',
                      backLink: 'text-[#A1A1AA] text-xs hover:text-[#FAFAFA] transition-colors duration-200',
                      formFieldAction: 'text-primary text-[10px] font-medium hover:text-primary/80',
                      formHeaderTitle: 'text-[#FAFAFA] text-base font-semibold',
                      formHeaderSubtitle: 'text-[#A1A1AA] text-xs',
                      socialButtonsProviderIcon: 'h-4 w-4',
                      alert: 'rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400',
                      alertText: 'text-xs text-red-400',
                      alertIcon: 'text-red-400',
                      formResendCodeLink: 'text-primary text-xs font-medium hover:text-primary/80',
                    },
                  }}
                />

                <p className="mt-3 text-center text-[9px] text-[#52525B]">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-[#A1A1AA] underline underline-offset-2 hover:text-[#FAFAFA] transition-colors duration-200">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#A1A1AA] underline underline-offset-2 hover:text-[#FAFAFA] transition-colors duration-200">Privacy Policy</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
