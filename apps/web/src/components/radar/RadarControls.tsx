'use client'

import { RADAR_GENERATED_AT, RADAR_QUADRANTS, RADAR_RINGS } from '@/data/crateRadar'
import type { RadarQuadrant, RadarRing } from '@/data/crateRadar'
import { cn } from '@/lib/utils'
import { Minus, Plus, Scan, Search } from 'lucide-react'
import type { Blip } from './geometry'
import { RING_COLORS, RING_HELP } from './geometry'

interface RadarControlsProps {
  blips: Blip[]
  shownCount: number
  hiddenRings: Set<RadarRing>
  hiddenQuads: Set<RadarQuadrant>
  focusedQuadrant: RadarQuadrant | null
  onToggleRing: (ring: RadarRing) => void
  onToggleQuad: (quad: RadarQuadrant) => void
  onFocusQuadrant: (quad: RadarQuadrant) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onOpenPalette: () => void
}

const glass = 'rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-md shadow-xl'

export default function RadarControls({
  blips,
  shownCount,
  hiddenRings,
  hiddenQuads,
  focusedQuadrant,
  onToggleRing,
  onToggleQuad,
  onFocusQuadrant,
  onZoomIn,
  onZoomOut,
  onReset,
  onOpenPalette,
}: RadarControlsProps) {
  return (
    <>
      {/* Top-left: title, live count, filters, search trigger */}
      <div
        className={cn(
          glass,
          'pointer-events-auto absolute left-3 top-3 z-20 w-[min(92vw,26rem)] p-4 text-slate-200 md:left-5 md:top-5 md:p-5'
        )}
      >
        <h1 className="text-xl font-bold tracking-tight text-slate-50 md:text-2xl">
          Rust &amp; AI Crate Radar
        </h1>
        <p className="mt-1 hidden text-sm text-slate-300 sm:block">
          A living map of every tool featured across the blog &amp; the{' '}
          <span className="text-slate-100">Rust Systems &amp; Agentic AI</span> newsletter — placed
          by quadrant and an Adopt / Trial / Assess / Hold verdict, sized by adoption.
        </p>
        <p className="mt-1.5 text-xs text-slate-400" aria-live="polite">
          Showing {shownCount} of {blips.length} tools · snapshot {RADAR_GENERATED_AT}
        </p>

        {/* Search affordance — discoverable ⌘K trigger, usable on touch */}
        <button
          type="button"
          onClick={onOpenPalette}
          className="mt-3 flex w-full items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1">Search tools…</span>
          <kbd className="hidden shrink-0 rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Ring filters */}
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] uppercase tracking-wide text-slate-500">Ring</span>
            {RADAR_RINGS.map((ring) => {
              const off = hiddenRings.has(ring)
              const count = blips.filter((b) => b.ring === ring).length
              return (
                <button
                  type="button"
                  key={ring}
                  aria-pressed={!off}
                  title={RING_HELP[ring]}
                  onClick={() => onToggleRing(ring)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none',
                    off
                      ? 'border-white/10 text-slate-500 line-through'
                      : 'border-white/20 text-slate-100 hover:bg-white/10'
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: RING_COLORS[ring] }}
                  />
                  {ring} <span className="text-slate-400">({count})</span>
                </button>
              )
            })}
          </div>
          {/* Area filters (toggle visibility); double as quadrant focus shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] uppercase tracking-wide text-slate-500">Area</span>
            {RADAR_QUADRANTS.map((q) => {
              const off = hiddenQuads.has(q.key)
              const active = focusedQuadrant === q.key
              return (
                <button
                  type="button"
                  key={q.key}
                  aria-pressed={!off}
                  onClick={() => onToggleQuad(q.key)}
                  onDoubleClick={() => !off && onFocusQuadrant(q.key)}
                  title={`Toggle ${q.label}. Double-click to zoom in.`}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none',
                    off
                      ? 'border-white/10 text-slate-500 line-through'
                      : active
                        ? 'border-sky-400/60 bg-sky-500/15 text-sky-100'
                        : 'border-white/20 text-slate-100 hover:bg-white/10'
                  )}
                >
                  {q.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Persistent legend — verdict reads in greyscale (radial band + shape). */}
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-snug text-slate-400">
          <span aria-hidden className="text-slate-300">
            ▲
          </span>
          new this cycle
          <span aria-hidden className="ml-1 text-slate-300">
            ●
          </span>
          featured before · size ≈ adoption
        </p>
      </div>

      {/* Bottom-right: zoom + reset controls */}
      <div
        className={cn(
          glass,
          'pointer-events-auto absolute bottom-3 right-3 z-20 flex flex-col gap-1 p-1.5 md:bottom-5 md:right-5'
        )}
      >
        <ControlButton label="Zoom in" onClick={onZoomIn}>
          <Plus className="h-5 w-5" aria-hidden />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={onZoomOut}>
          <Minus className="h-5 w-5" aria-hidden />
        </ControlButton>
        <ControlButton label="Reset view" onClick={onReset}>
          <Scan className="h-5 w-5" aria-hidden />
        </ControlButton>
      </div>
    </>
  )
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none"
    >
      {children}
    </button>
  )
}
