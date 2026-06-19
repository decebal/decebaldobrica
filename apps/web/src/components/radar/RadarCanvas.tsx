'use client'

import { RADAR_QUADRANTS, RADAR_RINGS } from '@/data/crateRadar'
import type { RadarQuadrant } from '@/data/crateRadar'
import { cn } from '@/lib/utils'
import { useCallback, useRef } from 'react'
import {
  BOUNDS,
  type Blip,
  CENTER,
  DRAG_THRESHOLD,
  OUTER,
  RING_COLORS,
  type Transform,
  VIEW,
  VIEW_MIN,
  ringMidRadius,
  transformStyle,
} from './geometry'
import type { useRadarTransform } from './useRadarTransform'

type RadarTransformApi = ReturnType<typeof useRadarTransform>

interface RadarCanvasProps {
  blips: Blip[]
  transform: Transform
  api: RadarTransformApi
  isVisible: (b: Blip) => boolean
  focusedQuadrant: RadarQuadrant | null
  hiddenQuads: Set<RadarQuadrant>
  focusNum: number | null
  selectedNum: number | null
  reducedMotion: boolean
  onHoverBlip: (n: number | null) => void
  onSelectBlip: (n: number) => void
  onFocusQuadrant: (q: RadarQuadrant) => void
  onBackgroundClick: () => void
  registerBlipRef: (n: number, el: SVGGElement | null) => void
}

const cssVars = `
.radar-blip:focus-visible { outline: none }
.radar-blip:focus-visible .radar-shape { stroke: #38bdf8; stroke-width: 3 }
.radar-blip-anim { transition: opacity .35s ease, transform .35s cubic-bezier(.22,1,.36,1) }
.radar-blip-anim .radar-shape,
.radar-blip-anim text { transform-box: fill-box; transform-origin: center }
.radar-reduced .radar-blip-anim { transition: none }
`

export default function RadarCanvas({
  blips,
  transform,
  api,
  isVisible,
  focusedQuadrant,
  hiddenQuads,
  focusNum,
  selectedNum,
  reducedMotion,
  onHoverBlip,
  onSelectBlip,
  onFocusQuadrant,
  onBackgroundClick,
  registerBlipRef,
}: RadarCanvasProps) {
  // Pointer drag tracking — distinguishes pan from click via DRAG_THRESHOLD.
  const dragState = useRef<{
    pointerId: number
    startX: number
    startY: number
    lastX: number
    lastY: number
    moved: boolean
  } | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    // Ignore secondary buttons; let blips/controls keep their own handlers.
    if (e.button !== 0) return
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
    }
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = dragState.current
      if (!d || d.pointerId !== e.pointerId) return
      const totalDx = e.clientX - d.startX
      const totalDy = e.clientY - d.startY
      if (!d.moved && Math.hypot(totalDx, totalDy) < DRAG_THRESHOLD) return
      if (!d.moved) {
        d.moved = true
        e.currentTarget.setPointerCapture(e.pointerId)
      }
      api.panByPixels(e.clientX - d.lastX, e.clientY - d.lastY)
      d.lastX = e.clientX
      d.lastY = e.clientY
    },
    [api]
  )

  const endDrag = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragState.current
    if (!d || d.pointerId !== e.pointerId) return
    if (d.moved && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragState.current = null
  }, [])

  // Was the just-finished interaction a drag (suppress click) or a tap (allow)?
  const consumedDrag = useRef(false)
  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      consumedDrag.current = dragState.current?.moved ?? false
      endDrag(e)
    },
    [endDrag]
  )

  const onWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault()
      const anchor = api.toUserSpace(e.clientX, e.clientY)
      // Trackpad pinch arrives as wheel+ctrlKey; normalise both to a factor.
      const factor = Math.exp(-e.deltaY * 0.0015)
      api.zoomAt(factor, anchor)
    },
    [api]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGSVGElement>) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        api.zoomBy(1.25)
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        api.zoomBy(0.8)
      } else if (e.key === '0') {
        e.preventDefault()
        api.reset()
      }
    },
    [api]
  )

  const handleBackgroundClick = useCallback(() => {
    if (consumedDrag.current) {
      consumedDrag.current = false
      return
    }
    onBackgroundClick()
  }, [onBackgroundClick])

  const quadLabelPos: Record<RadarQuadrant, [number, number, 'start' | 'end']> = {
    agentic: [CENTER - OUTER, CENTER - OUTER - 14, 'start'],
    inference: [CENTER + OUTER, CENTER - OUTER - 14, 'end'],
    data: [CENTER - OUTER, CENTER + OUTER + 24, 'start'],
    dev: [CENTER + OUTER, CENTER + OUTER + 24, 'end'],
  }

  const viewBox = `${VIEW_MIN} ${VIEW_MIN} ${VIEW} ${VIEW}`

  return (
    <svg
      ref={api.svgRef}
      viewBox={viewBox}
      className={cn(
        'absolute inset-0 h-full w-full touch-none select-none',
        dragState.current?.moved ? 'cursor-grabbing' : 'cursor-grab',
        reducedMotion && 'radar-reduced'
      )}
      role="application"
      aria-label="Rust and AI crate radar — pan, zoom, and select tools. Blips sized by adoption."
      aria-roledescription="Interactive radar"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: intentional keyboard-operable application surface (role="application") for pan/zoom — focusability is required.
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={endDrag}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <title>Rust &amp; AI Crate Radar</title>
      <style>{cssVars}</style>

      {/* Transparent background catcher: a click here (no drag) clears focus.
          The same action is keyboard-reachable via the global Esc handler and
          the explicit close buttons, so this decorative catcher needs no key handler. */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative click-catcher; clearing focus is reachable via Esc and close buttons. */}
      <rect
        x={VIEW_MIN}
        y={VIEW_MIN}
        width={VIEW}
        height={VIEW}
        fill="transparent"
        aria-hidden
        onClick={handleBackgroundClick}
      />

      <g transform={transformStyle(transform)}>
        {/* Rings */}
        {[4, 3, 2, 1].map((i) => (
          <g key={i}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={(BOUNDS[i] ?? 0) * CENTER}
              fill={i % 2 ? 'rgba(255,255,255,0.025)' : 'transparent'}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={(BOUNDS[i] ?? 0) * CENTER}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={CENTER}
          y1={CENTER - OUTER}
          x2={CENTER}
          y2={CENTER + OUTER}
          stroke="rgba(255,255,255,0.18)"
        />
        <line
          x1={CENTER - OUTER}
          y1={CENTER}
          x2={CENTER + OUTER}
          y2={CENTER}
          stroke="rgba(255,255,255,0.18)"
        />

        {/* Ring labels */}
        {RADAR_RINGS.map((ring, i) => (
          <text
            key={ring}
            x={CENTER}
            y={CENTER - ringMidRadius(i) + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight={600}
            fill="#94a3b8"
            pointerEvents="none"
          >
            {ring}
          </text>
        ))}

        {/* Quadrant labels (clickable to focus that quadrant) */}
        {RADAR_QUADRANTS.map((q) => {
          const [x, y, anchor] = quadLabelPos[q.key]
          const dim = hiddenQuads.has(q.key)
          const active = focusedQuadrant === q.key
          return (
            <text
              key={q.key}
              x={x}
              y={y}
              textAnchor={anchor}
              fontSize="13"
              fontWeight={700}
              className="cursor-pointer focus:outline-none focus-visible:underline"
              fill={dim ? '#64748b' : active ? '#7dd3fc' : '#e2e8f0'}
              tabIndex={0}
              // biome-ignore lint/a11y/useSemanticElements: an SVG <text> can't be a real <button>; role + tabIndex + aria-label + key handler is the accessible-SVG pattern.
              role="button"
              aria-label={`Focus ${q.label} quadrant`}
              onClick={(e) => {
                e.stopPropagation()
                onFocusQuadrant(q.key)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onFocusQuadrant(q.key)
                }
              }}
            >
              {q.label}
            </text>
          )
        })}

        {/* Blips */}
        {blips.map((b) => {
          const vis = isVisible(b)
          const isFocus = focusNum === b.number
          const isSelected = selectedNum === b.number
          const color = RING_COLORS[b.ring]
          // Dim non-focused blips when a quadrant is in focus, or when a single blip is focused.
          const quadDim = focusedQuadrant != null && b.quadrant !== focusedQuadrant
          const otherFocusDim = focusNum != null && !isFocus
          const opacity = !vis ? 0.08 : quadDim ? 0.22 : otherFocusDim ? 0.4 : 1
          const labelEl = RADAR_QUADRANTS.find((q) => q.key === b.quadrant)?.label
          return (
            <g
              key={b.number}
              ref={(el) => registerBlipRef(b.number, el)}
              className="radar-blip radar-blip-anim cursor-pointer"
              tabIndex={vis ? 0 : -1}
              // biome-ignore lint/a11y/useSemanticElements: an SVG <g> blip can't be a real <button>; role + tabIndex + aria-label + key handler is the accessible-SVG pattern.
              role="button"
              aria-label={`${b.name}, ${b.ring}, ${labelEl}${b.stars ? `, ${b.stars}` : ''}`}
              aria-pressed={isSelected}
              style={{ opacity, transform: vis ? undefined : 'scale(0.55)' }}
              onMouseEnter={() => vis && onHoverBlip(b.number)}
              onMouseLeave={() => onHoverBlip(null)}
              onFocus={() => vis && onHoverBlip(b.number)}
              onBlur={() => onHoverBlip(null)}
              onClick={(e) => {
                e.stopPropagation()
                if (vis && !consumedDrag.current) onSelectBlip(b.number)
                consumedDrag.current = false
              }}
              onKeyDown={(e) => {
                if (vis && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onSelectBlip(b.number)
                }
              }}
            >
              <title>{`${b.name} — ${b.ring}`}</title>
              {b.returning ? (
                <circle
                  className="radar-shape"
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  fill={color}
                  stroke={isFocus ? '#fff' : 'none'}
                  strokeWidth={isFocus ? 2.5 : 0}
                />
              ) : (
                <polygon
                  className="radar-shape"
                  points={`${b.x},${b.y - b.r * 1.15} ${b.x - b.r * 1.1},${b.y + b.r * 0.85} ${b.x + b.r * 1.1},${b.y + b.r * 0.85}`}
                  fill={color}
                  stroke={isFocus ? '#fff' : 'none'}
                  strokeWidth={isFocus ? 2.5 : 0}
                />
              )}
              <text
                x={b.x}
                y={b.y + (b.returning ? 0 : 3)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={b.r > 11 ? 11 : 9}
                fontWeight={700}
                fill="#0b0b0b"
                pointerEvents="none"
              >
                {b.number}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
