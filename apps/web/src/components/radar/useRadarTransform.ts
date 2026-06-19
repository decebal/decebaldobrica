'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  IDENTITY,
  type Transform,
  VIEW,
  VIEW_MIN,
  anchoredZoom,
  centerOn,
  clampScale,
} from './geometry'
import { useReducedMotion } from './useReducedMotion'

const EASE_MS = 420
// easeOutCubic — settles quickly, feels responsive without overshoot jitter.
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

interface ViewportCenter {
  x: number
  y: number
}

interface UseRadarTransform {
  transform: Transform
  /** The SVG element ref — attach to the radar `<svg>`. */
  svgRef: React.RefObject<SVGSVGElement>
  /** Convert a client (screen) point to viewBox user-space coords. */
  toUserSpace: (clientX: number, clientY: number) => { x: number; y: number }
  /** Center of the visible viewport in viewBox user-space. */
  viewportCenter: () => ViewportCenter
  /** Anchored zoom toward a viewBox-user-space point (live gesture — no animation). */
  zoomAt: (factor: number, anchor: { x: number; y: number }) => void
  /** Zoom toward the viewport center by a multiplicative factor (button — animated). */
  zoomBy: (factor: number) => void
  /** Pan by a screen-pixel delta (live gesture — no animation). */
  panByPixels: (dxPx: number, dyPx: number) => void
  /** Animate (or jump) to an arbitrary transform. */
  animateTo: (target: Transform) => void
  /** Smoothly center a viewBox-user-space point at a target scale. */
  focusPoint: (point: { x: number; y: number }, scale: number) => void
  /** Reset to the identity (full radar) view, eased. */
  reset: () => void
  isAnimating: () => boolean
}

export function useRadarTransform(): UseRadarTransform {
  const [transform, setTransform] = useState<Transform>(IDENTITY)
  const transformRef = useRef<Transform>(IDENTITY)
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()
  const reducedRef = useRef(reducedMotion)
  reducedRef.current = reducedMotion

  // Keep the ref in lockstep so gesture handlers read the latest transform.
  const commit = useCallback((next: Transform) => {
    transformRef.current = next
    setTransform(next)
  }, [])

  const cancelAnim = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  useEffect(() => () => cancelAnim(), [cancelAnim])

  // px-per-user-unit: the SVG renders VIEW user units across `meet`-fit space.
  const pxPerUnit = useCallback((): number => {
    const el = svgRef.current
    if (!el) return 1
    const rect = el.getBoundingClientRect()
    const fit = Math.min(rect.width, rect.height) || 1
    return fit / VIEW
  }, [])

  const toUserSpace = useCallback((clientX: number, clientY: number) => {
    const el = svgRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    // The viewBox is square (VIEW×VIEW) with xMidYMid meet — letterboxed.
    const fit = Math.min(rect.width, rect.height) || 1
    const offsetX = (rect.width - fit) / 2
    const offsetY = (rect.height - fit) / 2
    const localX = clientX - rect.left - offsetX
    const localY = clientY - rect.top - offsetY
    return {
      x: VIEW_MIN + (localX / fit) * VIEW,
      y: VIEW_MIN + (localY / fit) * VIEW,
    }
  }, [])

  const viewportCenter = useCallback((): ViewportCenter => {
    const el = svgRef.current
    if (!el) return { x: VIEW_MIN + VIEW / 2, y: VIEW_MIN + VIEW / 2 }
    const rect = el.getBoundingClientRect()
    return toUserSpace(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }, [toUserSpace])

  const animateTo = useCallback(
    (target: Transform) => {
      cancelAnim()
      const clamped: Transform = { ...target, scale: clampScale(target.scale) }
      if (reducedRef.current) {
        commit(clamped)
        return
      }
      const from = transformRef.current
      // Skip the rAF loop for no-op moves.
      if (from.x === clamped.x && from.y === clamped.y && from.scale === clamped.scale) return
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / EASE_MS)
        const k = easeOutCubic(p)
        commit({
          x: from.x + (clamped.x - from.x) * k,
          y: from.y + (clamped.y - from.y) * k,
          scale: from.scale + (clamped.scale - from.scale) * k,
        })
        if (p < 1) rafRef.current = requestAnimationFrame(tick)
        else rafRef.current = null
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [cancelAnim, commit]
  )

  const zoomAt = useCallback(
    (factor: number, anchor: { x: number; y: number }) => {
      cancelAnim()
      const cur = transformRef.current
      commit(anchoredZoom(cur, cur.scale * factor, anchor))
    },
    [cancelAnim, commit]
  )

  const zoomBy = useCallback(
    (factor: number) => {
      const cur = transformRef.current
      const next = anchoredZoom(cur, cur.scale * factor, viewportCenter())
      animateTo(next)
    },
    [animateTo, viewportCenter]
  )

  const panByPixels = useCallback(
    (dxPx: number, dyPx: number) => {
      cancelAnim()
      const ppu = pxPerUnit()
      const cur = transformRef.current
      // Translate the <g> by the same screen delta (transform translate is in user units * 1,
      // but the whole SVG is scaled by ppu on screen, so divide the pixel delta back out).
      commit({ ...cur, x: cur.x + dxPx / ppu, y: cur.y + dyPx / ppu })
    },
    [cancelAnim, commit, pxPerUnit]
  )

  const focusPoint = useCallback(
    (point: { x: number; y: number }, scale: number) => {
      animateTo(centerOn(point, scale, viewportCenter()))
    },
    [animateTo, viewportCenter]
  )

  const reset = useCallback(() => animateTo(IDENTITY), [animateTo])

  const isAnimating = useCallback(() => rafRef.current !== null, [])

  return {
    transform,
    svgRef,
    toUserSpace,
    viewportCenter,
    zoomAt,
    zoomBy,
    panByPixels,
    animateTo,
    focusPoint,
    reset,
    isAnimating,
  }
}
