import { motion } from 'framer-motion'
import Features from '../sections/Features'
import Footer from '../sections/Footer'

export default function FeaturesPage({ onBack }) {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          ← Back
        </motion.button>
      </div>

      {/* Page header */}
      <div className="relative bg-black pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)',
              filter: 'blur(2px)',
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need to manage your wealth intelligently
          </p>
        </motion.div>
      </div>

      <Features />
      <Footer />
    </div>
  )
}
