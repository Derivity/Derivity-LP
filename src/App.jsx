import { useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import MarketTicker from './sections/MarketTicker'
import MissionSection from './sections/MissionSection'
import CTA from './sections/CTA'
import Footer from './sections/Footer'
import PlatformPage from './pages/PlatformPage'
import AIEnginePage from './pages/AIEnginePage'
import FeaturesPage from './pages/FeaturesPage'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [page, setPage] = useState('home')

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const onFrame = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onFrame)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(onFrame)
    }
  }, [])

  // Handle navigation from navbar
  const handleNavigate = (section) => {
    setPage(section)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setPage('home')
    window.scrollTo(0, 0)
  }

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} currentPage={page} />
      
      {page === 'home' && (
        <>
          <Hero />
          <MarketTicker />
          <MissionSection />
          <CTA onNavigate={handleNavigate} />
          <Footer />
        </>
      )}
      
      {page === 'platform' && <PlatformPage onBack={handleBack} />}
      {page === 'ai-engine' && <AIEnginePage onBack={handleBack} />}
      {page === 'features' && <FeaturesPage onBack={handleBack} />}
    </div>
  )
}

export default App
