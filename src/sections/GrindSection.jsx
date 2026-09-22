import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { IMAGES } from '../utils/images'
import SmartImage from '../components/SmartImage'
import SplitText from '../components/SplitText'
import Dumbbell3D, { createDumbbellControls } from '../components/Dumbbell3D'

const MANTRA = ['6 Days.', '1 Mindset.', 'Zero Excuses.']

/**
 * Full-screen pinned beat: the background pushes in, the heading scales up,
 * the overlay darkens, the mantra lines stamp in and a dumbbell tumbles
 * straight through the frame — all scrubbed to scroll.
 */
export default function GrindSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const dumbbell = useRef(createDumbbellControls({ x: 2.2, y: 0.4, rotZ: 0.5, rotX: 0.3, scale: 0.75 }))

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isMobile: MQ.mobile, isDesktop: MQ.notMobile }, (ctx) => {
        const { isMobile } = ctx.conditions
        const d = dumbbell.current
        Object.assign(d, { x: 2.2, y: isMobile ? 0.5 : 0.4, rotZ: 0.5, rotX: 0.3, rotY: 0, scale: isMobile ? 0.9 : 0.75, z: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: isMobile ? '+=200%' : '+=260%',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        tl.fromTo('.grind-bg', { scale: 1 }, { scale: 1.35, duration: 4 }, 0)
          .fromTo('.grind-overlay', { opacity: 0.35 }, { opacity: 0.88, duration: 4 }, 0)
          .fromTo('.grind-heading', { scale: 0.72 }, { scale: 1.08, duration: 4 }, 0)
          .fromTo('.grind-char', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.6, ease: 'power3.out' }, 0)
          // Dumbbell passes through the screen: right → left, spinning.
          .to(d, { x: -2.3, rotZ: -2.4, rotY: 1.8, y: isMobile ? 0.35 : -0.15, z: 2.5, duration: 2.4, ease: 'power1.inOut' }, 0.6)
          .fromTo('.grind-streak', { xPercent: 120, opacity: 0 }, { xPercent: -120, opacity: 1, duration: 2.4, ease: 'power1.inOut' }, 0.6)
          .to('.grind-heading', { opacity: 0.12, filter: 'blur(4px)', duration: 0.8 }, 2.4)

        gsap.utils.toArray('.grind-line', stageRef.current).forEach((line, i) => {
          tl.fromTo(
            line,
            { yPercent: 120, skewY: 6, opacity: 0 },
            { yPercent: 0, skewY: 0, opacity: 1, duration: 0.6, ease: 'power4.out' },
            2.5 + i * 0.35,
          )
        })
        tl.fromTo('.grind-foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 3.5)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative" aria-label="The grind never stops">
      <div ref={stageRef} className="force-dark relative h-[100svh] overflow-hidden">
        <div className="grind-bg absolute inset-0 will-change-transform">
          <SmartImage id={IMAGES.grind} alt="Athlete training on a cable machine in low light" sizes="100vw" className="h-full w-full" imgClassName="grayscale contrast-125 brightness-75" />
        </div>
        <div className="grind-overlay absolute inset-0 bg-black" />
        {/* Animated lighting: flickering top light + sweeping lime beam */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.22),transparent_65%)] [animation:flicker_6s_infinite]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(200,255,46,0.1),transparent)] [animation:sweep_7s_cubic-bezier(.65,0,.35,1)_infinite]" />
        </div>
        <div className="grind-streak pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] bg-[linear-gradient(90deg,transparent,#c8ff2e,transparent)] opacity-0 blur-[1px]" />

        <Dumbbell3D controls={dumbbell} fit={0.45} className="absolute inset-0 z-[5]" />

        <div className="container-x relative z-10 flex h-full flex-col items-center justify-center text-center">
          <p className="label mb-6 text-accent-ink">
            <span className="text-muted">(08)</span> The grind
          </p>
          <h2 className="grind-heading font-display text-[clamp(3.4rem,12vw,12.5rem)] leading-[0.86] will-change-transform">
            <span className="block overflow-hidden">
              <SplitText text="THE GRIND" charClassName="grind-char" />
            </span>
            <span className="block overflow-hidden">
              <SplitText text="NEVER STOPS." charClassName="grind-char text-accent" />
            </span>
          </h2>

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4">
            {MANTRA.map((line) => (
              <div key={line} className="overflow-hidden">
                <p className="grind-line font-display text-[clamp(2.8rem,9vw,8rem)] leading-[0.95] opacity-0">
                  {line}
                </p>
              </div>
            ))}
          </div>

          <p className="grind-foot label absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-muted opacity-0">
            Mon — Sat · 05:00 — 23:00
          </p>
        </div>
      </div>
    </section>
  )
}
