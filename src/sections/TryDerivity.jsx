import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, RotateCcw, ArrowLeft, TrendingUp, PieChart, DollarSign, BarChart3 } from "lucide-react"

const MOCK_RESPONSES = [
  "I'm Derivity AI — I'm currently in training and growing smarter every day. My full capabilities are rolling out soon, but I can already walk you through financial concepts and strategies.",
  "Great question. I'm still in training, so consider this a preview of what's coming — Derivity is being built to give you institutional-grade portfolio analysis at your fingertips.",
  "As Derivity AI, I'm designed to synthesise market signals, macro data, and your personal financial picture into one clear view. That full experience is on its way.",
  "I'm currently under active training, so I can't connect to live accounts just yet — but I can reason through this with you based on what I know. Here's how I'd approach it.",
  "Derivity is being built so every individual has access to the kind of financial intelligence that was once reserved for hedge funds. I'm the engine powering that — and I'm still learning.",
  "That's exactly what Derivity is being trained to solve. I can share how the system is designed to approach this — just keep in mind I'm still in development and getting sharper every week.",
  "I'm Derivity AI and I'm in training — which means my responses are illustrative for now. The vision is to give you a complete financial co-pilot. We're almost there.",
]

const WELCOME_MSG = {
  id: "welcome",
  role: "assistant",
  text: "Hi, I'm Derivity AI — built to be your personal financial intelligence engine. I'm currently in training, so my responses are illustrative and may not reflect live data. That said, I'm here and ready to help you think through investments, markets, budgeting, and more. What's on your mind?",
}

function useTypewriter(text, speed = 14) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    setDisplayed("")
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

function AssistantBubble({ text, animate }) {
  const displayed = useTypewriter(animate ? text : "")
  const content = animate ? displayed : text
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 max-w-3xl"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-900/40">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-[15px] text-gray-200 leading-[1.75]">
          {content}
          {animate && content.length < text.length && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </motion.div>
  )
}

function UserBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <div
        className="max-w-[72%] rounded-2xl rounded-tr-sm px-5 py-3.5 text-[15px] leading-[1.7] text-white"
        style={{
          background: "linear-gradient(135deg, rgba(109,40,217,0.45), rgba(37,99,235,0.45))",
          border: "1px solid rgba(139,92,246,0.22)",
        }}
      >
        {text}
      </div>
    </motion.div>
  )
}

function Thinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-900/40">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex gap-1.5 items-center py-1">
        {[0, 0.16, 0.32].map((d) => (
          <motion.span
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-violet-400/70"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: d }}
          />
        ))}
      </div>
    </motion.div>
  )
}

const SUGGESTIONS = [
  { icon: PieChart,    text: "How should I diversify my portfolio?" },
  { icon: DollarSign, text: "Explain dollar-cost averaging" },
  { icon: TrendingUp, text: "What is my optimal savings rate?" },
  { icon: BarChart3,  text: "Analyse current market conditions" },
]

export default function TryDerivity({ onBack }) {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [responseIdx, setResponseIdx] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, thinking])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500)
  }, [])

  const send = useCallback((text) => {
    const msg = (text ?? input).trim()
    if (!msg || thinking) return
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg }])
    setThinking(true)
    setTimeout(() => {
      const response = MOCK_RESPONSES[responseIdx % MOCK_RESPONSES.length]
      setResponseIdx((i) => i + 1)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: response }])
      setThinking(false)
    }, 850 + Math.random() * 650)
  }, [input, thinking, responseIdx])

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  const reset = () => {
    setMessages([WELCOME_MSG])
    setInput("")
    setThinking(false)
    setResponseIdx(0)
  }

  const isEmpty = messages.length === 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex flex-col bg-black overflow-hidden"
    >
      {/* Layered ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <motion.div
          className="absolute top-[-20%] left-[25%] w-[55%] h-[55%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(109,40,217,0.10) 0%, transparent 70%)", filter: "blur(1px)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[15%] w-[45%] h-[45%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.09) 0%, transparent 70%)", filter: "blur(1px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial fade-out mask over the grid */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, black 100%)" }}
        />
      </div>

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 h-[60px] flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-300 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[13px] font-medium tracking-wide">Back</span>
        </motion.button>

        <motion.button
          onClick={reset}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 text-gray-700 hover:text-gray-400 transition-colors duration-200 group"
          title="New conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[12px] font-medium tracking-wide hidden sm:block">New chat</span>
        </motion.button>
      </div>

      {/* Messages */}
      <div
        className="relative z-10 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}
      >
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">

          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center pt-14 pb-4 gap-12"
              >
                {/* Heading block */}
                <div className="flex flex-col items-center gap-4">
                  {/* Wordmark */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-2 mb-2"
                  >
                    <span
                      className="text-[13px] font-semibold tracking-[0.3em] uppercase"
                      style={{ color: "rgba(167,139,250,0.5)" }}
                    >
                      Derivity
                    </span>
                    <div className="w-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />
                  </motion.div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[clamp(26px,4.5vw,48px)] font-black tracking-[-0.03em] text-white leading-[1.1] mb-1"
                    >
                      What can I help you
                    </motion.h1>
                    <motion.h1
                      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[clamp(26px,4.5vw,48px)] font-black tracking-[-0.03em] leading-[1.1]"
                      style={{
                        background: "linear-gradient(135deg, #a78bfa, #60a5fa, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      with today?
                    </motion.h1>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="text-[14px] text-gray-600 leading-relaxed max-w-sm"
                  >
                    Your AI-powered financial intelligence engine. Ask anything about investments, markets, or personal finance.
                  </motion.p>
                </div>

                {/* Suggestion cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <motion.button
                        key={s.text}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => send(s.text)}
                        className="group relative text-left px-4 py-4 rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          background: "rgba(255,255,255,0.028)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        whileHover={{ borderColor: "rgba(139,92,246,0.25)" }}
                      >
                        {/* Hover spotlight */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-[16px] transition-opacity duration-400"
                          style={{ background: "radial-gradient(circle at 30% 50%, rgba(109,40,217,0.07), transparent 70%)" }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300"
                            style={{ background: "rgba(139,92,246,0.1)" }}>
                            <Icon className="w-3.5 h-3.5 text-violet-400/70 group-hover:text-violet-400 transition-colors duration-300" />
                          </div>
                          <span className="text-[13px] text-gray-500 font-medium group-hover:text-gray-200 transition-colors duration-300 leading-snug">
                            {s.text}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, i) =>
            msg.role === "user"
              ? <UserBubble key={msg.id} text={msg.text} />
              : <AssistantBubble key={msg.id} text={msg.text}
                  animate={i === messages.length - 1 && msg.id !== "welcome"} />
          )}

          <AnimatePresence>{thinking && <Thinking key="thinking" />}</AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar with neon glow border */}
      <div className="relative z-10 flex-shrink-0 px-4 md:px-6 pb-6 pt-3 max-w-2xl mx-auto w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 md:inset-x-6 inset-y-3"
          style={{
            background: "conic-gradient(from var(--glow-angle), #7c3aed, #2563eb, #06b6d4, #a855f7, #ec4899, #7c3aed)",
            animation: "glow-card-spin 5s linear infinite",
            borderRadius: 20,
            filter: "blur(22px)",
            opacity: input.trim() ? 0.7 : 0.35,
            transform: "scale(1.04)",
            transition: "opacity 0.4s ease",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 md:inset-x-6 inset-y-3"
          style={{
            background: "conic-gradient(from var(--glow-angle), #7c3aed, #2563eb, #06b6d4, #a855f7, #ec4899, #7c3aed)",
            animation: "glow-card-spin 5s linear infinite",
            borderRadius: 20,
            filter: "blur(48px)",
            opacity: input.trim() ? 0.35 : 0.15,
            transform: "scale(1.10)",
            transition: "opacity 0.4s ease",
          }}
        />

        <div
          className="relative"
          style={{
            background: "conic-gradient(from var(--glow-angle), #7c3aed, #2563eb, #06b6d4, #a855f7, #ec4899, #7c3aed)",
            animation: "glow-card-spin 5s linear infinite",
            padding: "1.5px",
            borderRadius: 20,
          }}
        >
          <div
            className="flex items-end gap-3 px-4 py-3.5"
            style={{ background: "rgba(5, 3, 14, 0.98)", borderRadius: 19 }}
          >
            <textarea
              ref={(el) => { inputRef.current = el; textareaRef.current = el }}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = "auto"
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px"
              }}
              onKeyDown={onKey}
              placeholder="Ask anything about your finances..."
              className="flex-1 bg-transparent resize-none outline-none text-[15px] text-gray-200 placeholder:text-gray-700 leading-relaxed min-h-[24px] max-h-[130px]"
              style={{ scrollbarWidth: "none" }}
            />
            <motion.button
              onClick={() => send()}
              disabled={!input.trim() || thinking}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-25"
              style={{
                background: input.trim() && !thinking ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.07)",
                boxShadow: input.trim() && !thinking ? "0 0 20px rgba(124,58,237,0.5)" : "none",
              }}
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-800 mt-3 tracking-wide select-none">
          Derivity AI · Under development · Responses are illustrative only
        </p>
      </div>
    </motion.div>
  )
}
