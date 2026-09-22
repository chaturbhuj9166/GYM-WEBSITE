// Module-level handle to the single Lenis instance so any component can
// scroll programmatically without prop drilling or context re-renders.
let instance = null

export const setLenis = (lenis) => {
  instance = lenis
}

export const getLenis = () => instance

/** Smooth-scroll to a selector / element / number, falling back to native. */
export const scrollToTarget = (target, options = {}) => {
  if (instance) {
    instance.scrollTo(target, {
      duration: 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      ...options,
    })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}
