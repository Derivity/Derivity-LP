import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const layers = [
  {
    name: 'User Interface',
    desc: 'Intuitive cross-platform experience',
    color: 'from-violet-600 to-violet-500',
    glow: 'shadow-violet-600/30',
    border: 'border-violet-500/30',
    bg: 'bg-violet-600/[0.07]',
    dotColor: '#a78bfa',
    width: '100%',
  },
  {
    name: 'Derivity AI Layer',
    desc: 'Proprietary financial AI — currently under development',
    color: 'from-purple-600 to-violet-500',
    glow: 'shadow-purple-600/25',
    border: 'border-purple-500/30',
    bg: 'bg-purple-600/[0.07]',
    dotColor: '#c084fc',
    width: '91%',
  },
  {
    name: 'Financial Data Engine',
    desc: 'Processing billions of transactions in real-time',
    color: 'from-indigo-600 to-blue-500',
    glow: 'shadow-indigo-600/25',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-600/[0.07]',
    dotColor: '#818cf8',
    width: '82%',
  },
  {
    name: 'Knowledge Graph',
    desc: 'Connected financial relationships & context',
    color: 'from-blue-600 to-blue-500',
    glow: 'shadow-blue-600/25',
    border: 'border-blue-500/30',
    bg: 'bg-blue-600/[0.07]',
    dotColor: '#60a5fa',
    width: '73%',
  },
  {
    name: 'Compliance Layer',
    desc: 'Regulatory, security & privacy enforcement',
    color: 'from-sky-600 to-blue-500',
    glow: 'shadow-sky-600/25',
    border: 'border-sky-500/30',
    bg: 'bg-sky-600/[0.07]',
    dotColor: '#38bdf8',
    width: '64%',
  },
  {
    name: 'Financial APIs',
    desc: 'Connecting the global financial ecosystem',
    color: 'from-cyan-600 to-cyan-400',
    glow: 'shadow-cyan-600/25',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-600/[0.07]',
    dotColor: '#22d3ee',
    width: '55%',
  },
]

export default function AIEngine() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <section
      id="ai-engine"
      ref={sectionRef}
      className="relative bg-black py-32 md:py-44 overflow-hidden"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(55,14,100,0.25) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 grid-bg opacity-50" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label mb-6 inline-flex">Architecture</span>
            <h2 className="text-[clamp(34px,4.5vw,60px)] font-black tracking-[-0.03em] leading-[1.06] mt-5 mb-6">
              The Derivity{' '}
              <span className="gradient-text">Intelligence Engine</span>
            </h2>
            <p className="text-[15.5px] text-gray-400 leading-relaxed mb-8 max-w-md">
              Six tightly integrated layers work in concert to deliver unparalleled
              financial intelligence — from your interface down to the raw data infrastructure.
            </p>

            {/* Highlights */}
            <ul className="space-y-3">
              {[
                'Real-time processing across 12,000+ institutions',
                'Sub-100ms AI inference on financial queries',
                'SOC2 Type II · ISO 27001 · PCI-DSS Level 1',
                'Federated learning — your data stays private',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <motion.a
              href="#"
              className="btn-secondary mt-10 inline-flex"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Read Architecture Docs
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>

          {/* Right — architecture diagram */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-[480px] mx-auto">
              {layers.map((layer, i) => (
                <div key={layer.name} className="flex flex-col items-center">
                  {/* Layer block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={`
                      relative w-full rounded-xl px-5 py-4 border ${layer.border} ${layer.bg}
                      flex items-center justify-between gap-4
                      shadow-lg ${layer.glow}
                    `}
                    style={{ maxWidth: layer.width }}
                  >
                    {/* Left gradient bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-gradient-to-b ${layer.color}`} />

                    <div className="pl-2">
                      <p className="text-[13.5px] font-semibold text-white">{layer.name}</p>
                      <p className="text-[11.5px] text-gray-500 mt-0.5">{layer.desc}</p>
                    </div>

                    {/* Animated pulse dot */}
                    <div className="flex-shrink-0 relative">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: layer.dotColor, boxShadow: `0 0 8px ${layer.dotColor}` }}
                      />
                      <div
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ background: layer.dotColor, opacity: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  {/* Connector with flowing dot */}
                  {i < layers.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0, originY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 + 0.3 }}
                      className="relative flex flex-col items-center h-8 w-full justify-center"
                    >
                      <div className="w-px h-full bg-gradient-to-b from-violet-500/40 to-blue-500/20" />
                      <motion.div
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${layer.dotColor}, transparent)`,
                          boxShadow: `0 0 6px ${layer.dotColor}88`,
                        }}
                        animate={{ y: [0, 28] }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          delay: i * 0.35,
                          ease: 'linear',
                          repeatDelay: 0.3,
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
