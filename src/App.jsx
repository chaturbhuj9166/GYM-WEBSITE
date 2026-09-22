import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './utils/gsap'
import { getLenis } from './utils/lenis'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useTheme } from './hooks/useTheme'
import { AppReadyContext } from './hooks/useAppReady'

import PageLoader from './components/PageLoader'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'

import Hero from './sections/Hero'
import DumbbellScene from './sections/DumbbellScene'
import WeightSection from './sections/WeightSection'
import Philosophy from './sections/Philosophy'
import Programs from './sections/Programs'
import Stats from './sections/Stats'
import Gallery from './sections/Gallery'
import GrindSection from './sections/GrindSection'
import Membership from './sections/Membership'
import Testimonials from './sections/Testimonials'
import FinalCTA from './sections/FinalCTA'
import Footer from './sections/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const { theme, toggleTheme } = useTheme()
  useSmoothScroll()

  // Always start the film from the top, and hold scrolling until the intro reveals.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (ready) {
      lenis?.start()
      document.documentElement.style.overflow = ''
    } else {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    }
  }, [ready])

  // Recalculate pin positions once fonts/images have settled the layout.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const handleReveal = useCallback(() => setReady(true), [])

  return (
    <AppReadyContext.Provider value={ready}>
      <PageLoader onReveal={handleReveal} />
      <CustomCursor />
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="relative">
        <Hero />
        <DumbbellScene />
        <WeightSection />
        <Philosophy />
        <Programs />
        <Stats />
        <Gallery />
        <GrindSection />
        <Membership />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />

      <div className="grain" aria-hidden="true" />
    </AppReadyContext.Provider>
  )
}
