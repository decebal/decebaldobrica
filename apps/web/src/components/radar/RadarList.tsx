'use client'

import { RADAR_QUADRANTS, RADAR_RINGS } from '@/data/crateRadar'
import type { RadarQuadrant, RadarRing } from '@/data/crateRadar'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@decebal/ui/sheet'
import type { Blip } from './geometry'
import { RING_COLORS } from './geometry'

interface RadarListProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blips: Blip[]
  hiddenRings: Set<RadarRing>
  hiddenQuads: Set<RadarQuadrant>
  selectedNum: number | null
  focusNum: number | null
  onHover: (n: number | null) => void
  onSelect: (n: number) => void
}

export default function RadarList({
  open,
  onOpenChange,
  blips,
  hiddenRings,
  hiddenQuads,
  selectedNum,
  focusNum,
  onHover,
  onSelect,
}: RadarListProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[min(92vw,24rem)] border-white/10 bg-slate-950/95 text-slate-200 backdrop-blur-md sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-50">Browse all tools</SheetTitle>
          <SheetDescription className="text-slate-400">
            Respects your active filters. Selecting a tool centers it on the radar.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 max-h-[calc(100svh-8rem)] space-y-5 overflow-y-auto pr-1">
          {RADAR_QUADRANTS.map((q) => {
            if (hiddenQuads.has(q.key)) return null
            const items = blips
              .filter((b) => b.quadrant === q.key && !hiddenRings.has(b.ring))
              .sort((a, c) => RADAR_RINGS.indexOf(a.ring) - RADAR_RINGS.indexOf(c.ring))
            if (!items.length) return null
            return (
              <div key={q.key}>
                <h2 className="mb-1.5 border-b border-white/10 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {q.label}
                </h2>
                <ul>
                  {items.map((t) => (
                    <li key={t.number}>
                      <button
                        type="button"
                        onClick={() => onSelect(t.number)}
                        onMouseEnter={() => onHover(t.number)}
                        onMouseLeave={() => onHover(null)}
                        onFocus={() => onHover(t.number)}
                        onBlur={() => onHover(null)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none',
                          selectedNum === t.number
                            ? 'bg-sky-500/15'
                            : focusNum === t.number
                              ? 'bg-white/[0.08]'
                              : 'hover:bg-white/[0.08]'
                        )}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black"
                          style={{ background: RING_COLORS[t.ring] }}
                        >
                          {t.number}
                        </span>
                        <span className="truncate font-semibold text-slate-100">{t.name}</span>
                        <span className="ml-auto shrink-0 text-[11px] text-slate-400">
                          {t.stars || t.downloads || ''}
                        </span>
                        <span
                          className="shrink-0 text-[10px] font-bold"
                          style={{ color: RING_COLORS[t.ring] }}
                        >
                          {t.ring}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
