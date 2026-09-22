import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { IMAGES, imgSrcSet, imgUrl } from '../utils/images'
import { useAppReady } from '../hooks/useAppReady'
import Dumbbell3D, { createDumbbellControls } from '../components/Dumbbell3D'
import Particles from '../components/Particles'
import SplitText from '../components/SplitText'
import MagneticButton from '../components/MagneticButton'

export default function Hero() {
  const ready = useAppReady()
  const sectionRef = useRef(null)
  // Starts off-screen right; the intro timeline flies it in.
  // Vertical placement is fixed up-front (the scroll exit animates y relative to it).
  const dumbbell = useRef(
    createDumbbellControls({
      x: 2.4,
      y: typeof window !== 'undefined' && window.matchMedia(MQ.compact).matches ? 0.34 : 0.16,
      rotY: -1.4,
      rotZ: 0.35,
      glow: 0.4,
    }),
  )

  // ---------------------------------------------------------------------------
  // 1) Load-in sequence (plays once the loader shutters open)
  // ---------------------------------------------------------------------------
  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add({ isCompact: MQ.compact, isDesktop: MQ.desktop }, (ctx) => {
        const { isCompact } = ctx.conditions
        const d = dumbbell.current
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

        // 1. Background slowly zooms in (settles from a wide push-in).
        tl.fromTo('.hero-bg-inner', { scale: 1.35 }, { scale: 1.06, duration: 2.8, ease: 'power2.out' }, 0)
          .fromTo('.hero-beams', { opacity: 0 }, { opacity: 1, duration: 2 }, 0.2)
          // 2 + 3. Heading rises from below and letters stagger into place.
          .fromTo(
            '.hero-char',
            { yPercent: 115, rotateX: -70, opacity: 0 },
            { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.3, stagger: 0.035 },
            0.15,
          )
          .fromTo('.hero-eyebrow', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1 }, 0.2)
          .fromTo('.hero-sub', { y: 24, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2 }, 0.75)
          // 4. CTA buttons reveal.
          .fromTo(
            '.hero-cta',
            { y: 30, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
            { y: 0, opacity: 1, clipPath: 'inset(-20% -20% -20% -20%)', duration: 1.1, stagger: 0.1 },
            0.9,
          )
          .fromTo('.hero-meta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 1.1)
          // 5 + 6. Giant dumbbell glides in from the right, rotating as it settles.
          .to(d, { x: isCompact ? 0.1 : 0.56, rotY: -0.42, rotZ: -0.16, duration: 2.4, ease: 'expo.out' }, 0.35)
          .to(d, { glow: 1.3, duration: 1.2, ease: 'power2.out' }, 1.2)
          // 7. A neon light passes across it.
          .fromTo(d, { sweep: -1.8 }, { sweep: 1.8, duration: 1.6, ease: 'power2.inOut' }, 1.35)
          .fromTo(d, { sweepPower: 0 }, { sweepPower: 1, duration: 0.5, ease: 'power1.out', yoyo: true, repeat: 1, repeatDelay: 0.6 }, 1.35)
          // 8. Scroll indicator starts moving.
          .fromTo('.hero-scroll', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1 }, 1.6)
      })
    },
    { scope: sectionRef, dependencies: [ready] },
  )

  // ---------------------------------------------------------------------------
  // 2) Scroll-scrubbed exit: background pushes in, copy lifts & blurs away,
  //    dumbbell tumbles up and out (drives y/rotX/scale/z/opacity only, so it
  //    never fights the intro tween which owns x/rotY/rotZ).
  // ---------------------------------------------------------------------------
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isMobile: MQ.mobile, isDesktop: MQ.notMobile }, (ctx) => {
        const { isMobile } = ctx.conditions
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        tl.to('.hero-bg', { scale: 1.22, yPercent: 14 }, 0)
          .to('.hero-content', { yPercent: -28, opacity: 0, filter: isMobile ? 'none' : 'blur(10px)' }, 0)
          .to('.hero-shade', { opacity: 1 }, 0)
          .to('.hero-scroll', { opacity: 0, y: 40, duration: 0.3 }, 0)
          .to(dumbbell.current, { y: '+=1.2', rotX: 1.1, scale: 1.3, z: 1.5 }, 0)
          .to(dumbbell.current, { opacity: 0, duration: 0.3 }, 0.7)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="home"
      ref={sectionRef}
      className="force-dark relative h-[100svh] min-h-[560px] overflow-hidden"
      aria-label="Introduction"
    >
      {/* Background photo (outer = scroll scale, inner = intro zoom) */}
      <div className="hero-bg absolute inset-0 will-change-transform">
        <div className="hero-bg-inner absolute inset-0 will-change-transform" style={{ transform: 'scale(1.35)' }}>
          <img
            src={imgUrl(IMAGES.hero, 1600)}
            srcSet={imgSrcSet(IMAGES.hero)}
            sizes="100vw"
            alt="Athlete gripping a loaded barbell in a dark gym"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[60%_center] opacity-70 [filter:grayscale(0.35)_contrast(1.15)_brightness(0.8)]"
          />
        </div>
      </div>

      {/* Cinematic grade: vignette, lime bloom, bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,transparent_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.95)_100%)]" />
      <div className="pointer-events-none absolute -right-[10%] top-[10%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(200,255,46,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--bg)] via-[color-mix(in_srgb,var(--bg)_60%,transparent)] to-transparent" />
      <div className="hero-shade pointer-events-none absolute inset-0 bg-[var(--bg)] opacity-0" />

      {/* Animated light beams */}
      <div className="hero-beams pointer-events-none absolute inset-0 overflow-hidden opacity-0" aria-hidden="true">
        <span className="beam left-[8%]" style={{ '--r': '22deg', animationDelay: '0s' }} />
        <span className="beam left-[38%]" style={{ '--r': '14deg', animationDelay: '-3s', animationDuration: '11s' }} />
        <span className="beam left-[70%] hidden md:block" style={{ '--r': '26deg', animationDelay: '-6s', animationDuration: '13s' }} />
      </div>

      <Particles className="absolute inset-0" count={70} />

      {/* Real-time 3D dumbbell */}
      <Dumbbell3D controls={dumbbell} fit={0.46} interactive className="absolute inset-0" />

      {/* Copy */}
      <div className="hero-content container-x relative z-10 flex h-full flex-col justify-end pb-[max(7rem,14svh)] md:pb-[max(8rem,15vh)]">
        <div className="mask-line mb-5 md:mb-7">
          <p className="hero-eyebrow label flex items-center gap-3 text-muted opacity-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
            Strength &amp; Conditioning Club · Est. 2016
          </p>
        </div>

        <h1 className="font-display text-[clamp(3.2rem,13.2vw,13.5rem)] [perspective:900px]">
          <span className="block overflow-hidden pb-[0.04em]">
            <SplitText text="FORGE YOUR" charClassName="hero-char opacity-0 origin-bottom" />
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <SplitText text="LIMITS." charClassName="hero-char opacity-0 origin-bottom text-accent" />
          </span>
        </h1>

        <div className="mt-7 flex flex-col gap-7 md:mt-9 md:flex-row md:items-end md:justify-between">
          <p className="hero-sub max-w-md text-[clamp(1.05rem,1.6vw,1.35rem)] font-light leading-snug text-fg opacity-0">
            Strength isn&apos;t given.
            <span className="text-muted"> It&apos;s built.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="hero-cta opacity-0">
              <MagneticButton href="#programs">Start Training</MagneticButton>
            </div>
            <div className="hero-cta opacity-0">
              <MagneticButton href="#membership" variant="ghost">
                Explore Membership
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Side meta */}
      <div className="hero-meta label pointer-events-none absolute left-[clamp(16px,4vw,56px)] top-1/2 hidden -translate-y-1/2 -rotate-90 origin-left text-muted opacity-0 xl:block">
        N° 01 — The Forge
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0 md:bottom-8">
        <span className="label text-[0.62rem] text-muted">Scroll to enter</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent [animation:scroll-line_1.8s_cubic-bezier(.65,0,.35,1)_infinite]" />
        </span>
        <ArrowDown size={14} className="text-accent [animation:arrow-bob_1.8s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
