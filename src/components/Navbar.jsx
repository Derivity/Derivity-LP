import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Platform', href: '#products' },
  { label: 'AI Engine', href: '#ai-engine' },
  { label: 'Features', href: '#features' },
]

// Threshold (px) before the bar slides in
const SHOW_AT = 60

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [bgOpacity, setBgOpacity] = useState(0)
  const [borderOpacity, setBorderOpacity] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y > SHOW_AT)
      // Apple-style progressive blur over the next 120px after SHOW_AT
      const progress = Math.min(Math.max(y - SHOW_AT, 0) / 120, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setBlurAmount(eased * 28)
      setBgOpacity(eased * 0.78)
      setBorderOpacity(eased * 0.07)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            key="navbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
            style={{
              backdropFilter: `blur(${blurAmount}px) saturate(${1 + blurAmount * 0.01})`,
              WebkitBackdropFilter: `blur(${blurAmount}px) saturate(${1 + blurAmount * 0.01})`,
              backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
              borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
              boxShadow: '0 1px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-[13.5px] text-gray-400 hover:text-white transition-colors duration-200 font-medium rounded-lg hover:bg-white/[0.04]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Single CTA */}
              <div className="hidden md:flex items-center">
                <a
                  href="/chat.html"
                  className="btn-primary !py-2.5 !px-5 !text-[13.5px] !rounded-lg"
                >
                  Try Derivity
                </a>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] text-gray-300"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && visible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[64px] left-0 right-0 z-40 bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-4"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block py-3.5 text-[15px] text-gray-300 hover:text-white transition-colors font-medium border-b border-white/[0.045] last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <div className="pt-4">
              <a href="/chat.html" className="btn-primary !w-full !text-center" onClick={() => setMenuOpen(false)}>
                Try Derivity
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
