import { useRef } from 'react'
import { gsap, useGSAP } from '../utils/gsap'
import { STATS } from '../utils/content'

const MARQUEE = ['Discipline', 'Strength', 'Consistency', 'Power', 'Recovery', 'Grit']
const format = (n) => Math.round(n).toLocaleString('en-IN')

export default function Stats() {
  const ref = useRef(null)

  useGSAP(
    () => {
      // Count-up from 0 each time the grid enters the viewport (resets when scrolled back above).
      gsap.utils.toArray('.stat', ref.current).forEach((stat, i) => {
        const valueEl = stat.querySelector('.stat-value')
        const target = Number(valueEl.dataset.value)
        const counter = { v: 0 }
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
        })
        tl.fromTo(stat.querySelector('.stat-rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 0)
          .fromTo(stat.querySelector('.stat-inner'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1 }, 0.05)
          .to(
            counter,
            {
              v: target,
              duration: 2.2,
              ease: 'power4.out',
              onUpdate: () => {
                valueEl.textContent = format(counter.v)
              },
            },
            0.1,
          )
        tl.delay(i * 0.12)

        gsap.timeline({
          scrollTrigger: {
            trigger: ref.current.querySelector('.stats-grid'),
            start: 'top 80%',
            onEnter: () => tl.restart(true),
            onLeaveBack: () => {
              tl.pause(0)
              valueEl.textContent = '0'
            },
          },
        })
      })

      // Marquee rows scrub horizontally in opposite directions.
      gsap.fromTo('.marquee-a', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.marquee-b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.stats-glow', { xPercent: -30, opacity: 0.3 }, { xPercent: 30, opacity: 0.9, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    },
    { scope: ref },
  )

  return (
    <section id="trainers" ref={ref} className="force-dark relative overflow-hidden py-[clamp(5rem,12vw,10rem)]">
      <div className="stats-glow pointer-events-none absolute left-1/4 top-1/2 h-[60vmax] w-[60vmax] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,255,46,0.12),transparent_60%)]" />

      <div className="marquee-a mb-16 flex whitespace-nowrap font-display text-[clamp(3.5rem,11vw,10rem)] leading-none md:mb-24" aria-hidden="true">
        {[...MARQUEE, ...MARQUEE].map((w, i) => (
          <span key={i} className={`mr-[0.3em] ${i % 2 ? 'text-outline-faint' : 'text-fg/90'}`}>
            {w}
            <span className="ml-[0.3em] text-accent">•</span>
          </span>
        ))}
      </div>

      <div className="container-x relative">
        <div className="mb-12 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end">
          <p className="label text-accent-ink">
            <span className="text-muted">(06)</span> The numbers behind the iron
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
            85+ certified coaches. One standard: results you can measure.
          </p>
        </div>

        <div className="stats-grid grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat-rule mb-6 block h-px origin-left bg-line" />
              <div className="overflow-hidden">
                <div className="stat-inner">
                  <div className="font-display text-[clamp(3rem,8vw,7.5rem)] tabular-nums">
                    <span className="stat-value" data-value={s.value}>
                      0
                    </span>
                    <span className="text-accent">{s.suffix}</span>
                  </div>
                  <div className="label mt-3 text-muted">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-b mt-20 flex whitespace-nowrap font-display text-[clamp(2.5rem,7vw,6rem)] leading-none md:mt-28" aria-hidden="true">
        {[...MARQUEE, ...MARQUEE].reverse().map((w, i) => (
          <span key={i} className={`mr-[0.4em] ${i % 2 ? 'text-fg/80' : 'text-outline-faint'}`}>
            {w}
          </span>
        ))}
      </div>
    </section>
  )
}
