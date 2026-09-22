import { useRef } from 'react'
import { ScrollTrigger, gsap, useGSAP } from '../utils/gsap'

/**
 * Thin vertical rail on the right edge: the fill scales with page progress and
 * a mono label reads 0% → 100%. Updated imperatively from ScrollTrigger.
 */
export default function ScrollProgress() {
  const fillRef = useRef(null)
  const labelRef = useRef(null)

  useGSAP(() => {
    const setFill = gsap.quickSetter(fillRef.current, 'scaleY')
    let lastPct = -1
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setFill(self.progress)
        const pct = Math.round(self.progress * 100)
        if (pct !== lastPct) {
          labelRef.current.textContent = `${String(pct).padStart(2, '0')}%`
          lastPct = pct
        }
      },
    })
    return () => trigger.kill()
  })

  return (
    <div
      className="pointer-events-none fixed right-[6px] top-1/2 z-[80] flex -translate-y-1/2 flex-col items-center gap-3 mix-blend-difference sm:right-4 md:right-6"
      aria-hidden="true"
    >
      <span ref={labelRef} className="label hidden rotate-90 text-[9px] text-white/80 md:block">
        00%
      </span>
      <div className="relative h-[26vh] w-px overflow-hidden bg-white/20 md:h-[32vh]">
        <div ref={fillRef} className="absolute inset-0 origin-top bg-white will-change-transform" style={{ transform: 'scaleY(0)' }} />
      </div>
      <span className="hidden h-1.5 w-1.5 rounded-full bg-white md:block" />
    </div>
  )
}
