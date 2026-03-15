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
      whileHover={{ y: -4, scale: 1.018 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.72 }}
      {...props}
    >
      <span className="premium-try-btn__halo" aria-hidden="true" />
      <span className="premium-try-btn__surface" aria-hidden="true" />
      <span className="premium-try-btn__liquid" aria-hidden="true" />
      <span className="premium-try-btn__beam" aria-hidden="true" />
      <span className="premium-try-btn__edge" aria-hidden="true" />
      <span className="premium-try-btn__label">{label}</span>
      {showArrow && (
        <span className="premium-try-btn__icon" aria-hidden="true">
          <span className="premium-try-btn__icon-glow" />
          <span className="premium-try-btn__arrow">&gt;</span>
        </span>
      )}
    </motion.a>
  )
}