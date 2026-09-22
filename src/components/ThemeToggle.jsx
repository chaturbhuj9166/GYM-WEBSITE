import { motion } from 'framer-motion'

const spring = { type: 'spring', stiffness: 320, damping: 26 }

/**
 * Pill toggle whose knob slides, spins and morphs a sun into a crescent moon:
 * a masking circle slides over the sun core while the rays rotate and retract.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      data-cursor="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={!isDark}
      className="group relative flex h-9 w-[68px] shrink-0 items-center rounded-full border border-line bg-surface px-1 backdrop-blur-md transition-colors duration-500 hover:border-accent"
    >
      {/* Static glyphs in the track */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[11px] text-[11px] text-muted">
        <span aria-hidden="true">☀</span>
        <span aria-hidden="true">☾</span>
      </span>

      <motion.span
        className="relative z-10 grid h-7 w-7 place-items-center rounded-full bg-fg text-bg shadow-[0_4px_18px_-4px_rgba(0,0,0,0.5)]"
        initial={false}
        animate={{ x: isDark ? 32 : 0, rotate: isDark ? 360 : 0 }}
        transition={spring}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <mask id="moon-mask">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <motion.circle
              r="9"
              fill="black"
              initial={false}
              animate={isDark ? { cx: 17, cy: 7 } : { cx: 30, cy: -6 }}
              transition={spring}
            />
          </mask>
          <motion.circle
            cx="12"
            cy="12"
            fill="currentColor"
            mask="url(#moon-mask)"
            initial={false}
            animate={{ r: isDark ? 8 : 4.6 }}
            transition={spring}
          />
          <motion.g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ originX: '12px', originY: '12px' }}
            initial={false}
            animate={{ rotate: isDark ? -90 : 0, scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1 }}
            transition={spring}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="12"
                y1="2.2"
                x2="12"
                y2="4.2"
                transform={`rotate(${deg} 12 12)`}
              />
            ))}
          </motion.g>
        </svg>
      </motion.span>
    </button>
  )
}
