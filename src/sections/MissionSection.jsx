import { motion } from 'framer-motion'

export default function MissionSection() {
  return (
    <section className="relative bg-black py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37,99,235,0.10) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(32px,5vw,64px)] font-black tracking-[-0.03em] mb-6">
            What is <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Derivity</span>?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A financial intelligence platform built for everyone. We're reimagining how people manage wealth through AI-powered insights.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Financial Democracy',
              description: 'Making institutional-grade financial intelligence accessible to everyone, not just the wealthy.',
              icon: '◆',
            },
            {
              title: 'Human-AI Partnership',
              description: 'Our AI augments your decision-making with data-driven insights, but you remain in control.',
              icon: '◇',
            },
            {
              title: 'Continuous Evolution',
              description: 'We learn from market dynamics and your feedback to improve recommendations over time.',
              icon: '◈',
            },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(139,92,246,0.18)',
              }}
            >
              <div className="text-4xl mb-4 text-violet-400">{pillar.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Derivity matters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-gradient-to-r from-violet-600/5 via-blue-600/5 to-cyan-600/5 border border-white/[0.08] rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Why Derivity Matters</h3>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Most people don't have access to personalized financial advice. Banks make money by keeping investments complex. Robo-advisors lack human nuance.
            </p>
            <p>
              Derivity is different. We use AI to democratize financial intelligence — analyzing your situation, market conditions, and goals to provide truly personalized guidance.
            </p>
            <p>
              Whether you're saving for retirement, building wealth, or managing risk — Derivity helps you make smarter financial decisions with confidence.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
