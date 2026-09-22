import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '../utils/gsap'
import WeightPlate from '../components/WeightPlate'
import SplitText from '../components/SplitText'

const STEPS = [20, 40, 60, 80, 100]
const CAPTIONS = [
  'Empty Olympic bar. Everyone starts here.',
  '+10 kg a side. Now it counts.',
  'Grip tight. Brace hard. Breathe.',
  'This is where most people stop.',
  'Triple digits. Welcome to the verse.',
]
// Side-view plates loaded one pair per step (innermost first).
const PLATES = [
  { h: 'h-[34svh] md:h-[46vh]', tone: 'dark' },
  { h: 'h-[34svh] md:h-[46vh]', tone: 'dark' },
  { h: 'h-[29svh] md:h-[39vh]', tone: 'dark' },
  { h: 'h-[24svh] md:h-[32vh]', tone: 'accent' },
]

function SidePlate({ h, tone }) {
  const bg =
    tone === 'accent'
      ? 'bg-[linear-gradient(90deg,#8fb81f,#c8ff2e_45%,#9ccc1f)] shadow-[0_0_40px_-6px_rgba(200,255,46,0.55)]'
      : 'bg-[linear-gradient(90deg,#050505,#2a2a2a_40%,#111_70%,#060606)]'
  return <span className={`plate block w-[11px] rounded-[4px] sm:w-[16px] md:w-[24px] ${h} ${bg} will-change-transform`} />
}

/**
 * "HOW MUCH CAN YOU HANDLE?" — pinned scene where each scroll step loads a
 * pair of plates onto a side-view barbell while the number counts up
 * 20 → 40 → 60 → 80 → 100 KG, then ends on NO EXCUSES.
 */
export default function WeightSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const numberRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ isMobile: MQ.mobile, isDesktop: MQ.notMobile }, (ctx) => {
        const { isMobile } = ctx.conditions
        const weight = { kg: STEPS[0] }
        let shown = STEPS[0]
        const render = () => {
          const v = Math.round(weight.kg)
          if (v !== shown) {
            numberRef.current.textContent = v
            shown = v
          }
        }

        const leftPlates = gsap.utils.toArray('.plates-left .plate', stageRef.current)
        const rightPlates = gsap.utils.toArray('.plates-right .plate', stageRef.current)
        const captions = gsap.utils.toArray('.kg-caption', stageRef.current)
        const travel = isMobile ? 60 : 55 // vw the plates fly in from

        gsap.set(leftPlates, { x: `-${travel}vw`, rotate: -35, opacity: 0 })
        gsap.set(rightPlates, { x: `${travel}vw`, rotate: 35, opacity: 0 })
        gsap.set(captions.slice(1), { yPercent: 100, opacity: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: isMobile ? '+=380%' : '+=460%',
            pin: stageRef.current,
            scrub: 0.7,
            anticipatePin: 1,
          },
        })

        tl.from('.kg-title .ch', { yPercent: 110, stagger: 0.015, duration: 0.5, ease: 'power3.out' }, 0)
          .from('.bar', { scaleX: 0, duration: 0.6, ease: 'power3.inOut' }, 0)
          .from('.kg-number-wrap', { scale: 0.7, opacity: 0, filter: 'blur(14px)', duration: 0.6 }, 0.1)

        // One step per 20 kg: number counts, a plate pair slides onto the sleeves,
        // the face plates spin and the step indicator advances.
        STEPS.slice(1).forEach((value, i) => {
          const at = 0.9 + i * 1.1
          tl.to(weight, { kg: value, duration: 0.7, onUpdate: render }, at)
            .to([leftPlates[i], rightPlates[i]], { x: 0, rotate: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, at)
            .fromTo('.kg-number-wrap', { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut', immediateRender: false }, at + 0.55)
            .to('.bar-group', { y: (i + 1) * (isMobile ? 1.5 : 2.5), duration: 0.7 }, at) // bar sags a touch under load
            .to('.face-plate-a', { rotate: `+=${90 + i * 20}`, xPercent: `-=${6}`, duration: 0.7 }, at)
            .to('.face-plate-b', { rotate: `-=${90 + i * 20}`, xPercent: `+=${6}`, duration: 0.7 }, at)
            .to('.step-indicator', { xPercent: (i + 1) * 100, duration: 0.7 }, at)
            .to(captions[i], { yPercent: -100, opacity: 0, duration: 0.35 }, at)
            .to(captions[i + 1], { yPercent: 0, opacity: 1, duration: 0.35 }, at + 0.3)
            .to(`.step-label-${i + 1}`, { opacity: 1, duration: 0.3 }, at + 0.4)
        })

        // Finale: NO EXCUSES.
        const end = 0.9 + 4 * 1.1 + 0.2
        tl.to('.kg-number-wrap', { scale: 1.4, opacity: 0, filter: 'blur(16px)', duration: 0.6, ease: 'power2.in' }, end)
          .to('.bar-group', { opacity: 0.15, duration: 0.5 }, end)
          .to('.kg-caption-wrap', { opacity: 0, duration: 0.3 }, end)
          .fromTo('.no-excuses-bg', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut' }, end + 0.2)
          .fromTo('.no-excuses .ch', { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, stagger: 0.03, duration: 0.6, ease: 'power4.out' }, end + 0.5)
          .fromTo('.no-excuses-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, end + 0.8)
          .to({}, { duration: 0.5 }) // hold on the final frame
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative" aria-label="How much can you handle">
      <div ref={stageRef} className="relative h-[100svh] overflow-hidden bg-bg-2">
        {/* Decorative face plates (spin with each step) */}
        <div className="face-plate-a pointer-events-none absolute -bottom-[16vmin] -left-[14vmin] w-[46vmin] opacity-90 will-change-transform">
          <WeightPlate id="a" label="20 KG" />
        </div>
        <div className="face-plate-b pointer-events-none absolute -right-[12vmin] -top-[10vmin] w-[38vmin] opacity-90 will-change-transform">
          <WeightPlate id="b" label="25 KG" accent />
        </div>

        {/* Heading */}
        <div className="container-x relative z-10 pt-[104px] md:pt-[120px]">
          <p className="label mb-3 text-accent-ink">
            <span className="text-muted">(03)</span> Progressive overload
          </p>
          <h2 className="kg-title font-display max-w-[14ch] overflow-hidden text-[clamp(2.2rem,5.6vw,5.4rem)]">
            <SplitText text="HOW MUCH CAN YOU HANDLE?" charClassName="ch" />
          </h2>
        </div>

        {/* Barbell */}
        <div className="bar-group pointer-events-none absolute inset-x-0 top-[58%] -translate-y-1/2">
          <div className="bar absolute left-[3vw] right-[3vw] top-1/2 h-[8px] -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#f4f4f0,#8a8a86_55%,#cfcfca)] md:h-[12px]" />
          <div className="plates-left absolute right-[calc(50%+27vw)] top-1/2 flex -translate-y-1/2 flex-row-reverse items-center gap-[3px] md:right-[calc(50%+min(29vw,440px))] md:gap-[6px]">
            <span className="block h-[5svh] w-[8px] rounded-sm bg-[linear-gradient(90deg,#bbb,#fff,#999)] md:h-[7vh] md:w-[14px]" />
            {PLATES.map((p, i) => (
              <SidePlate key={i} {...p} />
            ))}
          </div>
          <div className="plates-right absolute left-[calc(50%+27vw)] top-1/2 flex -translate-y-1/2 items-center gap-[3px] md:left-[calc(50%+min(29vw,440px))] md:gap-[6px]">
            <span className="block h-[5svh] w-[8px] rounded-sm bg-[linear-gradient(90deg,#999,#fff,#bbb)] md:h-[7vh] md:w-[14px]" />
            {PLATES.map((p, i) => (
              <SidePlate key={i} {...p} />
            ))}
          </div>
        </div>

        {/* Number */}
        <div className="absolute inset-x-0 top-[58%] z-10 flex -translate-y-1/2 flex-col items-center">
          <div className="kg-number-wrap flex items-end leading-none will-change-transform">
            <span
              ref={numberRef}
              className="font-display tabular-nums text-[clamp(7rem,30vw,25rem)] [text-shadow:0_20px_80px_rgba(0,0,0,0.35)]"
            >
              20
            </span>
            <span className="font-display mb-[0.6em] ml-2 text-[clamp(1.6rem,4.5vw,4rem)] text-accent-ink md:ml-4">KG</span>
          </div>
          <div className="kg-caption-wrap relative mt-2 h-6 w-full overflow-hidden text-center md:mt-4">
            {CAPTIONS.map((c) => (
              <span key={c} className="kg-caption label absolute inset-x-0 top-0 px-4 text-[0.62rem] text-muted md:text-[0.7rem]">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Step track */}
        <div className="container-x absolute inset-x-0 bottom-6 z-10 md:bottom-10">
          <div className="relative grid grid-cols-5 border-t border-line pt-3">
            <span className="step-indicator absolute left-0 top-[-1px] h-[2px] w-1/5 bg-accent" />
            {STEPS.map((s, i) => (
              <span key={s} className={`step-label-${i} label text-[0.6rem] md:text-[0.68rem] ${i === 0 ? 'text-fg' : 'text-muted opacity-40'}`}>
                {s} kg
              </span>
            ))}
          </div>
        </div>

        {/* Finale */}
        <div className="no-excuses pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <div className="no-excuses-bg absolute inset-0 bg-accent" style={{ clipPath: 'inset(100% 0% 0% 0%)' }} />
          <div className="relative text-center text-on-accent">
            <h3 className="overflow-hidden font-display text-[clamp(3.6rem,15vw,15rem)] leading-[0.9]">
              <SplitText text="NO EXCUSES." charClassName="ch" />
            </h3>
            <p className="no-excuses-sub label mt-4 opacity-0">100 kg is just the beginning.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
