import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { gsap } from '../utils/gsap'
import { createDumbbell } from '../utils/createDumbbell'

/**
 * Plain mutable object that GSAP tweens (scrubbed by ScrollTrigger) and the
 * render loop reads every frame. Nothing here goes through React state, so
 * scrolling never triggers a re-render.
 *
 *  x / y      position in viewport half-extents (-1 = left/bottom edge, 1 = right/top)
 *  z          depth in world units (negative = further away)
 *  rotX/Y/Z   radians
 *  scale      multiplier on the responsive base size
 *  sweep      x position (viewport half-extents) of the neon light that passes across
 *  sweepPower 0..1 strength of that light
 *  glow       emissive strength of the accent rings / caps
 *  opacity    canvas opacity
 */
export const createDumbbellControls = (overrides = {}) => ({
  x: 0,
  y: 0,
  z: 0,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  scale: 1,
  sweep: -1.6,
  sweepPower: 0,
  glow: 1,
  opacity: 1,
  ...overrides,
})

export default function Dumbbell3D({ controls, fit = 0.55, interactive = false, className = '' }) {
  const mountRef = useRef(null)
  const fitRef = useRef(fit)
  fitRef.current = fit

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    // WebGL setup (context, PMREM, shader compile) is deferred until the scene is
    // about one screen away, so off-screen scenes never compete with the intro.
    let teardown = null
    const lazy = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || teardown) return
        lazy.disconnect()
        teardown = init(mount) || (() => {})
      },
      { rootMargin: '100% 0px' },
    )
    lazy.observe(mount)
    return () => {
      lazy.disconnect()
      teardown?.()
    }
  }, [controls, interactive])

  function init(mount) {
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      // No WebGL: the section still reads fine without the object.
      return undefined
    }

    const isSmall = window.matchMedia('(max-width: 767px)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor(0x000000, 0)
    const canvas = renderer.domElement
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;'
    canvas.setAttribute('aria-hidden', 'true')
    mount.appendChild(canvas)

    // --- Scene, reflections & lighting --------------------------------------
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const envTarget = pmrem.fromScene(room, 0.04)
    scene.environment = envTarget.texture
    scene.environmentIntensity = 0.6

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.set(0, 0, 12)

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4)
    keyLight.position.set(-4, 6, 6)
    const rimLight = new THREE.DirectionalLight('#c8ff2e', 1.4)
    rimLight.position.set(6, 3, -5)
    const fillLight = new THREE.DirectionalLight('#aebfff', 0.7)
    fillLight.position.set(4, -3, 4)
    // Neon light that "passes across" the object (driven by controls.sweep).
    const sweepLight = new THREE.PointLight('#d4ff4a', 0, 10, 1.4)
    scene.add(keyLight, rimLight, fillLight, sweepLight, new THREE.AmbientLight('#ffffff', 0.12))

    const dumbbell = createDumbbell()
    const pivot = new THREE.Group()
    pivot.add(dumbbell.group)
    scene.add(pivot)

    // --- Responsive sizing ---------------------------------------------------
    let halfW = 1
    let halfH = 1
    let baseScale = 1
    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      halfW = halfH * camera.aspect
      // Fit the bar to a fraction of the width, but never taller than ~60% of the height.
      baseScale = Math.min((halfW * 2 * fitRef.current) / dumbbell.length, (halfH * 2 * 0.6) / 2.4)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    // --- Optional pointer tilt (hero) ---------------------------------------
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e) => {
      tilt.tx = (e.clientX / window.innerWidth - 0.5) * 0.5
      tilt.ty = (e.clientY / window.innerHeight - 0.5) * 0.3
    }
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (interactive && canHover) window.addEventListener('pointermove', onPointer, { passive: true })

    // --- Render loop (only while on screen) ----------------------------------
    let lastOpacity = -1
    const render = () => {
      const c = controls.current
      const t = performance.now() / 1000
      tilt.x += (tilt.tx - tilt.x) * 0.06
      tilt.y += (tilt.ty - tilt.y) * 0.06

      pivot.position.set(c.x * halfW, c.y * halfH + Math.sin(t * 0.9) * 0.04, c.z)
      pivot.scale.setScalar(baseScale * c.scale)
      dumbbell.group.rotation.set(
        c.rotX + tilt.y + Math.sin(t * 0.7) * 0.015,
        c.rotY + tilt.x,
        c.rotZ,
      )

      sweepLight.position.set(c.sweep * halfW, 0.8, 3)
      sweepLight.intensity = 55 * c.sweepPower
      dumbbell.accentMaterial.emissiveIntensity = c.glow

      if (c.opacity !== lastOpacity) {
        canvas.style.opacity = String(c.opacity)
        lastOpacity = c.opacity
      }
      renderer.render(scene, camera)
    }

    let running = false
    const start = () => {
      if (running) return
      running = true
      gsap.ticker.add(render)
    }
    const stop = () => {
      running = false
      gsap.ticker.remove(render)
    }
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '10% 0px' },
    )
    visibility.observe(mount)
    render()

    return () => {
      stop()
      visibility.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      dumbbell.dispose()
      room.dispose?.()
      envTarget.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }

  return <div ref={mountRef} className={`pointer-events-none ${className}`} />
}
