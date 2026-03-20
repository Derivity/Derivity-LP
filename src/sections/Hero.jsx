import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ParticleNetwork from '../components/ParticleNetwork'

// Each word animates in individually — blur clears, lifts up
const WORDS = ['Financial', 'Intelligence.', 'Reimagined.']

function WordReveal() {
  return (
    <h1
      aria-label="Financial Intelligence. Reimagined."
      className="text-[clamp(42px,7.5vw,110px)] font-black leading-[1.14] tracking-[-0.04em] text-white pb-[0.06em]"
    >
      {WORDS.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1.1,
            delay: 0.5 + i * 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block mr-[0.22em] ${
            i === 2 ? 'gradient-text' : ''
          }`}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full
          bg-violet-900/[0.12] blur-[140px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full
          bg-blue-900/[0.10] blur-[120px] animate-blob-delayed" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(100,40,200,0.09) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black to-transparent" />
      </div>

      <ParticleNetwork opacity={0.35} />

      {/* ── Content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 select-none"
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <img src="/logo.svg" alt="Derivity logo" className="w-24 h-12 object-contain" />
          <span className="text-[11px] font-semibold tracking-[0.35em] uppercase" style={{ color: 'rgba(245,245,245,0.5)' }}>
            Derivity
          </span>
        </motion.div>

        {/* Main sentence */}
        <WordReveal />

        {/* Single subline — fades in last */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.4, ease: 'easeOut' }}
          className="mt-8 text-[clamp(14px,1.5vw,17px)] text-gray-600 font-light tracking-wide max-w-sm"
        >
          The AI-powered financial operating system.
        </motion.p>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.0, ease: 'easeOut' }}
          className="mt-10 flex items-center gap-3"
        >
          <span className="text-[11px] text-gray-700 uppercase tracking-[0.22em] font-medium">Trusted by</span>
          <span className="w-px h-3 bg-gray-800" />
          <span className="text-[13px] font-semibold text-gray-400 tracking-wide">One Fourth Finance</span>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <motion.div
          className="w-[1px] h-16 origin-top"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.6, 1], repeatDelay: 0.6 }}
        />
        <motion.span
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[9px] text-gray-700 tracking-[0.3em] uppercase font-medium"
        >
          Scroll
        </motion.span>
      </motion.div>
    </section>
  )
}
