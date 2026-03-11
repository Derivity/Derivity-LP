import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Products from './sections/Products'
import AIEngine from './sections/AIEngine'
import Features from './sections/Features'
import FutureOfFinance from './sections/FutureOfFinance'
import CTA from './sections/CTA'
import Footer from './sections/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
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

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Products />
      <AIEngine />
      <Features />
      <FutureOfFinance />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
