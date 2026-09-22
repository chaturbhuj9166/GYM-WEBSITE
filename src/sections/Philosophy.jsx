import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { IMAGES } from '../utils/images'
import SmartImage from '../components/SmartImage'

// Each line drifts horizontally a different distance; each word has its own
// vertical travel, so the statement "breathes" apart and locks together.
const LINES = [
  { words: [{ t: 'YOUR', dy: 40 }, { t: 'BODY', dy: -30 }], from: 22, to: -4, className: '' },
  { words: [{ t: 'CAN', dy: -50 }, { t: 'GO', dy: 60 }], from: -28, to: 10, className: 'md:pl-[14vw]' },
  { words: [{ t: 'FURTHER.', dy: 30, accent: true }], from: 34, to: 2, className: '' },
]

export default function Philosophy() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isMobile: MQ.mobile, isDesktop: MQ.notMobile }, (ctx) => {
        const { isMobile } = ctx.conditions
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: isMobile ? '+=170%' : '+=230%',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        // Background photo travels the opposite way to the type.
        tl.fromTo('.philo-bg', { xPercent: -8, scale: 1.25 }, { xPercent: 8, scale: 1.1, duration: 3 }, 0)

        // Lines slide horizontally at different rates.
        gsap.utils.toArray('.philo-line', stageRef.current).forEach((line, i) => {
          const cfg = LINES[i]
          const factor = isMobile ? 0.5 : 1
          tl.fromTo(line, { xPercent: cfg.from * factor }, { xPercent: cfg.to * factor, duration: 3 }, 0)
        })

        // Words reveal one at a time: blur → sharp, 0.8 → 1, faint → solid.
        gsap.utils.toArray('.philo-word', stageRef.current).forEach((word, i) => {
          const dy = Number(word.dataset.dy) * (isMobile ? 0.5 : 1)
          tl.fromTo(
            word,
            { opacity: 0.06, scale: 0.8, y: dy, filter: isMobile ? 'blur(4px)' : 'blur(14px)' },
            { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
            0.15 + i * 0.36,
          )
        })

        // FURTHER. letters scale up individually and the lime fill wipes in.
        tl.fromTo('.philo-char', { scale: 0.8, yPercent: 12 }, { scale: 1, yPercent: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, 1.9)
          .fromTo('.philo-fill', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 2.2)
          .fromTo('.philo-aside', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 2.3)
          .to('.philo-shade', { opacity: 0.35, duration: 1 }, 2)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="about" ref={sectionRef} className="relative" aria-label="Training philosophy">
      <div ref={stageRef} className="relative flex h-[100svh] flex-col justify-center overflow-hidden bg-bg">
        {/* Background photo moving opposite to the text */}
        <div className="philo-bg pointer-events-none absolute inset-y-0 -inset-x-[12%] will-change-transform">
          <SmartImage
            id={IMAGES.philosophy}
            alt=""
            sizes="120vw"
            className="h-full w-full !bg-transparent"
            imgClassName="grayscale contrast-125 opacity-[0.22] [[data-theme=dark]_&]:opacity-[0.3]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_85%)]" />
        <div className="philo-shade pointer-events-none absolute inset-0 bg-bg opacity-0" />

        <div className="container-x relative">
          <p className="label mb-8 flex items-center gap-4 text-accent-ink md:mb-12">
            <span className="text-muted">(04)</span> Training philosophy
            <span className="h-px w-24 bg-line" />
          </p>

          <h2 className="font-display text-[clamp(3.6rem,15.5vw,16.5rem)] leading-[0.86]">
            {LINES.map((line, li) => (
              <span key={li} className={`philo-line block whitespace-nowrap will-change-transform ${line.className}`}>
                {line.words.map((w, wi) => (
                  <span key={wi} data-dy={w.dy} className="philo-word mr-[0.18em] inline-block will-change-transform">
                    {w.accent ? (
                      <span className="relative inline-block">
                        <span className="text-outline" aria-hidden="true">
                          {w.t.split('').map((ch, ci) => (
                            <span key={ci} className="philo-char inline-block origin-bottom">
                              {ch}
                            </span>
                          ))}
                        </span>
                        <span className="philo-fill absolute inset-0 text-accent-ink" style={{ clipPath: 'inset(0% 100% 0% 0%)' }}>
                          {w.t}
                        </span>
                      </span>
                    ) : (
                      w.t
                    )}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
            <p className="philo-aside max-w-md text-base leading-relaxed text-muted md:text-lg">
              We don&apos;t sell shortcuts. We build athletes — through structure, elite coaching and relentless
              consistency. <span className="text-fg">Your ceiling is higher than you think.</span>
            </p>
            <div className="philo-aside flex gap-10">
              <div>
                <div className="font-display text-4xl md:text-5xl">10</div>
                <div className="label mt-1 text-muted">Years forging</div>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl">24/7</div>
                <div className="label mt-1 text-muted">Open floor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
