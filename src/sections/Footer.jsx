import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { gsap, useGSAP } from '../utils/gsap'
import { FOOTER_LINKS } from '../utils/content'
import { scrollToTarget } from '../utils/lenis'
import { Logo } from '../components/Navbar'
import SocialIcons from '../components/SocialIcons'

export default function Footer() {
  const ref = useRef(null)

  useGSAP(
    () => {
      // Giant wordmark rises letter by letter as the footer comes up.
      gsap.fromTo(
        '.footer-char',
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', end: 'bottom bottom', scrub: 1 },
        },
      )
    },
    { scope: ref },
  )

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-bg pt-20 md:pt-28">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-fg" />
            <p className="mt-6 font-display text-[clamp(2.4rem,5vw,4rem)]">
              Build <span className="text-accent-ink">yourself.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm text-muted">Gym / Physical Fitness Center · Fitness · Gym · Yoga · HIIT · Zumba · Personal Training</p>
            <a href="tel:+919166423954" data-cursor="button" className="link-u label mt-3 inline-block text-[0.75rem] text-fg">
              +91 9166423954
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="label mb-5 text-muted">Explore</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(l.href)
                    }}
                    className="link-u label text-[0.75rem] text-fg"
                  >
                    <span className="roll">
                      <span>{l.label}</span>
                      <span aria-hidden="true">{l.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-8 md:items-end">
            <div className="md:text-right">
              <p className="label mb-5 text-muted">Follow the grind</p>
              <SocialIcons />
            </div>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              data-cursor="button"
              className="group label flex items-center gap-3 text-fg"
            >
              Back to top
              <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-[background-color,color,border-color] duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                <ArrowUp size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line py-6 text-muted sm:flex-row sm:justify-between">
          <span className="label text-[0.6rem]">© {new Date().getFullYear()} Chaturbhuj Joshi. All rights reserved.</span>
          <span className="label text-[0.6rem]">A whole new lifestyle.</span>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden px-2 leading-[0.78]" aria-hidden="true">
        <div className="text-center font-display text-[24.5vw] text-fg/[0.06]">
          {'FIT UP'.split('').map((c, i) => (
            <span key={i} className="footer-char inline-block">
              {c}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
