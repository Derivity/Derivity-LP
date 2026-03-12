import React from 'react'
import ReactDOM from 'react-dom/client'
import TryDerivity from './sections/TryDerivity.jsx'
import './index.css'

function ChatApp() {
  return (
    <TryDerivity onBack={() => { window.location.href = '/' }} />
  )
}

ReactDOM.createRoot(document.getElementById('chat-root')).render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>,
)
