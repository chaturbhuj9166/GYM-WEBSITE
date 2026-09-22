import { useCallback, useRef, useState } from 'react'
import { ScrollTrigger, gsap, useGSAP } from '../utils/gsap'
import { getLenis, scrollToTarget } from '../utils/lenis'
import { NAV_LINKS } from '../utils/content'
import { useAppReady } from '../hooks/useAppReady'
import ThemeToggle from './ThemeToggle'
import MagneticButton from './MagneticButton'
import SocialIcons from './SocialIcons'

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 34 20" className="h-[14px] w-auto" aria-hidden="true">
        <rect x="0" y="3" width="5" height="14" rx="1.5" fill="var(--accent)" />
        <rect x="29" y="3" width="5" height="14" rx="1.5" fill="var(--accent)" />
        <rect x="5.5" y="6" width="3.5" height="8" rx="1" fill="currentColor" />
        <rect x="25" y="6" width="3.5" height="8" rx="1" fill="currentColor" />
        <rect x="9" y="8.8" width="16" height="2.4" fill="currentColor" />
      </svg>
      <span className="font-display text-[1.35rem] leading-none tracking-[0.02em]">FIT UP</span>
    </span>
  )
}

/**
 * Fixed navbar. Transparent over the hero; once the page scrolls it gains a
 * blurred glass panel (slides down) and the content tightens (translateY),
 * keeping all motion on transform/opacity. Mobile opens a full-screen menu
 * with a circular clip-path reveal.
 */
export default function Navbar({ theme, onToggleTheme }) {
  const ready = useAppReady()
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const menuTl = useRef(null)
  const [open, setOpen] = useState(false)

  // Intro + scrolled state.
  useGSAP(
    () => {
      if (!ready) return
      gsap.from('.nav-item', { yPercent: -120, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out', delay: 0.35 })

      let scrolled = false
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const next = self.scroll() > 60
          if (next !== scrolled) {
            scrolled = next
            navRef.current.dataset.scrolled = String(next)
          }
        },
      })
    },
    { scope: navRef, dependencies: [ready] },
  )

  // Mobile menu timeline (built once, played/reversed).
  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      tl.set(menuRef.current, { visibility: 'visible' })
        .fromTo(
          menuRef.current,
          { clipPath: 'circle(0% at calc(100% - 40px) 40px)' },
          { clipPath: 'circle(150% at calc(100% - 40px) 40px)', duration: 0.9 },
        )
        .fromTo(
          '.menu-link',
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' },
          0.35,
        )
        .fromTo('.menu-meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.6)
      menuTl.current = tl
    },
    { scope: menuRef },
  )

  const openRef = useRef(false)
  const toggleMenu = useCallback((force) => {
    const next = typeof force === 'boolean' ? force : !openRef.current
    if (next === openRef.current) return
    openRef.current = next
    setOpen(next)
    const tl = menuTl.current
    if (next) {
      getLenis()?.stop()
      tl?.timeScale(1).play()
    } else {
      getLenis()?.start()
      tl?.timeScale(1.6).reverse()
    }
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    if (open) {
      toggleMenu(false)
      window.setTimeout(() => scrollToTarget(href), 450)
    } else {
      scrollToTarget(href)
    }
  }

  return (
    <>
      <header
        ref={navRef}
        data-scrolled="false"
        data-menu={open ? 'open' : 'closed'}
        className="nav-root pointer-events-none fixed inset-x-0 top-0 z-[100] text-fg"
      >
        <style>{`
          .nav-glass { transform: translateY(-101%); opacity: 0; transition: transform .7s cubic-bezier(.22,1,.36,1), opacity .5s ease; }
          .nav-row { transform: translateY(0); transition: transform .7s cubic-bezier(.22,1,.36,1); }
          [data-scrolled='true'] .nav-glass { transform: translateY(0); opacity: 1; }
          [data-scrolled='true'] .nav-row { transform: translateY(-14px); }
          [data-menu='open'] .nav-glass { transform: translateY(-101%); opacity: 0; }
        `}</style>
        {/* Glass panel is a separate layer so the bar "shrinks" with transforms only. */}
        <div className="nav-glass absolute inset-x-0 top-0 h-[70px] border-b border-line bg-[var(--glass)] backdrop-blur-xl backdrop-saturate-150" />

        <nav className="nav-row container-x relative flex h-[98px] items-center justify-between" aria-label="Primary">
          <a
            href="#home"
            onClick={(e) => go(e, '#home')}
            className="nav-item pointer-events-auto text-fg"
            data-cursor="button"
            aria-label="Fit Up Fitness Lifestyle home"
          >
            <Logo />
          </a>

          <ul className="pointer-events-auto hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="nav-item">
                <a href={link.href} onClick={(e) => go(e, link.href)} className="link-u label text-[0.7rem] text-fg">
                  <span className="roll">
                    <span>{link.label}</span>
                    <span aria-hidden="true">{link.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="pointer-events-auto flex items-center gap-3">
            <div className="nav-item">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
            <div className="nav-item hidden md:block">
              <MagneticButton href="#membership" className="!py-2.5 !pl-5 !pr-2">
                Join Now
              </MagneticButton>
            </div>
            <button
              type="button"
              onClick={() => toggleMenu()}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              data-cursor="button"
              className="nav-item relative grid h-11 w-11 place-items-center rounded-full border border-line bg-surface backdrop-blur-md lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] ${open ? 'top-[5px] rotate-45' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] bg-fg transition-all duration-500 ease-[cubic-bezier(.65,0,.35,1)] ${open ? 'top-[5px] w-full -rotate-45' : 'top-[10px] w-3/5'}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <div
        ref={menuRef}
        className="force-dark invisible fixed inset-0 z-[95] flex flex-col overflow-hidden lg:hidden"
        style={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
        aria-hidden={!open}
      >
        <div className="pointer-events-none absolute -right-1/4 -top-1/4 h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(200,255,46,0.16),transparent_60%)]" />
        <div className="container-x flex flex-1 flex-col justify-center pt-24">
          <span className="menu-meta label mb-6 text-accent-ink">Navigate</span>
          <ul className="space-y-1">
            {[...NAV_LINKS, { label: 'Join Now', href: '#membership' }].map((link, i) => (
              <li key={link.label} className="mask-line">
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  tabIndex={open ? 0 : -1}
                  className="menu-link group flex items-baseline gap-4 font-display text-[clamp(2.8rem,13vw,6rem)] text-fg"
                >
                  <span className="label text-[0.65rem] text-muted">0{i + 1}</span>
                  <span className="transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-accent">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-x menu-meta flex flex-wrap items-center justify-between gap-4 pb-8">
          <span className="label text-muted">A whole new lifestyle.</span>
          <SocialIcons />
        </div>
      </div>
    </>
  )
}
