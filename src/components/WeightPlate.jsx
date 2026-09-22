/**
 * Front-facing bumper plate drawn in SVG (rim, recessed face, hub and
 * curved lettering). Used as a rotating decorative element.
 */
export default function WeightPlate({ label = '20 KG', accent = false, className = '', id }) {
  const pathId = `plate-text-${id}`
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`plate-face-${id}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="60%" stopColor="#141414" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
        <linearGradient id={`plate-hub-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f2ee" />
          <stop offset="50%" stopColor="#8d8d8a" />
          <stop offset="100%" stopColor="#d8d8d4" />
        </linearGradient>
        <path id={pathId} d="M100,100 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" />
      </defs>
      <circle cx="100" cy="100" r="99" fill="#0b0b0b" />
      <circle cx="100" cy="100" r="96" fill={`url(#plate-face-${id})`} />
      <circle cx="100" cy="100" r="88" fill="none" stroke={accent ? '#c8ff2e' : 'rgba(255,255,255,0.14)'} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <text fill={accent ? '#c8ff2e' : 'rgba(255,255,255,0.75)'} fontFamily="JetBrains Mono, monospace" fontSize="9.5" letterSpacing="3.2">
        <textPath href={`#${pathId}`}>FIT UP · {label} · A WHOLE NEW LIFESTYLE · {label} ·</textPath>
      </text>
      <circle cx="100" cy="100" r="40" fill="#101010" stroke="rgba(255,255,255,0.1)" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={100 + Math.cos((a * Math.PI) / 180) * 30} cy={100 + Math.sin((a * Math.PI) / 180) * 30} r="3" fill="#2a2a2a" />
      ))}
      <circle cx="100" cy="100" r="19" fill={`url(#plate-hub-${id})`} />
      <circle cx="100" cy="100" r="11" fill="#070707" />
    </svg>
  )
}
