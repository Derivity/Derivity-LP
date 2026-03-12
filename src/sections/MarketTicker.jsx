import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Transparent overlay — catches wheel events so the page scrolls normally.
// Click to unlock full iframe interaction; mouse-leave re-locks.
function ScrollGuard({ children }) {
  const [locked, setLocked] = useState(true)
  return (
    <div className="relative" onMouseLeave={() => setLocked(true)}>
      {children}
      {locked && (
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'transparent', cursor: 'default' }}
          onWheel={(e) => window.scrollBy({ top: e.deltaY, behavior: 'auto' })}
          onClick={() => setLocked(false)}
        />
      )}
    </div>
  )
}

// Full-width scrolling ticker tape
function TickerTape() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ''
    const wrap = document.createElement('div')
    wrap.className = 'tradingview-widget-container'
    const inner = document.createElement('div')
    inner.className = 'tradingview-widget-container__widget'
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'NASDAQ:AAPL',     title: 'Apple'     },
        { proName: 'NASDAQ:NVDA',     title: 'NVIDIA'    },
        { proName: 'NASDAQ:TSLA',     title: 'Tesla'     },
        { proName: 'NASDAQ:MSFT',     title: 'Microsoft' },
        { proName: 'NASDAQ:GOOGL',    title: 'Google'    },
        { proName: 'NASDAQ:AMZN',     title: 'Amazon'    },
        { proName: 'SP:SPX',          title: 'S&P 500'   },
        { proName: 'NSE:NIFTY',       title: 'Nifty 50'  },
        { proName: 'BSE:SENSEX',      title: 'Sensex'    },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin'   },
        { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum'  },
        { proName: 'FOREXCOM:XAUUSD', title: 'Gold'      },
        { proName: 'FX_IDC:USDINR',   title: 'USD/INR'   },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })
    wrap.appendChild(inner)
    wrap.appendChild(script)
    el.appendChild(wrap)
    return () => { el.innerHTML = '' }
  }, [])
  return <div ref={ref} className="w-full" />
}

const CHARTS = [
  {
    symbol: 'NASDAQ:AAPL',
    label: 'Apple',
    sublabel: 'NASDAQ : AAPL',
    border: 'rgba(96,165,250,0.18)',
    glow: 'rgba(59,130,246,0.07)',
    dot: '#60a5fa',
  },
  {
    symbol: 'SP:SPX',
    label: 'S&P 500',
    sublabel: 'SP : SPX',
    border: 'rgba(52,211,153,0.18)',
    glow: 'rgba(16,185,129,0.07)',
    dot: '#34d399',
  },
  {
    symbol: 'NSE:NIFTY',
    label: 'Nifty 50',
    sublabel: 'NSE : NIFTY',
    border: 'rgba(167,139,250,0.22)',
    glow: 'rgba(139,92,246,0.09)',
    dot: '#a78bfa',
  },
  {
    symbol: 'BITSTAMP:BTCUSD',
    label: 'Bitcoin',
    sublabel: 'BTC / USD',
    border: 'rgba(251,191,36,0.18)',
    glow: 'rgba(245,158,11,0.07)',
    dot: '#fbbf24',
  },
]

function MiniChart({ symbol, label, sublabel, border, glow, dot, delay }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
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
      height: 210,
      locale: 'en',
      dateRange: '1D',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
    })
    wrap.appendChild(inner)
    wrap.appendChild(script)
    el.appendChild(wrap)
    return () => { el.innerHTML = '' }
  }, [symbol])

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-[220px] rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(9,9,11,0.85)',
        border: `1px solid ${border}`,
        boxShadow: `0 0 48px ${glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-white tracking-wide">{label}</p>
          <p className="text-[10px] text-gray-600 tracking-widest mt-0.5 uppercase">{sublabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-gray-600 uppercase tracking-widest">Live</span>
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
          />
        </div>
      </div>
      <ScrollGuard>
        <div ref={ref} className="w-full" />
      </ScrollGuard>
    </motion.div>
  )
}

export default function MarketTicker() {
  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)' }}
      />

      {/* Live ticker tape strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <ScrollGuard>
          <TickerTape />
        </ScrollGuard>
      </motion.div>

      {/* Cards */}
      <div className="relative py-14 px-6">
        {/* Ambient blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '40%', left: '20%', width: 320, height: 320,
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            transform: 'translate(-50%,-50%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', right: '15%', width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
            transform: 'translate(50%,-50%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <span
            className="text-[10px] font-semibold tracking-[0.42em] uppercase"
            style={{ color: 'rgba(167,139,250,0.5)' }}
          >
            Live Markets
          </span>
        </motion.div>

        <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
          {CHARTS.map((c, i) => (
            <MiniChart key={c.symbol} {...c} delay={i * 0.09} />
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.12), transparent)' }}
      />
    </section>
  )
}
