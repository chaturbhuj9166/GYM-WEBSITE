import { useEffect, useRef } from 'react'

/**
 * Lightweight 2D canvas of glowing dust motes drifting upward. Uses a single
 * pre-rendered glow sprite and pauses when scrolled out of view.
 */
export default function Particles({ count = 60, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    const total = small ? Math.round(count * 0.45) : count
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const sprite = (color) => {
      const s = document.createElement('canvas')
      s.width = s.height = 32
      const g = s.getContext('2d')
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, color)
      grad.addColorStop(0.35, color.replace(/[\d.]+\)$/, '0.35)'))
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grad
      g.fillRect(0, 0, 32, 32)
      return s
    }
    const sprites = [sprite('rgba(200,255,46,0.9)'), sprite('rgba(255,255,255,0.85)')]

    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles = Array.from({ length: total }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 7,
      vy: 0.15 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.6,
      sprite: sprites[Math.random() < 0.3 ? 0 : 1],
    }))

    let raf = 0
    let visible = true
    const draw = (time) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.y -= p.vy
        p.x += p.vx + Math.sin(time * 0.0006 + p.phase) * 0.2
        if (p.y < -20) {
          p.y = h + 20
          p.x = Math.random() * w
        }
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 0.002 + p.phase))
        ctx.drawImage(p.sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
      }
      ctx.globalAlpha = 1
      if (visible && !reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible
      visible = entry.isIntersecting
      if (visible && !wasVisible && !reduce) raf = requestAnimationFrame(draw)
      if (!visible) cancelAnimationFrame(raf)
    })
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [count])

  return <canvas ref={ref} className={`pointer-events-none h-full w-full ${className}`} aria-hidden="true" />
}
