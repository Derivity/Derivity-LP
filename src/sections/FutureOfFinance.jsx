import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const TEXT = 'The operating system for the financial world.'
const WORDS = TEXT.split(' ')

export default function FutureOfFinance() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.reveal-word', textRef.current)

      gsap.set(words, { color: 'rgba(255,255,255,0.1)' })

      gsap.to(words, {
        color: '#ffffff',
        stagger: 0.04,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'center 15%',
          scrub: 1.8,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="future"
      ref={sectionRef}
      className="relative bg-black py-32 md:py-52 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(75,20,140,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="section-label">Our vision</span>
        </motion.div>

        {/* Giant animated text */}
        <h2
          ref={textRef}
          className="text-[clamp(40px,7.5vw,96px)] font-black leading-[1.1] tracking-[-0.03em]"
          aria-label={TEXT}
        >
          {WORDS.map((word, i) => (
            <span
              key={i}
              className="reveal-word inline-block mr-[0.22em] mb-[0.1em]"
              style={{ color: 'rgba(255,255,255,0.1)' }}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Sub-statement */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-10 text-[clamp(15px,1.8vw,18px)] text-gray-500 max-w-2xl mx-auto leading-relaxed"
        >
          Just like how iOS unified the mobile experience, Derivity unifies the financial
          experience — intelligent, personal, and always evolving.
        </motion.p>

        {/* Decorative orbs */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-32 rounded-full
          bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-32 h-32 rounded-full
          bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>
    </section>
  )
}
