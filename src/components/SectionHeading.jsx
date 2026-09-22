import { useRef } from 'react'
import { gsap, useGSAP } from '../utils/gsap'

/**
 * Editorial section heading: eyebrow label + multi-line display title.
 * Each line is revealed with a clip-path wipe plus a slide from below, and
 * the divider line draws in — all scrubbed lightly to the scroll position.
 */
export default function SectionHeading({ index, eyebrow, lines, align = 'left', className = '', children }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 45%', scrub: 0.8 },
      })
      tl.from('.sh-rule', { scaleX: 0, transformOrigin: align === 'center' ? 'center' : 'left', ease: 'none' }, 0)
        .from('.sh-eyebrow', { yPercent: 100, opacity: 0, ease: 'none' }, 0)
        .fromTo(
          '.sh-line',
          { yPercent: 105, clipPath: 'inset(0% 0% 100% 0%)', skewY: 4 },
          { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', skewY: 0, stagger: 0.12, ease: 'none' },
          0,
        )
      if (ref.current.querySelector('.sh-body')) tl.from('.sh-body', { y: 30, opacity: 0, ease: 'none' }, 0.2)
    },
    { scope: ref },
  )

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div ref={ref} className={`flex flex-col ${alignClass} ${className}`}>
      <div className={`mb-6 flex w-full items-center gap-4 overflow-hidden ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="sh-eyebrow label text-accent-ink">
          {index && <span className="mr-3 text-muted">({index})</span>}
          {eyebrow}
        </span>
        <span className="sh-rule h-px flex-1 bg-line max-w-[240px]" />
      </div>
      <h2 className="font-display text-[clamp(2.9rem,9vw,8.5rem)]">
        {lines.map((line, i) => (
          <span key={i} className="mask-line">
            <span className="sh-line block will-change-transform">{line}</span>
          </span>
        ))}
      </h2>
      {children && <div className="sh-body mt-8">{children}</div>}
    </div>
  )
}
