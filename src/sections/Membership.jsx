import { useRef } from 'react'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { FEATURES, PLANS } from '../utils/content'
import { useTilt } from '../hooks/useTilt'
import SectionHeading from '../components/SectionHeading'
import MagneticButton from '../components/MagneticButton'

const formatINR = (n) => n.toLocaleString('en-IN')

function PlanCard({ plan }) {
  const ref = useRef(null)
  useTilt(ref, { max: 4, scale: 1 })
  const featured = plan.featured

  return (
    <div className="plan-wrap">
      <article
        ref={ref}
        className={`plan group relative flex h-full flex-col overflow-hidden rounded-[26px] border p-7 transition-[translate,box-shadow,border-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-3 md:p-9 ${
          featured
            ? 'force-dark border-transparent shadow-[0_40px_120px_-40px_rgba(200,255,46,0.45)]'
            : 'border-line bg-surface shadow-[var(--shadow)] hover:border-[color-mix(in_srgb,var(--accent-ink)_60%,transparent)]'
        }`}
      >
        {featured && <span className="glow-border" />}
        {/* Moving gradient layer (transform-only, drifts on hover) */}
        <div
          className={`pointer-events-none absolute -inset-1/2 transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[18%] group-hover:translate-y-[-12%] group-hover:rotate-12 ${
            featured
              ? 'bg-[radial-gradient(circle_at_30%_30%,rgba(200,255,46,0.22),transparent_40%)]'
              : 'bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_38%)] opacity-0 group-hover:opacity-100'
          }`}
        />
        {/* Giant level numeral */}
        <span className="text-outline-faint pointer-events-none absolute -right-4 -top-8 font-display text-[11rem] leading-none transition-transform duration-1000 group-hover:-translate-x-4 group-hover:translate-y-3">
          {plan.level}
        </span>

        <div className="relative flex items-center justify-between">
          <span className="label text-muted">Level {plan.level}</span>
          {featured && (
            <span className="label rounded-full bg-accent px-3 py-1.5 text-[0.6rem] text-on-accent">Most chosen</span>
          )}
        </div>

        <h3 className="relative mt-8 font-display text-[clamp(2.8rem,5vw,4.2rem)]">{plan.name}</h3>
        <p className="relative mt-2 text-sm text-muted">{plan.blurb}</p>

        <div className="relative mt-8 flex items-end gap-2 border-b border-line pb-8">
          <span className="plan-price inline-block origin-left font-display text-[clamp(3.2rem,6vw,5rem)] leading-none transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110">
            <span className="mr-1 align-top text-[0.45em] text-accent-ink">₹</span>
            {formatINR(plan.price)}
          </span>
          <span className="label mb-2 text-muted">/ month</span>
        </div>

        <ul className="relative mt-8 flex-1 space-y-4">
          {FEATURES.map((f, i) => {
            const on = plan.included[i]
            return (
              <li key={f} className={`flex items-center gap-3 text-sm md:text-[0.95rem] ${on ? 'text-fg' : 'text-muted/60 line-through decoration-1'}`}>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                    on ? 'bg-accent text-on-accent' : 'border border-line text-muted'
                  }`}
                >
                  {on ? <Check size={13} strokeWidth={3} /> : <Minus size={12} />}
                </span>
                {f}
              </li>
            )
          })}
        </ul>

        <div className="relative mt-10">
          <MagneticButton
            href="#contact"
            variant={featured ? 'primary' : 'ghost'}
            icon={ArrowRight}
            className="w-full !justify-between"
            strength={0.15}
          >
            Choose {plan.name}
          </MagneticButton>
        </div>
      </article>
    </div>
  )
}

export default function Membership() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isDesktop: MQ.desktop, isSmaller: '(max-width: 1023px)' }, (ctx) => {
        const cards = gsap.utils.toArray('.plan-wrap', ref.current)
        if (ctx.conditions.isDesktop) {
          // Cards fan out of a stack in 3D as the grid scrolls into view.
          gsap.fromTo(
            cards,
            {
              xPercent: (i) => [100, 0, -100][i],
              rotateY: (i) => [-35, 0, 35][i],
              z: -300,
              opacity: 0,
              transformPerspective: 1400,
            },
            {
              xPercent: 0,
              rotateY: 0,
              z: 0,
              opacity: 1,
              ease: 'power2.out',
              stagger: 0.05,
              scrollTrigger: { trigger: '.plans-grid', start: 'top 90%', end: 'top 35%', scrub: 1 },
            },
          )
        } else {
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { y: 90, opacity: 0, rotateX: 12, transformPerspective: 1000 },
              { y: 0, opacity: 1, rotateX: 0, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 60%', scrub: 0.8 } },
            )
          })
        }
      })
    },
    { scope: ref },
  )

  return (
    <section id="membership" ref={ref} className="relative overflow-hidden bg-bg py-[clamp(6rem,14vw,12rem)]">
      <div className="pointer-events-none absolute left-1/2 top-[55%] h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_60%)]" />
      <div id="contact" className="container-x relative">
        <SectionHeading index="09" eyebrow="Membership" lines={['Choose', 'your level']} align="center" className="mb-16 md:mb-24">
          <p className="mx-auto max-w-md text-muted">No contracts. No hidden fees. Upgrade, pause or cancel any time.</p>
        </SectionHeading>

        <div className="plans-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7 [&>*:nth-child(3)]:md:col-span-2 [&>*:nth-child(3)]:lg:col-span-1">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
