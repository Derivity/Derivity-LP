/**
 * GlowCard — Reusable animated RGB glow-border card for Derivity
 *
 * Uses CSS Houdini @property to animate a conic-gradient border
 * that flows continuously around the card edges.
 *
 * Props:
 *   children       — card content
 *   className      — outer wrapper extra classes
 *   innerClassName — inner content area extra classes
 *   duration       — gradient rotation speed in seconds (default 6)
 *   blur           — outer glow blur radius in px (default 28)
 *   radius         — border radius in px (default 22)
 *   borderWidth    — gradient border thickness in px (default 1.5)
 *   colors         — array of gradient stop colors
 */

import { motion } from 'framer-motion'

const DEFAULT_COLORS = [
  '#7c3aed', // violet
  '#2563eb', // blue
  '#06b6d4', // cyan
  '#a855f7', // purple
  '#ec4899', // magenta/pink
  '#7c3aed', // violet  (close the loop)
]

export default function GlowCard({
  children,
  className = '',
  innerClassName = '',
  duration = 6,
  blur = 28,
  radius = 22,
  borderWidth = 1.5,
  colors = DEFAULT_COLORS,
}) {
  const gradient = `conic-gradient(from var(--glow-angle), ${colors.join(', ')})`
  const innerRadius = Math.max(0, radius - borderWidth)

  return (
    <motion.div
      initial="idle"
      whileHover="hover"
      className={`relative ${className}`}
      style={{ borderRadius: radius }}
    >

      {/* ── Layer 1: Soft blurred outer glow ──────────────────────── */}
      <motion.div
        aria-hidden
        variants={{
          idle: { opacity: 0.55, scale: 1.04 },
          hover: { opacity: 0.92, scale: 1.08 },
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: gradient,
          animation: `glow-card-spin ${duration}s linear infinite`,
          borderRadius: radius,
          filter: `blur(${blur}px)`,
        }}
      />

      {/* ── Layer 2: Secondary wider glow for depth ───────────────── */}
      <motion.div
        aria-hidden
        variants={{
          idle: { opacity: 0.30, scale: 1.12 },
          hover: { opacity: 0.55, scale: 1.18 },
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: gradient,
          animation: `glow-card-spin ${duration}s linear infinite`,
          borderRadius: radius,
          filter: `blur(${blur * 2.2}px)`,
        }}
      />

      {/* ── Layer 3: Sharp 1-pixel gradient border shell ─────────── */}
      <div
        aria-hidden
        style={{
          background: gradient,
          animation: `glow-card-spin ${duration}s linear infinite`,
          padding: `${borderWidth}px`,
          borderRadius: radius,
        }}
      >
        {/* ── Layer 4: Inner dark content container ─────────────── */}
        <motion.div
          variants={{
            idle: { backgroundColor: 'rgba(8, 4, 18, 0.97)' },
            hover: { backgroundColor: 'rgba(11, 6, 26, 0.95)' },
          }}
          transition={{ duration: 0.45 }}
          className={`relative ${innerClassName}`}
          style={{ borderRadius: innerRadius }}
        >
          {children}
        </motion.div>
      </div>

    </motion.div>
  )
}
