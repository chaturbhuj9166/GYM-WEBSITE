import { useRef } from 'react'
import { Quote, Star } from 'lucide-react'
import { gsap, useGSAP } from '../utils/gsap'
import { TESTIMONIALS } from '../utils/content'
import SectionHeading from '../components/SectionHeading'

/**
 * Three cards that drift horizontally with the pointer at different depths
 * (quickTo on an inner layer so it never fights the scroll-in animation).
 */
export default function Testimonials() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray('.testi', ref.current)

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 120 + i * 50, opacity: 0, rotate: (i - 1) * 4 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: ref.current.querySelector('.testi-grid'), start: 'top 95%', end: 'top 45%', scrub: 1 },
          },
        )
      })

      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const movers = cards.map((card) => {
        const inner = card.querySelector('.testi-inner')
        return {
          depth: Number(card.dataset.depth),
          x: gsap.quickTo(inner, 'x', { duration: 1.1, ease: 'power3.out' }),
          r: gsap.quickTo(inner, 'rotate', { duration: 1.1, ease: 'power3.out' }),
        }
      })
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5
        movers.forEach((m) => {
          m.x(nx * 60 * m.depth)
          m.r(nx * 2.5 * m.depth)
        })
      }
      const section = ref.current
      const onLeave = () => movers.forEach((m) => (m.x(0), m.r(0)))
      section.addEventListener('pointermove', onMove)
      section.addEventListener('pointerleave', onLeave)
      return () => {
        section.removeEventListener('pointermove', onMove)
        section.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative overflow-hidden bg-bg-2 py-[clamp(6rem,14vw,12rem)]">
      <div className="container-x">
        <SectionHeading index="10" eyebrow="Voices from the floor" lines={['Real people.', 'Real iron.']} className="mb-16 md:mb-24" />

        <div className="testi-grid grid gap-6 md:grid-cols-3 md:gap-7">
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.name} data-depth={t.depth} className={`testi ${i === 1 ? 'md:mt-16' : ''} ${i === 2 ? 'md:mt-6' : ''}`}>
              <div className="testi-inner group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-bg p-7 shadow-[var(--shadow)] transition-[border-color] duration-500 hover:border-[color-mix(in_srgb,var(--accent-ink)_50%,transparent)] md:p-9">
                <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_25%,transparent),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <Quote size={34} className="text-accent-ink" strokeWidth={1.5} />
                  <div className="flex gap-1 text-accent-ink">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={13} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-8 flex-1 font-display text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.02]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4 border-t border-line pt-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-fg font-display text-lg text-bg">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold uppercase tracking-[0.12em]">— {t.name}</span>
                    <span className="label mt-1 block text-[0.6rem] text-muted">{t.role}</span>
                  </span>
                  <span className="label hidden rounded-full border border-line px-3 py-1.5 text-[0.58rem] text-accent-ink xl:block">
                    {t.result}
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
