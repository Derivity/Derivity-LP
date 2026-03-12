import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MessageSquare, PieChart, Receipt, Newspaper, Code2 } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Financial Assistant',
    description:
      'Conversational AI that answers complex financial questions instantly. From "how much can I invest this month?" to deep tax strategy — always on, always intelligent.',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    spotColor: 'rgba(139, 92, 246, 0.10)',
    glowColor: 'rgba(167, 139, 250, 0.75)',
    borderHover: 'rgba(139, 92, 246, 0.32)',
    shadowColor: '139, 92, 246',
    span: 'md:col-span-2',
  },
  {
    icon: PieChart,
    title: 'Smart Portfolio Insights',
    description:
      'Real-time analysis of your investment performance, risk exposure, and diversification. AI recommendations to optimize for your time horizon and goals.',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    spotColor: 'rgba(59, 130, 246, 0.09)',
    glowColor: 'rgba(96, 165, 250, 0.75)',
    borderHover: 'rgba(59, 130, 246, 0.30)',
    shadowColor: '59, 130, 246',
    span: '',
  },
  {
    icon: Receipt,
    title: 'Automated Finance Tracking',
    description:
      'Intelligent categorization and deep analysis of every transaction. Spot trends, catch anomalies, and forecast your financial future automatically.',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    spotColor: 'rgba(6, 182, 212, 0.09)',
    glowColor: 'rgba(34, 211, 238, 0.75)',
    borderHover: 'rgba(6, 182, 212, 0.30)',
    shadowColor: '6, 182, 212',
    span: '',
  },
  {
    icon: Newspaper,
    title: 'Market Intelligence',
    description:
      'Stay ahead with AI-powered market analysis, earnings summaries, and personalized alerts. Curated for your portfolio, not the masses.',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    spotColor: 'rgba(168, 85, 247, 0.09)',
    glowColor: 'rgba(192, 132, 252, 0.75)',
    borderHover: 'rgba(168, 85, 247, 0.30)',
    shadowColor: '168, 85, 247',
    span: '',
  },
  {
    icon: Code2,
    title: 'Enterprise APIs',
    description:
      'Build next-generation financial products with our comprehensive API suite. Payment rails, account aggregation, AI models, and compliance — all as a service.',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    spotColor: 'rgba(99, 102, 241, 0.09)',
    glowColor: 'rgba(129, 140, 248, 0.75)',
    borderHover: 'rgba(99, 102, 241, 0.30)',
    shadowColor: '99, 102, 241',
    span: '',
  },
]

// ── Individual card with mouse-tracking spotlight ──────────────────
function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 }
  const spotX = useSpring(rawX, springConfig)
  const spotY = useSpring(rawY, springConfig)

  const spotBg = useTransform([spotX, spotY], ([x, y]) =>
    `radial-gradient(360px circle at ${x}px ${y}px, ${feature.spotColor}, transparent 65%)`
  )

  function onMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(e.clientX - rect.left)
    rawY.set(e.clientY - rect.top)
  }

  const Icon = feature.icon

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 56, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.11,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] },
      }}
      className={`group relative overflow-hidden rounded-[22px] cursor-default ${feature.span}`}
      style={{
        background: 'rgba(255,255,255,0.026)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Mouse spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[22px]"
        style={{ background: spotBg }}
      />

      {/* Top shimmer edge */}
      <div
        className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-px opacity-0 group-hover:opacity-100 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.glowColor}, transparent)`,
          transition: 'opacity 0.55s ease',
        }}
      />

      {/* Hover border glow ring */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 0 1px ${feature.borderHover}, 0 20px 60px rgba(${feature.shadowColor}, 0.14), 0 0 120px rgba(${feature.shadowColor}, 0.055)`,
          transition: 'opacity 0.45s ease',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-9">
        <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6
          group-hover:scale-110 transition-transform duration-500 ease-out`}>
          <Icon className={`w-5 h-5 ${feature.iconColor}`} />
        </div>
        <h3 className="text-[18px] font-bold text-white mb-3 tracking-[-0.02em] leading-snug">
          {feature.title}
        </h3>
        <p className="text-[14px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors duration-400">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

// ── Section ────────────────────────────────────────────────────────
export default function Features() {
  return (
    <section id="features" className="relative bg-black py-32 md:py-44 overflow-hidden">

      {/* Antigravity-style ambient side glows */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -right-[18%] top-1/2 -translate-y-1/2 w-[52%] h-[70%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.17) 0%, rgba(37,99,235,0.05) 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
          animate={{ scale: [1, 1.07, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-[18%] top-1/2 -translate-y-1/2 w-[48%] h-[65%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.16) 0%, rgba(109,40,217,0.05) 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
          animate={{ scale: [1, 1.09, 1], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(55,14,100,0.07) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-label mb-6 inline-flex"
          >
            Capabilities
          </motion.span>

          <div className="mt-5 mb-5">
            {['Every tool you need,', 'already built'].map((line, li) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.1 + li * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`block text-[clamp(34px,5.5vw,68px)] font-black tracking-[-0.03em] leading-[1.08]
                  ${li === 1 ? 'gradient-text' : 'text-white'}`}
              >
                {line}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
            className="text-[clamp(14px,1.6vw,17px)] text-gray-500 max-w-lg mx-auto leading-relaxed"
          >
            Derivity ships with a complete suite of financial intelligence tools —
            no integrations required.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 glass rounded-2xl p-8 flex flex-col md:flex-row items-center justify-center gap-4 text-center"
        >
          <p className="text-[13px] text-gray-500 uppercase tracking-widest font-medium">
            Trusted by
          </p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-[15px] font-bold text-white tracking-wide"
          >
            One Fourth Finance
          </motion.span>
        </motion.div>

      </div>
    </section>
  )
}
