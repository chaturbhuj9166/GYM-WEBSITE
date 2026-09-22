import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import { FINE_POINTER, useMediaQuery } from '../hooks/useMediaQuery'

/**
 * Desktop-only cursor: a precise dot plus a lagging ring.
 * State is chosen by the nearest [data-cursor] ancestor:
 *   button → ring expands · view → ring grows and shows "VIEW" · cta → large lime disc
 * State lives in a data attribute, so hovering never re-renders React.
 */
export default function CustomCursor() {
  const enabled = useMediaQuery(FINE_POINTER)
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const root = rootRef.current
    const html = document.documentElement
    html.classList.add('has-custom-cursor')

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.5, ease: 'power3.out' })

    let state = ''
    const setState = (next) => {
      if (next === state) return
      state = next
      root.dataset.state = next
    }

    const onMove = (e) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      root.dataset.visible = 'true'
    }
    const onOver = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button')
      if (!target) return setState('default')
      setState(target.dataset.cursor || 'button')
    }
    const onLeaveWindow = () => {
      root.dataset.visible = 'false'
    }
    const onDown = () => root.classList.add('is-down')
    const onUp = () => root.classList.remove('is-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      html.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="cursor" data-state="default" data-visible="false" aria-hidden="true">
      <style>{`
        .cursor { position: fixed; inset: 0; pointer-events: none; z-index: 200; }
        .cursor[data-visible='false'] .cursor-dot,
        .cursor[data-visible='false'] .cursor-ring { opacity: 0; }
        .cursor-dot, .cursor-ring {
          position: fixed; top: 0; left: 0; will-change: transform;
          transition: opacity .3s ease;
        }
        .cursor-dot i {
          display: block; width: 6px; height: 6px; margin: -3px 0 0 -3px;
          border-radius: 50%; background: var(--accent);
          transition: transform .35s cubic-bezier(.65,0,.35,1);
        }
        .cursor-ring > i {
          position: absolute; width: 38px; height: 38px; margin: -19px 0 0 -19px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,.9);
          mix-blend-mode: difference;
          transition: transform .5s cubic-bezier(.22,1,.36,1), background-color .4s ease, border-color .4s ease;
        }
        .cursor-ring > b {
          position: absolute; transform: translate(-50%,-50%) scale(.4); opacity: 0;
          font: 500 10px/1 'JetBrains Mono', monospace; letter-spacing: .2em; color: #0a0a0a;
          transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .3s ease;
        }
        .cursor[data-state='button'] .cursor-ring > i { transform: scale(1.75); background: rgba(255,255,255,.95); }
        .cursor[data-state='button'] .cursor-dot i { transform: scale(0); }
        .cursor[data-state='view'] .cursor-ring > i { transform: scale(2.6); background: var(--accent); border-color: var(--accent); mix-blend-mode: normal; }
        .cursor[data-state='view'] .cursor-ring > b { transform: translate(-50%,-50%) scale(1); opacity: 1; }
        .cursor[data-state='view'] .cursor-dot i { transform: scale(0); }
        .cursor[data-state='cta'] .cursor-ring > i { transform: scale(3.6); background: rgba(255,255,255,.95); }
        .cursor[data-state='cta'] .cursor-dot i { transform: scale(0); }
        .cursor.is-down .cursor-ring > i { transform: scale(.75); }
      `}</style>
      <div ref={dotRef} className="cursor-dot">
        <i />
      </div>
      <div ref={ringRef} className="cursor-ring">
        <i />
        <b>VIEW</b>
      </div>
    </div>
  )
}
