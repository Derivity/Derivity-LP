import { motion } from 'framer-motion'
import ParticleNetwork from '../components/ParticleNetwork'
import PremiumTryButton from '../components/PremiumTryButton'

export default function CTA() {
  return (
    <section id="cta" className="relative bg-black py-32 md:py-44 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(100,30,180,0.28) 0%, rgba(40,80,200,0.12) 50%, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 animated-gradient-bg opacity-50" />
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-60" />
        {/* Edge fades */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <ParticleNetwork opacity={0.3} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(36px,6vw,80px)] font-black tracking-[-0.03em] leading-[1.04] mb-6"
        >
          Build the Future of{' '}
          <span className="gradient-text">Financial Intelligence</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[clamp(15px,1.8vw,18px)] text-gray-400 max-w-xl mx-auto leading-relaxed mb-10"
        >
          Derivity is being built for the next generation of financial intelligence.
          Get in touch to learn more.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <PremiumTryButton className="!text-[15px] !py-[15px] !px-8" />
          <motion.a
            href="mailto:hello@derivity.ai"
            className="btn-secondary !text-[15px] !py-[15px] !px-8"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Contact Us
          </motion.a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-[12px] text-gray-600"
        >
          {[
            '🔒 Bank-grade security',
            '✦ No credit card required',
            '⚡ Instant setup',
            '◈ Cancel anytime',
          ].map((item) => (
            <span key={item} className="font-medium">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
