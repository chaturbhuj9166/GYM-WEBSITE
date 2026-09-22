import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import { GALLERY } from '../utils/content'
import SmartImage from '../components/SmartImage'

/**
 * Pinned horizontal gallery: vertical scroll drives the track sideways.
 * Frames have their own rotation, size and depth; inner images parallax
 * against the track using containerAnimation.
 */
export default function Gallery() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isMobile: MQ.mobile, isDesktop: MQ.notMobile }, (ctx) => {
        const { isMobile } = ctx.conditions
        const track = trackRef.current
        const distance = () => track.scrollWidth - window.innerWidth

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              sectionRef.current.querySelector('.gallery-bar').style.transform = `scaleX(${self.progress})`
            },
          },
        })

        gsap.utils.toArray('.gallery-item', track).forEach((item) => {
          const depth = Number(item.dataset.depth)
          const rotate = Number(item.dataset.rotate)
          // Frame: rotates/straightens and lifts as it crosses the screen.
          gsap.fromTo(
            item,
            { rotate: rotate * 2.2, y: isMobile ? 20 : 60 * depth, scale: 0.9 },
            {
              rotate: -rotate,
              y: isMobile ? -20 : -60 * depth,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
            },
          )
          // Image: parallax inside the frame, opposite to the travel.
          gsap.fromTo(
            item.querySelector('.gallery-img'),
            { xPercent: -14 * depth },
            {
              xPercent: 14 * depth,
              ease: 'none',
              scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })

        gsap.fromTo('.gallery-title', { xPercent: 0 }, {
          xPercent: -40,
          ease: 'none',
          scrollTrigger: { trigger: '.gallery-title', containerAnimation: scrollTween, start: 'left left', end: 'right left', scrub: true },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="force-dark relative h-[100svh] overflow-hidden" aria-label="Gallery">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(200,255,46,0.07),transparent_60%)]" />

      <div ref={trackRef} className="relative flex h-full w-max items-center gap-[6vw] pl-[clamp(16px,4vw,56px)] pr-[12vw] will-change-transform">
        <div className="gallery-title flex h-full w-[86vw] shrink-0 flex-col justify-center sm:w-[60vw] lg:w-[38vw]">
          <p className="label mb-6 text-accent-ink">
            <span className="text-muted">(07)</span> Gallery
          </p>
          <h2 className="font-display text-[clamp(3.6rem,10vw,10rem)]">
            Inside
            <br />
            <span className="text-outline">the forge.</span>
          </h2>
          <p className="mt-6 max-w-sm text-muted">Iron, sweat and floodlights. A look at the floor where the work gets done.</p>
        </div>

        {GALLERY.map((g, i) => (
          <figure
            key={g.title}
            data-depth={g.depth}
            data-rotate={g.rotate}
            className={`gallery-item relative flex shrink-0 flex-col ${g.offset} will-change-transform`}
          >
            <div className={`relative overflow-hidden rounded-[18px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ${g.size}`} data-cursor="view">
              <div className="gallery-img absolute -inset-x-[18%] inset-y-0 will-change-transform">
                <SmartImage id={g.image} alt={`${g.title} — ${g.tag}`} sizes="(min-width:1024px) 40vw, 85vw" className="h-full w-full" imgClassName="grayscale-[0.3] contrast-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="label absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[0.6rem] text-white/80 backdrop-blur-md">
                {g.tag}
              </span>
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-6">
              <span className="font-display text-2xl md:text-3xl">{g.title}</span>
              <span className="label text-muted">0{i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="container-x pointer-events-none absolute inset-x-0 bottom-6 flex items-center gap-4 md:bottom-8">
        <span className="label text-muted">Scroll to explore</span>
        <div className="relative h-px flex-1 overflow-hidden bg-line">
          <div className="gallery-bar absolute inset-0 origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
        </div>
        <span className="label text-muted">06 frames</span>
      </div>
    </section>
  )
}
