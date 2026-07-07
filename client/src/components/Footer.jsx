export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
              A
            </div>
            <span className="text-lg font-semibold text-[#FAFAFA]">AutoApply AI</span>
          </div>

          <div className="flex gap-6">
            <a href="#features" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]">Features</a>
            <a href="#how-it-works" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]">How It Works</a>
            <a href="#pricing" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]">Pricing</a>
            <a href="#testimonials" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]">Testimonials</a>
          </div>

          <div className="flex gap-4">
            {['X', 'GH', 'LI', 'DI'].map((social) => (
              <a
                key={social}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-xs text-[#A1A1AA] transition-all hover:border-primary/30 hover:text-[#FAFAFA]"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#A1A1AA]">
          &copy; {new Date().getFullYear()} AutoApply AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
