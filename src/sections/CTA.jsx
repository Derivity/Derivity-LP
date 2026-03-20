import { motion } from 'framer-motion'
import ParticleNetwork from '../components/ParticleNetwork'
import PremiumTryButton from '../components/PremiumTryButton'

export default function CTA({ onNavigate }) {
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

        {/* How we work - meaningful content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 pt-12 border-t border-white/[0.08]"
        >
          <h3 className="text-xl font-semibold text-gray-300 mb-8">How We Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-First Analysis',
                description: 'Institutional-grade financial AI that learns from market patterns, macroeconomic data, and your personal financial goals.',
              },
              {
                title: 'Personalized Insights',
                description: 'Get actionable recommendations tailored to your risk tolerance, investment timeline, and financial objectives.',
              },
              {
                title: 'Continuous Learning',
                description: 'Our AI evolves with market conditions, adapting strategies and providing real-time portfolio optimization.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                className="flex flex-col items-start text-left p-6 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(139,92,246,0.15)',
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <span className="text-lg font-bold text-violet-400">{i + 1}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
