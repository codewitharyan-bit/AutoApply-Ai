import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const links = ['Features', 'How It Works', 'Pricing', 'Testimonials']

const spring = { type: 'spring', stiffness: 300, damping: 24 }

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[#09090B]/80 glass"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
            A
          </div>
          <span className="text-lg font-semibold text-[#FAFAFA]">AutoApply AI</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <SignedOut>
            <button
              onClick={() => navigate('/sign-in')}
              className="rounded-lg px-4 py-2 text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
            >
              Login
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/sign-up')}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              Get Started
            </motion.button>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-lg px-4 py-2 text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
            >
              Dashboard
            </button>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'h-8 w-8',
                  userButtonTrigger: 'focus:shadow-none',
                },
              }}
            />
          </SignedIn>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#FAFAFA] md:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="overflow-hidden border-t border-[rgba(255,255,255,0.08)] px-6 pb-4 md:hidden"
          >
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="block py-2 text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            ))}
            <SignedOut>
              <button
                onClick={() => { setMobileOpen(false); navigate('/sign-in') }}
                className="mt-2 block w-full rounded-lg px-4 py-2 text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
              >
                Login
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setMobileOpen(false); navigate('/sign-up') }}
                className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Get Started
              </motion.button>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => { setMobileOpen(false); navigate('/dashboard') }}
                className="mt-2 block w-full rounded-lg px-4 py-2 text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
              >
                Dashboard
              </button>
            </SignedIn>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
