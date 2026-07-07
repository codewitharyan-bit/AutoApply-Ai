import { motion } from 'framer-motion'

const steps = [
  { number: '01', title: 'Upload Resume', description: 'Upload your resume and our AI analyzes your skills, experience, and career profile.' },
  { number: '02', title: 'Browse Jobs', description: 'Browse jobs from multiple platforms or use our Chrome extension on any job board.' },
  { number: '03', title: 'Get AI Match Analysis', description: 'Get instant match scores, missing skills, and personalized improvement suggestions.' },
  { number: '04', title: 'Apply and Track', description: 'Generate tailored applications and track every submission from one dashboard.' },
]

const spring = { type: 'spring', stiffness: 200, damping: 22 }

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={spring}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl font-bold text-[#FAFAFA] md:text-4xl">How It Works</h2>
        <p className="mt-4 text-[#A1A1AA]">Four simple steps to smarter job applications.</p>
      </motion.div>

      <div className="relative grid gap-8 md:grid-cols-4">
        <div className="absolute top-12 left-0 right-0 hidden h-px bg-gradient-to-r from-primary/0 via-primary/30 to-accent/0 md:block" />

        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: i * 0.12 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#09090B] text-lg font-bold text-primary shadow-lg shadow-primary/5">
              {step.number}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#FAFAFA]">{step.title}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-[#A1A1AA]">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
