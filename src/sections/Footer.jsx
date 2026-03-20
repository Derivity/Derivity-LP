import { motion } from 'framer-motion'
import PremiumTryButton from '../components/PremiumTryButton'

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/[0.055]">
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center gap-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Wordmark */}
          <img src="/logo.svg" alt="Derivity logo" className="w-20 h-10 object-contain" />
          <span className="text-[11px] font-semibold tracking-[0.35em] uppercase" style={{ color: 'rgba(245,245,245,0.45)' }}>
            Derivity
          </span>

          {/* Only real link */}
          <PremiumTryButton label="Try Derivity AI" className="!text-[13px] !px-6 !py-[11px]" />
        </motion.div>

        <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />

        <p className="text-[11px] text-gray-700">
          © 2026 Derivity. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
