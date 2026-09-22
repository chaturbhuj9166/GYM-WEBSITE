import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register once and import from here everywhere so plugins are always available.
gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 1 })
 
// Avoid refresh jumps when mobile browser toolbars show/hide.
ScrollTrigger.config({ ignoreMobileResize: true })

/** Shared responsive breakpoints for gsap.matchMedia(). */
export const MQ = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  mobile: '(max-width: 767px)',
  notMobile: '(min-width: 768px)',
  compact: '(max-width: 1023px)',
  reduce: '(prefers-reduced-motion: reduce)',
  motion: '(prefers-reduced-motion: no-preference)', 
}

export { gsap, ScrollTrigger, useGSAP }
