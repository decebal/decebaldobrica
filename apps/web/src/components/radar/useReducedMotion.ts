'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks the `prefers-reduced-motion` media query. Returns `true` when the user
 * has asked for reduced motion, so callers can jump instantly instead of
 * animating. SSR-safe: defaults to `false` until mounted.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
