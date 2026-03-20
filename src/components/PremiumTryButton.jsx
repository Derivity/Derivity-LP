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
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ y: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      {...props}
    >
      <span className="premium-try-btn__label">{label}</span>
    </motion.a>
  )
}