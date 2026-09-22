import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query without extra renders when it doesn't change. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const FINE_POINTER = '(hover: hover) and (pointer: fine)'
