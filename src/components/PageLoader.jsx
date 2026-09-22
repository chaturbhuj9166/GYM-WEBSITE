import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../utils/gsap'
import SplitText from './SplitText'

/**
 * ~1.4s cinematic intro: FIT UP → A WHOLE NEW LIFESTYLE. → shutter split reveal.
 * `onReveal` fires as the shutters open so the hero intro overlaps the reveal.
 */
export default function PageLoader({ onReveal }) {
  const ref = useRef(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const counter = { value: 0 }
      const counterEl = ref.current.querySelector('.loader-count')

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => setDone(true),
      })

      if (reduce) {
        tl.to(ref.current, { opacity: 0, duration: 0.4, onStart: onReveal })
        return
      }

      tl.from('.loader-brand .ch', { yPercent: 115, duration: 0.55, stagger: 0.035 })
        .to('.loader-bar', { scaleX: 1, duration: 1.05, ease: 'power2.inOut' }, 0.05)
        .to(
          counter,
          {
            value: 100,
            duration: 1.05,
            ease: 'power2.inOut',
            onUpdate: () => {
              counterEl.textContent = String(Math.round(counter.value)).padStart(3, '0')
            },
          },
          0.05,
        )
        .to('.loader-brand .ch', { yPercent: -115, duration: 0.4, stagger: 0.02, ease: 'power3.in' }, 0.62)
        .fromTo('.loader-tag .ch', { yPercent: 115 }, { yPercent: 0, duration: 0.45, stagger: 0.018, immediateRender: true }, 0.8)
        .add(() => onReveal?.(), 1.2)
        .to('.loader-content', { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 1.15)
        .to('.loader-top', { yPercent: -100, duration: 0.75, ease: 'expo.inOut' }, 1.18)
        .to('.loader-bottom', { yPercent: 100, duration: 0.75, ease: 'expo.inOut' }, 1.18)
    },
    { scope: ref },
  )

  if (done) return null

  return (
    <div ref={ref} className="fixed inset-0 z-[300] text-[#f4f4ef]" aria-hidden="true">
      <div className="loader-top absolute inset-x-0 top-0 h-1/2 bg-[#050505] will-change-transform" />
      <div className="loader-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#050505] will-change-transform" />
      <div className="loader-content absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="relative grid place-items-center">
          <div className="loader-brand col-start-1 row-start-1 overflow-hidden font-display text-[clamp(3rem,12vw,9rem)]">
            <SplitText text="FIT UP" charClassName="ch" />
          </div>
          <div className="loader-tag col-start-1 row-start-1 overflow-hidden font-display text-[clamp(1.9rem,6.5vw,5rem)] text-[#c8ff2e]">
            <SplitText text="A WHOLE NEW LIFESTYLE." charClassName="ch" />
          </div>
        </div>
        <div className="mt-8 flex w-[min(320px,70vw)] items-center gap-4">
          <div className="relative h-px flex-1 overflow-hidden bg-white/15">
            <div className="loader-bar absolute inset-0 origin-left bg-[#c8ff2e]" style={{ transform: 'scaleX(0)' }} />
          </div>
          <span className="loader-count label text-white/60">000</span>
        </div>
      </div>
    </div>
  )
}
