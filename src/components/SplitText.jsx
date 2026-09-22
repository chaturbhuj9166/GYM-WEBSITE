import { Fragment } from 'react'

/**
 * Splits text into word and/or character spans that GSAP can stagger.
 * Words never break mid-word; the full string stays available to screen readers.
 *
 *  <SplitText text="FORGE YOUR" by="chars" charClassName="hero-char" />
 */
export default function SplitText({
  text,
  by = 'chars',
  className = '',
  wordClassName = '',
  charClassName = '',
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          <span
            aria-hidden="true"
            className={`inline-block whitespace-nowrap ${wordClassName}`}
          >
            {by === 'chars'
              ? word.split('').map((ch, ci) => (
                  <span key={ci} className={`inline-block will-change-transform ${charClassName}`}>
                    {ch}
                  </span>
                ))
              : word}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}
