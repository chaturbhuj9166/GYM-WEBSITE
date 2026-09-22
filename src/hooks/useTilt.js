import { useEffect } from 'react'
import { gsap } from '../utils/gsap'

/**
 * Pointer-driven 3D tilt. Rotates the element toward the pointer and exposes
 * --mx / --my (0..1) custom properties so children can move highlights or
 * backgrounds with CSS. Uses quickTo so no React state is touched.
 */
export function useTilt(ref, { max = 8, scale = 1.02, perspective = 1100 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' })
    const rxTo = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const ryTo = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' })
    const sTo = gsap.quickTo(el, 'scale', { duration: 0.7, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      // Pointer left → card turns left; pointer up → card tips back.
      ryTo((px - 0.5) * max * 2)
      rxTo(-(py - 0.5) * max * 2)
      el.style.setProperty('--mx', px.toFixed(3))
      el.style.setProperty('--my', py.toFixed(3))
    }
    const onEnter = () => sTo(scale)
    const onLeave = () => {
      rxTo(0)
      ryTo(0)
      sTo(1)
      el.style.setProperty('--mx', '0.5')
      el.style.setProperty('--my', '0.5')
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [ref, max, scale, perspective])
}
