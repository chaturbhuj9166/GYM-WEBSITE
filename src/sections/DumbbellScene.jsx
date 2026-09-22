import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { DUMBBELL_CHAPTERS } from '../utils/content'
import Dumbbell3D, { createDumbbellControls } from '../components/Dumbbell3D'

const TAU = Math.PI * 2

// Where each chapter's copy sits, chosen to stay clear of the dumbbell.
const CHAPTER_POSITION = [
  'lg:left-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2',
  'lg:left-0 lg:bottom-[14vh]',
  'md:left-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2',
  'md:right-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:text-right md:items-end',
  'md:right-0 md:bottom-[14vh] md:text-right md:items-end',
  'md:left-1/2 md:bottom-[12vh] md:-translate-x-1/2 md:text-center md:items-center',
]

/**
 * Pinned "product film": one 3D dumbbell performs six scroll-scrubbed beats.
 *   01 enters from the right · 02 glides to centre · 03 spins 360° on Y
 *   04 travels across the screen · 05 flips 180° · 06 recedes and shrinks away
 * Everything is on one timeline whose playhead is the scroll position.
 */
export default function DumbbellScene() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const controls = useRef(createDumbbellControls({ x: 1.9, rotY: -0.7, rotX: 0.28, rotZ: 0.12, scale: 0.9, glow: 0.8 }))
  const hud = useRef({})

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ isMobile: MQ.mobile, isTablet: MQ.tablet, isDesktop: MQ.desktop }, (ctx) => {
        const { isMobile, isTablet } = ctx.conditions
        const c = controls.current
        // Simplified travel on phones/tablets: less horizontal range, object kept in
        // the upper half so the chapter copy can sit underneath it.
        const span = isMobile ? 0.28 : isTablet ? 0.4 : 1
        const baseY = isMobile || isTablet ? 0.3 : 0
        Object.assign(c, { x: 1.9, y: baseY, z: 0, rotY: -0.7, rotX: 0.28, rotZ: 0.12, scale: isMobile ? 0.95 : 0.9, opacity: 1 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: isMobile ? '+=420%' : '+=520%',
            pin: stageRef.current,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              // HUD readouts (direct DOM writes, no React state).
              const deg = Math.round((((c.rotY * 180) / Math.PI) % 360 + 360) % 360)
              hud.current.rot.textContent = String(deg).padStart(3, '0') + '°'
              hud.current.pos.textContent = (c.x >= 0 ? '+' : '−') + Math.abs(c.x * 100).toFixed(0).padStart(3, '0')
              hud.current.depth.textContent = c.z.toFixed(1)
              hud.current.bar.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        // --- 01 ENTER: flies in from the right --------------------------------
        tl.to(c, { x: 0.5 * span, rotY: -0.25, rotZ: -0.06, rotX: 0.18, ease: 'power3.out' }, 0)
          .to('.glow-a', { xPercent: 20, yPercent: -10, scale: 1.1, opacity: 0.9 }, 0)

        // --- 02 FOCUS: moves to centre and comes closer -----------------------
          .to(c, { x: 0.2 * span, z: 1, scale: isMobile ? 1.05 : 1.05, rotX: 0.1, rotZ: 0 }, 1)
          .to('.glow-a', { xPercent: 0, yPercent: 0, scale: 1.4 }, 1)
          .to('.scene-vignette', { opacity: 0.85 }, 1)

        // --- 03 ROTATE: full 360° turn around the Y axis ---------------------
          .to(c, { rotY: -0.25 + TAU, ease: 'power1.inOut' }, 2)
          .to('.glow-b', { opacity: 0.8, scale: 1.2 }, 2)
          .to('.scene-ring', { rotate: 180, scale: 1.1, opacity: 1 }, 2)

        // --- 04 MOVE: travels horizontally across the screen ------------------
          .to(c, { x: -0.52 * span, rotZ: 0.12, rotY: -0.25 + TAU + 0.35, z: 0.6 }, 3)
          .to('.glow-a', { xPercent: -60, yPercent: 10, scale: 1.1 }, 3)
          .to('.glow-b', { opacity: 0.2 }, 3)
          .to('.scene-ring', { xPercent: -40, opacity: 0.4 }, 3)
          .to('.scene-floor', { xPercent: 12 }, 3)

        // --- 05 FLIP: rotates 180° end over end -------------------------------
          .to(c, { rotZ: 0.12 + Math.PI, rotX: 0.4, x: -0.3 * span, glow: 2 }, 4)
          .to('.glow-a', { xPercent: -30, yPercent: -20, scale: 1.6 }, 4)
          .to('.glow-c', { opacity: 0.7 }, 4)

        // --- 06 RELEASE: moves away into depth and scales down ----------------
          .to(c, { z: -16, scale: 0.55, x: 0, y: baseY + 0.12, rotY: '+=1.2', rotX: 0.2, glow: 0.6 }, 5)
          .to(c, { opacity: 0.35, ease: 'power1.in' }, 5.4)
          .to('.glow-a', { xPercent: 0, yPercent: 0, scale: 0.6, opacity: 0.5 }, 5)
          .to('.glow-c', { opacity: 0 }, 5)
          .to('.scene-vignette', { opacity: 1 }, 5)
          .to('.scene-floor', { xPercent: 0, scaleY: 0.6 }, 5)

        // --- Chapter copy: each beat's text swaps in/out with clip + blur -------
        const chapters = gsap.utils.toArray('.chapter', stageRef.current)
        chapters.forEach((el, i) => {
          const lines = el.querySelectorAll('.ch-line')
          if (i > 0) {
            tl.fromTo(
              lines,
              { yPercent: 110, opacity: 0, filter: 'blur(6px)' },
              { yPercent: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.35, ease: 'power3.out' },
              i - 0.05,
            )
          }
          if (i < chapters.length - 1) {
            tl.to(lines, { yPercent: -110, opacity: 0, filter: 'blur(6px)', stagger: 0.04, duration: 0.3, ease: 'power2.in' }, i + 0.72)
          }
          // Giant background numeral cross-fade.
          const num = stageRef.current.querySelectorAll('.scene-num')[i]
          if (i > 0) tl.fromTo(num, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.4 }, i - 0.05)
          if (i < chapters.length - 1) tl.to(num, { opacity: 0, scale: 0.9, duration: 0.3 }, i + 0.72)
          // Chapter progress ticks.
          tl.to(stageRef.current.querySelectorAll('.tick')[i], { opacity: 1, scaleY: 2.2, duration: 0.2 }, i)
        })

        // First chapter is on screen as soon as the stage pins.
        gsap.set(chapters[0].querySelectorAll('.ch-line'), { yPercent: 0, opacity: 1 })
        gsap.set(stageRef.current.querySelectorAll('.scene-num')[0], { opacity: 1 })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative" aria-label="The object: a six-part scroll film">
      <div ref={stageRef} className="relative h-[100svh] overflow-hidden bg-bg">
        {/* Lighting rig: colored blooms that move per beat */}
        <div className="glow-a pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,255,46,0.22),transparent_62%)] opacity-60 will-change-transform" />
        <div className="glow-b pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(160,190,255,0.16),transparent_60%)] opacity-0 will-change-transform" />
        <div className="glow-c pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(200,255,46,0.2),transparent_55%)] opacity-0" />

        {/* Perspective floor grid for depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] overflow-hidden [perspective:600px]">
          <div
            className="scene-floor absolute -inset-x-1/2 bottom-0 h-[200%] origin-bottom opacity-60"
            style={{
              transform: 'rotateX(72deg)',
              backgroundImage:
                'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
              maskImage: 'linear-gradient(to top, #000 10%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to top, #000 10%, transparent 75%)',
            }}
          />
        </div>

        {/* Orbit ring behind the object */}
        <div className="scene-ring pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(80vw,70vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line opacity-50" />

        {/* Giant chapter numerals */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          {DUMBBELL_CHAPTERS.map((ch) => (
            <span
              key={ch.index}
              className="scene-num text-outline-faint col-start-1 row-start-1 font-display text-[clamp(14rem,48vw,46rem)] opacity-0"
            >
              {ch.index}
            </span>
          ))}
        </div>

        <div className="scene-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)] opacity-60" />

        <Dumbbell3D controls={controls} fit={0.5} className="absolute inset-0" />

        {/* Chapter copy */}
        <div className="container-x pointer-events-none absolute inset-0">
          <div className="relative h-full">
            {DUMBBELL_CHAPTERS.map((ch, i) => (
              <article
                key={ch.index}
                className={`chapter absolute inset-x-0 bottom-[17svh] z-10 flex max-w-[30rem] flex-col lg:inset-x-auto ${CHAPTER_POSITION[i]}`}
              >
                <span className="mask-line">
                  <span className="ch-line label block text-accent-ink opacity-0">
                    {ch.index} / 06 — The Object
                  </span>
                </span>
                <span className="mask-line mt-3">
                  <span className="ch-line block font-display text-[clamp(3.4rem,9vw,8.5rem)] opacity-0">{ch.title}</span>
                </span>
                <span className="mask-line mt-3">
                  <span className="ch-line block text-[clamp(1.1rem,1.8vw,1.6rem)] font-medium leading-tight opacity-0">
                    {ch.line}
                  </span>
                </span>
                <span className="mask-line mt-2">
                  <span className="ch-line block max-w-sm text-sm leading-relaxed text-muted opacity-0 md:text-[0.95rem]">
                    {ch.copy}
                  </span>
                </span>
              </article>
            ))}
          </div>
        </div>

        {/* HUD */}
        <div className="container-x pointer-events-none absolute inset-x-0 top-[88px] flex items-start justify-between md:top-[110px]">
          <div className="label text-muted">
            <span className="text-fg">IV-24</span> · Steel dumbbell
          </div>
          <dl className="label grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-right text-muted">
            <dt>Rot·Y</dt>
            <dd ref={(el) => (hud.current.rot = el)} className="tabular-nums text-fg">000°</dd>
            <dt>Pos·X</dt>
            <dd ref={(el) => (hud.current.pos = el)} className="tabular-nums text-fg">+000</dd>
            <dt className="hidden sm:block">Depth</dt>
            <dd ref={(el) => (hud.current.depth = el)} className="hidden tabular-nums text-fg sm:block">0.0</dd>
          </dl>
        </div>

        <div className="container-x pointer-events-none absolute inset-x-0 bottom-6 flex items-center gap-4 md:bottom-8">
          <div className="flex items-center gap-2">
            {DUMBBELL_CHAPTERS.map((ch) => (
              <span key={ch.index} className="tick block h-2 w-[3px] bg-accent opacity-25" />
            ))}
          </div>
          <div className="relative h-px flex-1 overflow-hidden bg-line">
            <div ref={(el) => (hud.current.bar = el)} className="absolute inset-0 origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
          </div>
          <span className="label text-muted">Scroll</span>
        </div>
      </div>
    </section>
  )
}
