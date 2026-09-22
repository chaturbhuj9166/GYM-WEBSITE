import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '../hooks/useMagnetic'
import { scrollToTarget } from '../utils/lenis'

/**
 * Pill button with magnetic pull, wipe-up background reveal, rolling label and
 * rotating arrow. Renders an <a> for in-page anchors (smooth-scrolled via
 * Lenis) or a <button> otherwise.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  cursor = 'button',
  icon: Icon = ArrowUpRight,
  className = '',
  strength = 0.3,
}) {
  const ref = useRef(null)
  useMagnetic(ref, { strength, innerSelector: '.btn-inner' })

  const handleClick = (e) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      scrollToTarget(href)
    }
    onClick?.(e)
  }

  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      ref={ref}
      href={href}
      onClick={handleClick}
      data-cursor={cursor}
      className={`btn btn-${variant} roll-trigger ${className}`}
      {...(Tag === 'button' ? { type: 'button' } : {})}
    >
      <span className="btn-inner flex items-center gap-3">
        <span className="roll">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
        <span className="btn-arrow">
          <Icon size={15} strokeWidth={2.2} />
        </span>
      </span>
    </Tag>
  )
}
