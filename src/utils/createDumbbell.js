import * as THREE from 'three'

/*
 * Procedural, plate-loaded dumbbell built from lathe/cylinder geometry.
 * The bar lies along the X axis and is centred on the origin, so rotating the
 * group around Y spins it "end over end" like a product turntable shot.
 *
 * Everything (geometries, materials, textures) is collected in `disposables`
 * so the caller can free GPU memory when the component unmounts.
 */

const ACCENT = new THREE.Color('#c8ff2e')

/** Fine diagonal cross-hatch used as a bump map to fake knurling on the grip. */
function createKnurlTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  for (let i = -size; i < size * 2; i += 8) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + size, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(i, size)
    ctx.lineTo(i + size, 0)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 2)
  return texture
}

/** Circular branding printed on the outer face of each outermost plate. */
function createPlateLabelTexture(text) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)
  ctx.translate(size / 2, size / 2)
  ctx.fillStyle = 'rgba(235,235,230,0.92)'
  ctx.font = '600 30px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const chars = text.split('')
  const radius = size * 0.4
  const step = (Math.PI * 2) / chars.length
  chars.forEach((ch, i) => {
    ctx.save()
    ctx.rotate(i * step)
    ctx.translate(0, -radius)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/**
 * Lathe profile for a rubber bumper plate: raised hub, recessed face and a
 * rounded outer rim. Built around the Y axis, then rotated onto X.
 */
function createPlateGeometry(radius, thickness) {
  const h = thickness / 2
  const d = thickness * 0.16 // face recess depth
  const hole = 0.17
  const pts = [
    [hole, -h],
    [radius * 0.3, -h],
    [radius * 0.34, -h + d],
    [radius * 0.8, -h + d],
    [radius * 0.85, -h],
    [radius * 0.96, -h],
    [radius, -h + thickness * 0.14],
    [radius, h - thickness * 0.14],
    [radius * 0.96, h],
    [radius * 0.85, h],
    [radius * 0.8, h - d],
    [radius * 0.34, h - d],
    [radius * 0.3, h],
    [hole, h],
    [hole, -h],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const geometry = new THREE.LatheGeometry(pts, 72)
  geometry.rotateZ(Math.PI / 2)
  return geometry
}

function cylinderX(radius, length, segments = 48) {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, segments, 1)
  geometry.rotateZ(Math.PI / 2)
  return geometry
}

export function createDumbbell() {
  const disposables = []
  const track = (item) => {
    disposables.push(item)
    return item
  }

  const group = new THREE.Group()

  // --- Materials -----------------------------------------------------------
  const knurl = track(createKnurlTexture())
  const chrome = track(
    new THREE.MeshStandardMaterial({ color: '#e6e6e2', metalness: 1, roughness: 0.18 }),
  )
  const grip = track(
    new THREE.MeshStandardMaterial({
      color: '#c9c9c4',
      metalness: 1,
      roughness: 0.38,
      bumpMap: knurl,
      bumpScale: 1.4,
    }),
  )
  const rubber = track(
    new THREE.MeshStandardMaterial({ color: '#141414', metalness: 0.35, roughness: 0.42 }),
  )
  const rubberInner = track(
    new THREE.MeshStandardMaterial({ color: '#1d1d1d', metalness: 0.5, roughness: 0.34 }),
  )
  const accent = track(
    new THREE.MeshStandardMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 1.2,
      metalness: 0.2,
      roughness: 0.4,
    }),
  )
  const labelTexture = track(createPlateLabelTexture('FIT UP · 24 KG · A WHOLE NEW LIFESTYLE · '))
  const label = track(
    new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, depthWrite: false }),
  )

  // --- Handle --------------------------------------------------------------
  group.add(new THREE.Mesh(track(cylinderX(0.13, 2.0, 40)), grip))

  // --- Each side: sleeve, inner collar, 3 plates, spin-lock, end cap --------
  const plates = [
    { r: 1.2, t: 0.24, mat: rubber },
    { r: 1.02, t: 0.2, mat: rubberInner },
    { r: 0.84, t: 0.18, mat: rubber },
  ]

  const accentRings = []

  ;[1, -1].forEach((side) => {
    const sleeve = new THREE.Mesh(track(cylinderX(0.16, 1.0, 40)), chrome)
    sleeve.position.x = side * 1.45
    group.add(sleeve)

    const innerCollar = new THREE.Mesh(track(cylinderX(0.26, 0.12, 48)), chrome)
    innerCollar.position.x = side * 1.0
    group.add(innerCollar)

    let cursor = 1.06
    plates.forEach((plate, i) => {
      const mesh = new THREE.Mesh(track(createPlateGeometry(plate.r, plate.t)), plate.mat)
      cursor += plate.t / 2
      mesh.position.x = side * cursor
      group.add(mesh)

      // Neon accent ring embedded in the rim of the largest plate.
      if (i === 0) {
        const ring = new THREE.Mesh(
          track(new THREE.TorusGeometry(plate.r * 0.995, 0.012, 8, 120)),
          accent,
        )
        ring.rotation.y = Math.PI / 2
        ring.position.x = side * cursor
        group.add(ring)
        accentRings.push(ring)
      }

      // Circular branding on the outer face of the outermost plate.
      if (i === plates.length - 1) {
        const ringGeo = track(new THREE.RingGeometry(plate.r * 0.36, plate.r * 0.8, 96))
        const decal = new THREE.Mesh(ringGeo, label)
        decal.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2
        decal.position.x = side * (cursor + plate.t / 2 - plate.t * 0.16 + 0.004)
        group.add(decal)
      }

      cursor += plate.t / 2 + 0.012
    })

    const lock = new THREE.Mesh(track(cylinderX(0.23, 0.14, 48)), chrome)
    lock.position.x = side * (cursor + 0.07)
    group.add(lock)

    const cap = new THREE.Mesh(track(cylinderX(0.17, 0.05, 40)), accent)
    cap.position.x = side * (cursor + 0.17)
    group.add(cap)
  })

  return {
    group,
    accentMaterial: accent,
    /** Overall length along X, used to fit the object to the viewport. */
    length: 4.0,
    dispose: () => disposables.forEach((d) => d.dispose?.()),
  }
}
