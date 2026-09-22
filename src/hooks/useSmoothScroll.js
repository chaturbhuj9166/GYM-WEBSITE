import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { setLenis } from '../utils/lenis'

/**
 * Creates the single Lenis instance and wires it into GSAP:
 * - Lenis is driven by gsap.ticker so smooth scroll and ScrollTrigger share one RAF.
 * - Every Lenis scroll event updates ScrollTrigger, so scrubbed timelines stay in sync.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    // Note: GSAP's default lag smoothing is kept on purpose. With lagSmoothing(0)
    // a main-thread stall (e.g. WebGL shader compilation) would make the intro
    // timelines jump straight to their end instead of playing.

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])
}
