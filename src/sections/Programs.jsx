import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { PROGRAMS } from '../utils/content'
import { useTilt } from '../hooks/useTilt'
import SmartImage from '../components/SmartImage'
import SectionHeading from '../components/SectionHeading'

/**
 * Hover: scale + 3D tilt toward the pointer (useTilt), image zooms and drifts
 * opposite the pointer via --mx/--my, border glows, title rises, arrow turns.
 */
function ProgramCard({ program }) {
  const ref = useRef(null)
  useTilt(ref, { max: 7, scale: 1.02 })

  return (
    <a
      ref={ref}
      href="#membership"
      data-cursor="view"
      className="program-card group relative block aspect-[4/5] overflow-hidden rounded-[22px] border border-line bg-[#111] shadow-[var(--shadow)] [--mx:0.5] [--my:0.5] sm:aspect-[5/6] lg:aspect-[4/5]"
    >
      {/* Image layer: zooms on hover, drifts against the pointer */}
      <div
        className="absolute -inset-[6%] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.12]"
        style={{ translate: 'calc((var(--mx) - 0.5) * -28px) calc((var(--my) - 0.5) * -28px)' }}
      >
        <div className="program-img h-full w-full will-change-transform">
          <SmartImage
            id={program.image}
            alt={`${program.title} training`}
            sizes="(min-width:1024px) 45vw, 100vw"
            className="h-full w-full"
            imgClassName="grayscale-[0.55] transition-[filter] duration-700 group-hover:grayscale-0"
          />
        </div>
      </div>

      {/* Overlays: base shade + lime tint that appears on hover + pointer spotlight */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-700 group-hover:opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(200deg,rgba(200,255,46,0.28),transparent_45%)] opacity-0 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100" />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at calc(var(--mx) * 100%) calc(var(--my) * 100%), rgba(255,255,255,0.14), transparent 60%)',
        }}
      />
      {/* Glowing border */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] border border-transparent transition-[border-color,box-shadow] duration-700 group-hover:border-[rgba(200,255,46,0.7)] group-hover:shadow-[inset_0_0_40px_rgba(200,255,46,0.18),0_0_50px_-10px_rgba(200,255,46,0.45)]" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-8" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between">
          <span className="label text-white/70">{program.number} / 04</span>
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/20 backdrop-blur-md transition-[background-color,border-color,color,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45 group-hover:border-[#c8ff2e] group-hover:bg-[#c8ff2e] group-hover:text-black">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-3">
          <span className="label mb-3 block text-[#c8ff2e]">{program.meta}</span>
          <h3 className="font-display text-[clamp(2.8rem,6vw,5.6rem)]">{program.title}</h3>
          <p className="mt-2 max-w-xs text-base text-white/75 transition-colors duration-500 group-hover:text-white md:text-lg">
            {program.tagline}
          </p>
          <span className="mt-5 block h-px w-full origin-left scale-x-0 bg-white/40 transition-transform duration-700 group-hover:scale-x-100" />
        </div>
      </div>
    </a>
  )
}

export default function Programs() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isMobile: MQ.mobile, isDesktop: MQ.notMobile }, (ctx) => {
        const { isMobile } = ctx.conditions
        // Cards rise out of depth with a 3D tip, scrubbed so they settle as you scroll.
        gsap.utils.toArray('.program-wrap', ref.current).forEach((card) => {
          gsap.fromTo(
            card,
            { y: isMobile ? 80 : 160, rotateX: isMobile ? 10 : 24, opacity: 0, transformPerspective: 1200, transformOrigin: '50% 100%' },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 55%', scrub: 0.8 },
            },
          )
          // Offset parallax: alternate columns move at different speeds.
          if (!isMobile) {
            gsap.fromTo(
              card.querySelector('.program-img'),
              { yPercent: -6 },
              { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
            )
          }
        })
      })
    },
    { scope: ref },
  )

  return (
    <section id="programs" ref={ref} className="relative bg-bg py-[clamp(6rem,14vw,12rem)]">
      <div className="container-x">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="05" eyebrow="Programs" lines={['Train with', 'intent.']} />
          <p className="max-w-sm text-base leading-relaxed text-muted md:text-lg">
            Four disciplines. One system. Every program is periodised, coached and tracked — so every session moves you
            forward.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-7">
          {PROGRAMS.map((program, i) => (
            <div key={program.title} className={`program-wrap ${i % 2 === 1 ? 'md:translate-y-24' : ''}`}>
              <ProgramCard program={program} />
            </div>
          ))}
        </div>
        <div className="hidden h-24 md:block" />
      </div>
    </section>
  )
}
