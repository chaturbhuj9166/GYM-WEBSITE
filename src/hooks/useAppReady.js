import { createContext, useContext } from 'react'

/**
 * `true` once the intro loader has finished. Only the hero and navbar consume
 * it, and it flips exactly once, so it costs a single re-render.
 */
export const AppReadyContext = createContext(false)

export const useAppReady = () => useContext(AppReadyContext)
