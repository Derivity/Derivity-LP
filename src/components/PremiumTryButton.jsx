import { motion } from 'framer-motion'

export default function PremiumTryButton({
  href = '/chat.html',
  label = 'Try Derivity',
  className = '',
  fullWidth = false,
  showArrow = true,
  ...props
}) {
  return (
    <motion.a
      href={href}
      className={`premium-try-btn ${fullWidth ? 'premium-try-btn--full' : ''} ${className}`.trim()}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 360, damping: 22, mass: 0.7 }}
      {...props}
    >
      <span className="premium-try-btn__aura" aria-hidden="true" />
      <span className="premium-try-btn__sheen" aria-hidden="true" />
      <span className="premium-try-btn__label">{label}</span>
      {showArrow && <span className="premium-try-btn__arrow">-></span>}
    </motion.a>
  )
}