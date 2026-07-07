import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 1 }}
        className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-primary/10 via-[#09090B] to-accent/10 p-12 text-center md:p-20"
      >
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />

        <h2 className="relative text-3xl font-bold text-[#FAFAFA] md:text-5xl">
          Your Next Job Shouldn't Depend on Spreadsheets.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[#A1A1AA]">
          Join thousands of job seekers who have transformed their job search with AI-powered automation.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.95 }}
          className="relative mt-8 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-colors duration-200 hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
        >
          Start Free Today
        </motion.button>
      </motion.div>
    </section>
  )
}
