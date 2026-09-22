import { useEffect } from 'react'
import { gsap } from '../utils/gsap'

/**
 * Magnetic hover: the element (and optionally an inner label) drifts toward the
 * pointer while hovered and springs back on leave. Desktop pointers only.
 */
export function useMagnetic(ref, { strength = 0.35, innerStrength = 0.18, innerSelector } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const inner = innerSelector ? el.querySelector(innerSelector) : null
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' })
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      if (inner) {
        ixTo(dx * innerStrength)
        iyTo(dy * innerStrength)
      }
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
      if (inner) gsap.killTweensOf(inner)
    }
  }, [ref, strength, innerStrength, innerSelector])
}
