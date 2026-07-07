import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with basic job tracking.',
    features: ['Up to 5 job applications tracked', 'Basic match score analysis', 'Email support'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For serious job seekers who want to maximize their chances.',
    features: [
      'Unlimited job applications',
      'Advanced AI match scoring',
      'Cover letter generation',
      'Chrome extension access',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    description: 'For career coaches and teams managing multiple job searches.',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom AI training',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const spring = { type: 'spring', stiffness: 200, damping: 22 }

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={spring}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl font-bold text-[#FAFAFA] md:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-[#A1A1AA]">
          Choose the plan that fits your job search needs.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: i * 0.1 }}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            className={`relative rounded-xl border p-8 backdrop-blur-sm will-change-transform ${
              plan.popular
                ? 'border-primary/40 bg-primary/[0.04] shadow-[0_0_40px_rgba(99,102,241,0.1)]'
                : 'border-[rgba(255,255,255,0.08)] bg-white/[0.03] hover:border-primary/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-white">
                Most Popular
              </div>
            )}

            <h3 className="text-lg font-semibold text-[#FAFAFA]">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#FAFAFA]">{plan.price}</span>
              <span className="text-sm text-[#A1A1AA]">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-[#A1A1AA]">{plan.description}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`mt-8 w-full rounded-lg py-3 text-sm font-medium transition-colors duration-200 ${
                plan.popular
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]'
                  : 'border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] hover:bg-white/[0.04]'
              }`}
            >
              {plan.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
