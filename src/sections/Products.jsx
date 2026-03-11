import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Bot, LayoutDashboard, TrendingUp, BarChart3 } from 'lucide-react'

const products = [
  {
    icon: Bot,
    label: 'Derivity AI',
    title: 'Derivity Financial AI',
    description:
      "Our proprietary financial AI — built entirely in-house on Derivity's own models. Ask anything about your finances, from tax strategy to retirement planning. Currently under development.",
    tag: 'Derivity AI — Coming Soon',
    isAI: true,
    iconBg: 'bg-violet-600/20',
    iconColor: 'text-violet-400',
    spotColor: 'rgba(124, 58, 237, 0.10)',
    glowColor: 'rgba(167, 139, 250, 0.7)',
    borderHover: 'rgba(139, 92, 246, 0.35)',
    shadowColor: '124, 58, 237',
  },
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    title: 'Unified Finance Dashboard',
    description:
      'All your accounts, investments, and transactions in one seamless intelligent view. Real-time sync across 12,000+ financial institutions globally.',
    tag: '12,000+ institutions',
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-400',
    spotColor: 'rgba(59, 130, 246, 0.09)',
    glowColor: 'rgba(96, 165, 250, 0.7)',
    borderHover: 'rgba(59, 130, 246, 0.30)',
    shadowColor: '59, 130, 246',
  },
  {
    icon: TrendingUp,
    label: 'Investing',
    title: 'Investment Intelligence',
    description:
      'AI-powered portfolio analysis and smart investment recommendations. Identify opportunities, manage risk, and optimize for your goals automatically.',
    tag: 'Alpha generation',
    iconBg: 'bg-cyan-600/20',
    iconColor: 'text-cyan-400',
    spotColor: 'rgba(6, 182, 212, 0.09)',
    glowColor: 'rgba(34, 211, 238, 0.7)',
    borderHover: 'rgba(6, 182, 212, 0.30)',
    shadowColor: '6, 182, 212',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    title: 'Real-time Analytics',
    description:
      'Deep financial insights with predictive analytics and market intelligence. Understand your spending, forecast your future, and act on data-driven signals.',
    tag: 'Predictive AI',
    iconBg: 'bg-purple-600/20',
    iconColor: 'text-purple-400',
    spotColor: 'rgba(168, 85, 247, 0.09)',
    glowColor: 'rgba(192, 132, 252, 0.7)',
    borderHover: 'rgba(168, 85, 247, 0.30)',
    shadowColor: '168, 85, 247',
  },
]

// ── Individual card with mouse-tracking spotlight ──────────────────
function ProductCard({ product, index }) {
  const cardRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 }
  const spotX = useSpring(rawX, springConfig)
  const spotY = useSpring(rawY, springConfig)

  const spotBg = useTransform([spotX, spotY], ([x, y]) =>
    `radial-gradient(380px circle at ${x}px ${y}px, ${product.spotColor}, transparent 65%)`
  )

  function onMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(e.clientX - rect.left)
    rawY.set(e.clientY - rect.top)
  }

  const Icon = product.icon

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 56, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.13,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] },
      }}
      className="group relative overflow-hidden rounded-[22px] cursor-default"
      style={{
        background: 'rgba(255,255,255,0.026)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      // Glow box-shadow on hover via Framer
    >
      {/* ── Mouse spotlight ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[22px]"
        style={{ background: spotBg }}
      />

      {/* ── Hover border glow (top shimmer line) ── */}
      <div
        className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-600 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${product.glowColor}, transparent)`,
          transition: 'opacity 0.55s ease',
        }}
      />

      {/* ── Hover border glow ring ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 0 1px ${product.borderHover}, 0 20px 60px rgba(${product.shadowColor}, 0.15), 0 0 120px rgba(${product.shadowColor}, 0.06)`,
          transition: 'opacity 0.45s ease',
        }}
      />

      {/* ── Card content ── */}
      <div className="relative z-10 p-9">
        {/* Icon + tag */}
        <div className="flex items-center justify-between mb-7">
          <div className={`w-12 h-12 rounded-xl ${product.iconBg} flex items-center justify-center
            group-hover:scale-110 transition-transform duration-500 ease-out`}>
            <Icon className={`w-5 h-5 ${product.iconColor}`} />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border ${
              product.isAI
                ? 'border-amber-500/30 text-amber-400/90 bg-amber-500/[0.07]'
                : 'border-white/[0.09] text-gray-500 bg-white/[0.03]'
            }`}
          >
            {product.tag}
          </span>
        </div>

        {/* Label */}
        <span className="text-[10.5px] font-semibold text-gray-600 tracking-[0.18em] uppercase mb-2.5 block">
          {product.label}
        </span>

        {/* Title */}
        <h3 className="text-[21px] font-bold text-white mb-3.5 leading-snug tracking-[-0.02em]">
          {product.title}
        </h3>

        {/* Under-dev notice */}
        {product.isAI && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg
            bg-amber-500/[0.06] border border-amber-500/[0.18]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="text-[11px] text-amber-300/75 font-medium leading-relaxed">
              Currently under development — Derivity's own proprietary finance AI
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-[14px] text-gray-500 leading-relaxed mb-7 group-hover:text-gray-400 transition-colors duration-400">
          {product.description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-gray-600 group-hover:text-white transition-colors duration-300">
          Explore
          <svg
            width="13" height="13" viewBox="0 0 13 13" fill="none"
            className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300"
          >
            <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ────────────────────────────────────────────────────────
export default function Products() {
  return (
    <section id="products" className="relative bg-black py-32 md:py-44 overflow-hidden">

      {/* ── Antigravity-style ambient side glows ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Left glow */}
        <motion.div
          className="absolute -left-[20%] top-1/2 -translate-y-1/2 w-[55%] h-[70%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.18) 0%, rgba(109,40,217,0.06) 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Right glow */}
        <motion.div
          className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[50%] h-[65%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.05) 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        />
        {/* Centre soft radial */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(91,33,182,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-label mb-6 inline-flex"
          >
            The Platform
          </motion.span>

          <div className="mt-5 mb-5">
            {['One unified platform for', 'every financial need'].map((line, li) => (
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
            From personal banking to enterprise treasury management — Derivity handles it all
            with the power of AI.
          </motion.p>
        </div>

        {/* ── Product cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.title} product={product} index={i} />
          ))}
        </div>

        {/* ── Marquee ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="mt-20 overflow-hidden border-y border-white/[0.05] py-4"
        >
          <div className="marquee-track gap-12">
            {[
              'Banking', 'Investing', 'Payments', 'Analytics', 'Insurance',
              'Tax Optimization', 'Portfolio Management', 'Crypto', 'Real Estate',
              'Retirement Planning', 'Banking', 'Investing', 'Payments', 'Analytics',
              'Insurance', 'Tax Optimization', 'Portfolio Management', 'Crypto',
              'Real Estate', 'Retirement Planning',
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-3 text-[11px] font-medium text-gray-700 uppercase tracking-widest whitespace-nowrap">
                <span className="w-1 h-1 rounded-full bg-violet-800 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
