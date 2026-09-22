import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'fitup-theme'
const THEME_COLORS = { dark: '#070707', light: '#f3efe6' }

const readTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light'
    ? 'light'
    : 'dark'

/**
 * Theme state that lives on <html data-theme>. Switching temporarily adds a
 * `theme-anim` class so every color cross-fades via CSS transitions instead of
 * snapping.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readTheme)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    const next = root.dataset.theme === 'light' ? 'dark' : 'light'

    root.classList.add('theme-anim')
    root.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[next])
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable (private mode) — theme still works for this visit */
    }

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => root.classList.remove('theme-anim'), 800)
    setTheme(next)
  }, [])

  return { theme, toggleTheme }
}
