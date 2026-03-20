import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Menu, X, MessageCircle, LayoutDashboard, Briefcase, Eye, Target, FileText } from 'lucide-react'

const MENU_ITEMS = [
  { key: 'chat', label: 'Chats', icon: MessageCircle },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { key: 'watchlist', label: 'Watchlist', icon: Eye },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'reports', label: 'Reports', icon: FileText },
]

function SidebarContent({ onToggle, onNewChat, conversations, onSelectConversation, currentId, activeSection, onSectionChange, sectionMeta }) {
  const isChatSection = activeSection === 'chat'

  return (
    <>
      <motion.button
        onClick={onToggle}
        className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
        whileHover={{ background: 'rgba(255,255,255,0.1)' }}
      >
        <X className="w-4 h-4 text-gray-400" />
      </motion.button>

      <div className="px-4 pt-5 pb-3 border-b border-white/[0.055]">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Derivity logo" className="w-16 h-8 object-contain opacity-95" />
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-400">Derivity AI</span>
        </div>
      </div>

      <div className="p-3 pb-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activeSection === item.key
          return (
            <button
              key={item.key}
              onClick={() => {
                onSectionChange(item.key)
                onToggle()
              }}
              className="w-full px-3 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 mb-1"
              style={{
                background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
                border: active ? '1px solid rgba(139,92,246,0.28)' : '1px solid transparent',
              }}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-violet-300' : 'text-gray-500'}`} />
                <span className={`text-[12.5px] font-medium ${active ? 'text-white' : 'text-gray-300'}`}>{item.label}</span>
              </span>
              {sectionMeta?.[item.key] ? (
                <span className="text-[10px] text-gray-500">{sectionMeta[item.key]}</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {isChatSection && (
        <>
          <div className="px-3 pt-1">
            <motion.button
              onClick={onNewChat}
              whileHover={{ background: 'rgba(139,92,246,0.15)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-medium text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))',
                border: '1px solid rgba(139,92,246,0.25)',
                color: '#e6f2ff',
              }}
            >
              <Plus className="w-4 h-4" />
              New chat
            </motion.button>
          </div>

          <div className="px-3 mt-3 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-3">
            {conversations.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-8">No chats yet</p>
            ) : (
              conversations.map((conv, i) => (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    onSelectConversation(conv.id)
                    onToggle()
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 group text-xs leading-snug min-h-[44px]"
                  style={{
                    background: currentId === conv.id ? 'rgba(139,92,246,0.12)' : 'transparent',
                    border: currentId === conv.id ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                    color: currentId === conv.id ? '#e6f2ff' : '#9ca3af',
                  }}
                >
                  <MessageCircle className="w-3.5 h-3.5 flex-shrink-0 text-violet-400/60 group-hover:text-violet-400 transition-colors" />
                  <span className="flex-1 truncate font-medium">{conv.title || 'New conversation'}</span>
                </motion.button>
              ))
            )}
          </div>
        </>
      )}

      <div className="border-t border-white/[0.055] p-3 space-y-2">
        <p className="text-[11px] text-gray-600 text-center">Institutional-grade intelligence for everyday investors</p>
        <p className="text-[11px] text-gray-700 text-center">v0.1 — Training</p>
      </div>
    </>
  )
}

export default function ChatSidebar({
  isOpen,
  onToggle,
  onNewChat,
  conversations = [],
  onSelectConversation,
  currentId,
  activeSection,
  onSectionChange,
  sectionMeta,
}) {
  return (
    <>
      {/* Mobile hamburger button - top left */}
      <motion.button
        onClick={onToggle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden fixed top-6 left-6 z-[150] w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
        whileHover={{ background: 'rgba(255,255,255,0.12)' }}
      >
        {isOpen ? (
          <X className="w-4 h-4 text-gray-300" />
        ) : (
          <Menu className="w-4 h-4 text-gray-300" />
        )}
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-[199]"
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 w-72 h-screen bg-black/88 backdrop-blur-xl border-r border-white/[0.06] flex-col z-[210]">
        <SidebarContent
          onToggle={() => {}}
          onNewChat={onNewChat}
          conversations={conversations}
          onSelectConversation={onSelectConversation}
          currentId={currentId}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          sectionMeta={sectionMeta}
        />
      </div>

      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed md:hidden w-72 h-screen bg-black/88 backdrop-blur-xl border-r border-white/[0.06] flex flex-col z-[210]"
      >
        <SidebarContent
          onToggle={onToggle}
          onNewChat={onNewChat}
          conversations={conversations}
          onSelectConversation={onSelectConversation}
          currentId={currentId}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          sectionMeta={sectionMeta}
        />
      </motion.div>
    </>
  )
}
