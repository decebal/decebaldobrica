// Geometry + transform helpers for the Rust & AI Crate Radar.
//
// Pure, framework-free, and unit-testable. The redesign keeps the *exact*
// blip placement math the original SVG used (`buildBlips`), and adds the
// pan/zoom/quadrant-focus transform helpers that the full-bleed hero drives
// from a single `{ x, y, scale }` state. The `RadarTool` data contract in
// `@/data/crateRadar` is untouched.

import { RADAR_QUADRANTS, RADAR_RINGS } from '@/data/crateRadar'
import type { RadarQuadrant, RadarRing, RadarTool } from '@/data/crateRadar'

// Accent palette (GitHub dark-mode accessible set). Traffic-light semantics:
// green = safe to adopt … red = hold/caution. The verdict is *also* encoded by
// radial band + blip shape, so it stays legible in greyscale.
export const RING_COLORS: Record<RadarRing, string> = {
  Adopt: '#3fb950',
  Trial: '#58a6ff',
  Assess: '#d29922',
  Hold: '#f85149',
}

export const RING_HELP: Record<RadarRing, string> = {
  Adopt: 'Proven — safe to standardize on',
  Trial: 'Worth using on real work, eyes open',
  Assess: 'Promising — explore before betting',
  Hold: 'Proceed with caution / don’t newly depend',
}

// Screen-space angle ranges (deg, y-down): agentic=TL, inference=TR, data=BL, dev=BR.
export const QUAD_ANGLE: Record<RadarQuadrant, [number, number]> = {
  agentic: [180, 270],
  inference: [270, 360],
  data: [90, 180],
  dev: [0, 90],
}

// Intrinsic SVG geometry. The rendered size is driven by the container; these
// are the coordinates the blips live in. Keep them stable — they are the
// source of truth the transform group multiplies over.
export const R = 300
export const PAD = 52
// Ring boundaries (fraction of R), inner→outer.
export const BOUNDS = [0, 0.42, 0.6, 0.78, 0.95] as const
export const A_PAD = 11 // degrees of breathing room from each quadrant edge

export const VIEW = 2 * R + 2 * PAD // full viewBox extent (width == height)
// viewBox is `-PAD -PAD VIEW VIEW`, so content coordinates are NOT PAD-offset:
// the radar center stays at (R, R) and the visible window simply starts at -PAD.
export const VIEW_MIN = -PAD
export const CENTER = R // center of the radar, in viewBox user-space
export const OUTER = BOUNDS[4] * R

export interface Blip extends RadarTool {
  number: number
  x: number
  y: number
  r: number
  weight: number
}

export interface Transform {
  x: number
  y: number
  scale: number
}

export const IDENTITY: Transform = { x: 0, y: 0, scale: 1 }

export const MIN_SCALE = 0.6
export const MAX_SCALE = 4

export function clampScale(scale: number): number {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))
}

export function magnitude(s?: string): number {
  if (!s) return 0
  const m = String(s).match(/([\d.]+)\s*([kKmM])?/)
  if (!m || m[1] === undefined) return 0
  let v = Number.parseFloat(m[1])
  const u = (m[2] || '').toLowerCase()
  if (u === 'k') v *= 1e3
  if (u === 'm') v *= 1e6
  return v
}

// Hierarchy: bigger blip = more adopted. log-scaled so 13M doesn't dwarf 600★.
export function radiusFor(weight: number): number {
  if (!weight) return 8.5
  const r = 8 + (Math.log10(weight) - 2.5) * 3.0
  return Math.max(8, Math.min(17, r))
}

// Mid-radius (intrinsic coords, viewBox space without the PAD offset) of a ring band.
export function ringMidRadius(ringIndex: number): number {
  const inner = BOUNDS[ringIndex] ?? 0
  const outer = BOUNDS[ringIndex + 1] ?? BOUNDS[BOUNDS.length - 1] ?? 0
  return ((inner + outer) / 2) * R
}

export function buildBlips(tools: RadarTool[]): Blip[] {
  const out: Blip[] = []
  let n = 0
  for (const q of RADAR_QUADRANTS) {
    for (const ring of RADAR_RINGS) {
      const ri = RADAR_RINGS.indexOf(ring)
      const group = tools
        .filter((t) => t.quadrant === q.key && t.ring === ring)
        .sort((a, b) => magnitude(b.stars || b.downloads) - magnitude(a.stars || a.downloads))
      const angle = QUAD_ANGLE[q.key]
      const aStart = angle[0] + A_PAD
      const aEnd = angle[1] - A_PAD
      const bandIn = (BOUNDS[ri] ?? 0) * R
      const bandOut = (BOUNDS[ri + 1] ?? 0) * R
      group.forEach((t, gi) => {
        n += 1
        const frac = group.length === 1 ? 0.5 : gi / (group.length - 1)
        const ang = ((aStart + frac * (aEnd - aStart)) * Math.PI) / 180
        // alternate inner/outer within the band so neighbours don't collide
        const sub = group.length === 1 ? 0.5 : gi % 2 === 0 ? 0.36 : 0.66
        const rad = bandIn + (bandOut - bandIn) * sub
        const weight = magnitude(t.stars || t.downloads)
        out.push({
          ...t,
          number: n,
          weight,
          r: radiusFor(weight),
          x: R + rad * Math.cos(ang),
          y: R + rad * Math.sin(ang),
        })
      })
    }
  }
  return out
}

// ── Transform math ──────────────────────────────────────────────────────────
//
// The SVG content is wrapped in a `<g transform="translate(x,y) scale(s)">`.
// A point P in *content* space maps to screen space as  P * s + (x, y).
// Anchored zoom keeps the content point under the cursor invariant while the
// scale changes, which is the single biggest "feels modern" detail.

/**
 * Compute the new transform after zooming toward an anchor expressed in the
 * SVG's *intrinsic viewBox* coordinate system (i.e. the same units the blips
 * use, already offset by PAD). Solving `anchor*newScale + newXY = anchor*oldScale + oldXY`.
 */
export function anchoredZoom(
  t: Transform,
  nextScaleRaw: number,
  anchor: { x: number; y: number }
): Transform {
  const scale = clampScale(nextScaleRaw)
  if (scale === t.scale) return t
  return {
    scale,
    x: anchor.x - (anchor.x - t.x) * (scale / t.scale),
    y: anchor.y - (anchor.y - t.y) * (scale / t.scale),
  }
}

/** Center a given content point on screen at a target scale. */
export function centerOn(
  point: { x: number; y: number },
  scale: number,
  viewportCenter: { x: number; y: number }
): Transform {
  const s = clampScale(scale)
  return {
    scale: s,
    x: viewportCenter.x - point.x * s,
    y: viewportCenter.y - point.y * s,
  }
}

// Quadrant centroids in viewBox user-space. Each quadrant sits at ~52% of the
// outer radius along its diagonal. (Center is (R, R) — no PAD offset.)
const QUAD_CENTROID_FRAC = 0.52
export function quadrantCentroid(quadrant: RadarQuadrant): { x: number; y: number } {
  const [a0, a1] = QUAD_ANGLE[quadrant]
  const mid = (((a0 + a1) / 2) * Math.PI) / 180
  const rad = OUTER * QUAD_CENTROID_FRAC
  return { x: CENTER + rad * Math.cos(mid), y: CENTER + rad * Math.sin(mid) }
}

/** viewBox user-space coords of a blip (blips already live in this space). */
export function blipPoint(b: Blip): { x: number; y: number } {
  return { x: b.x, y: b.y }
}

export function transformStyle(t: Transform): string {
  return `translate(${t.x} ${t.y}) scale(${t.scale})`
}

/** Did the pointer move far enough to count as a drag rather than a click? */
export const DRAG_THRESHOLD = 5
