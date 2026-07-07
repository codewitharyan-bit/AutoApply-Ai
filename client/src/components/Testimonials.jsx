import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Software Engineer',
    text: 'AutoApply AI saved me hours of manual applications. The match score helped me focus on jobs where I had the best chance of landing an interview.',
    initials: 'AC',
  },
  {
    name: 'Sarah Miller',
    role: 'Product Manager',
    text: 'The cover letter generator is incredible. It captures my voice and tailors each letter perfectly. Landed my dream job in two weeks.',
    initials: 'SM',
  },
  {
    name: 'James Wilson',
    role: 'Recent Graduate',
    text: 'As a new grad, I was overwhelmed by the job search. AutoApply AI helped me organize my applications and the AI matching was spot on.',
    initials: 'JW',
  },
]

const spring = { type: 'spring', stiffness: 200, damping: 22 }

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={spring}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl font-bold text-[#FAFAFA] md:text-4xl">Loved by job seekers</h2>
        <p className="mt-4 text-[#A1A1AA]">Hear from people who landed their dream jobs with AutoApply AI.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: i * 0.12 }}
            whileHover={{ y: -5, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.03] p-6 backdrop-blur-sm will-change-transform hover:border-primary/20"
          >
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, j) => (
                <svg key={j} className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-6 text-sm leading-relaxed text-[#A1A1AA]">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-medium text-[#FAFAFA]">{t.name}</div>
                <div className="text-xs text-[#A1A1AA]">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
