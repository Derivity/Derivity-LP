import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const TICKERS = [
  { symbol: 'NASDAQ:AAPL',     label: 'Apple',   color: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.18)'  },
  { symbol: 'SP:SPX',          label: 'S&P 500', color: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.18)'  },
  { symbol: 'NSE:NIFTY',       label: 'Nifty 50',color: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.18)' },
  { symbol: 'BITSTAMP:BTCUSD', label: 'Bitcoin', color: 'rgba(251,191,36,0.09)',  border: 'rgba(251,191,36,0.18)'  },
]

function MiniChart({ symbol, label, color, border, delay }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = ''

    const wrap = document.createElement('div')
    wrap.className = 'tradingview-widget-container'

    const inner = document.createElement('div')
    inner.className = 'tradingview-widget-container__widget'

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol,
      width: '100%',
      height: 180,
      locale: 'en',
      dateRange: '1D',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
      noTimeScale: false,
    })

    wrap.appendChild(inner)
    wrap.appendChild(script)
    el.appendChild(wrap)

    return () => { el.innerHTML = '' }
  }, [symbol])

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-[220px] rounded-2xl overflow-hidden"
      style={{ background: color, border: `1px solid ${border}` }}
    >
      <div className="px-4 pt-3 pb-0">
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gray-500">
          {label}
        </span>
      </div>
      <div ref={containerRef} className="w-full" />
    </motion.div>
  )
}

export default function MarketTicker() {
  return (
    <section className="relative w-full bg-black py-14 px-6 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.18), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.10), transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8"
      >
        <span
          className="text-[10px] font-semibold tracking-[0.38em] uppercase"
          style={{ color: 'rgba(167,139,250,0.45)' }}
        >
          Live Markets
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto flex flex-wrap gap-3">
        {TICKERS.map(({ symbol, label, color, border }, i) => (
          <MiniChart
            key={symbol}
            symbol={symbol}
            label={label}
            color={color}
            border={border}
            delay={i * 0.08}
          />
        ))}
      </div>
    </section>
  )
}
