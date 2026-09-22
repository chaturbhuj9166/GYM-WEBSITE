import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, useGSAP } from '../utils/gsap'
import { useMagnetic } from '../hooks/useMagnetic'
import { scrollToTarget } from '../utils/lenis'
import SplitText from '../components/SplitText'

export default function FinalCTA() {
  const ref = useRef(null)
  const btnRef = useRef(null)
  useMagnetic(btnRef, { strength: 0.4, innerSelector: '.cta-label' })

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center center', scrub: 1 },
      })
      tl.fromTo('.cta-char', { yPercent: 120, rotate: 8 }, { yPercent: 0, rotate: 0, stagger: 0.02, ease: 'power3.out' }, 0)
        .fromTo('.cta-btn-wrap', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(1.6)' }, 0.4)
        .fromTo('.cta-orb', { scale: 0.6 }, { scale: 1.1 }, 0)

      gsap.fromTo('.cta-line-l', { xPercent: -30 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.cta-line-r', { xPercent: 30 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="force-dark relative overflow-hidden py-[clamp(7rem,18vw,15rem)]">
      {/* Animated gradient light */}
      <div className="cta-orb pointer-events-none absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-[20%] top-[25%] h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,255,46,0.28),transparent_65%)] [animation:blob_14s_ease-in-out_infinite]" />
        <div className="absolute left-[35%] top-[30%] h-[45%] w-[45%] rounded-full bg-[radial-gradient(circle,rgba(120,160,255,0.16),transparent_65%)] [animation:blob_18s_ease-in-out_infinite_reverse]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_80%)]" />

      <div className="text-outline-faint cta-line-l pointer-events-none absolute top-[8%] whitespace-nowrap font-display text-[18vw] leading-none opacity-60" aria-hidden="true">
        FIT UP FIT UP
      </div>
      <div className="text-outline-faint cta-line-r pointer-events-none absolute bottom-[6%] right-0 whitespace-nowrap font-display text-[18vw] leading-none opacity-60" aria-hidden="true">
        A WHOLE NEW LIFESTYLE
      </div>

      <div className="container-x relative flex flex-col items-center text-center">
        <p className="label mb-8 text-accent-ink">
          <span className="text-muted">(11)</span> Your move
        </p>
        <h2 className="font-display text-[clamp(3.4rem,11.5vw,12rem)] leading-[0.88]">
          <span className="block overflow-hidden">
            <SplitText text="READY TO GET" charClassName="cta-char" />
          </span>
          <span className="block overflow-hidden">
            <SplitText text="STRONGER?" charClassName="cta-char text-accent" />
          </span>
        </h2>

        <div className="cta-btn-wrap mt-14 md:mt-16">
          <button
            ref={btnRef}
            type="button"
            data-cursor="cta"
            onClick={() => scrollToTarget('#membership')}
            className="group relative inline-flex items-center gap-5 rounded-full bg-accent py-3 pl-9 pr-3 text-on-accent shadow-[0_0_0_0_rgba(200,255,46,0.4),0_20px_60px_-20px_rgba(200,255,46,0.6)] transition-[scale,box-shadow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.08] hover:shadow-[0_0_0_14px_rgba(200,255,46,0.12),0_30px_120px_-10px_rgba(200,255,46,0.85)] md:py-4 md:pl-12 md:pr-4"
          >
            <span className="cta-label font-display text-[clamp(1.4rem,3vw,2.4rem)] tracking-wide transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-x-1">
              Join FIT UP
            </span>
            <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-on-accent text-accent md:h-16 md:w-16">
              <ArrowRight size={24} className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[180%]" />
              <ArrowRight size={24} className="absolute -translate-x-[180%] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent/60 [animation:ping_2.4s_cubic-bezier(0,0,.2,1)_infinite] group-hover:[animation-play-state:paused]" />
          </button>
        </div>
        <p className="label mt-10 text-muted">First session on us · No commitment</p>
      </div>
    </section>
  )
}
