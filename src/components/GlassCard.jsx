import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', delay = 0, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`glass rounded-2xl ${hover ? 'glass-hover transition-all duration-400' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
