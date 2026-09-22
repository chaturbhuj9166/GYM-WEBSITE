import { useState } from 'react'
import { imgSrcSet, imgUrl } from '../utils/images'

/**
 * Lazy, responsive Unsplash image that fades in once decoded. The wrapper keeps
 * a dark placeholder so layout never jumps and broken images degrade softly.
 */
export default function SmartImage({
  id,
  alt,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  priority = false,
  width = 1600,
  imgRef,
  cursor,
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-[#161616] ${className}`} data-cursor={cursor}>
      <img
        ref={imgRef}
        src={imgUrl(id, width)}
        srcSet={imgSrcSet(id)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  )
}
