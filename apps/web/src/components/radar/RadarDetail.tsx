'use client'

import { RADAR_QUADRANTS } from '@/data/crateRadar'
import { cn } from '@/lib/utils'
import { ExternalLink, X } from 'lucide-react'
import type { Blip } from './geometry'
import { RING_COLORS, RING_HELP } from './geometry'

interface RadarDetailProps {
  detail: Blip | null
  isMobile: boolean
  onClose: () => void
}

function DetailBody({ detail }: { detail: Blip }) {
  const quadLabel = RADAR_QUADRANTS.find((q) => q.key === detail.quadrant)?.label
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-black"
          style={{ background: RING_COLORS[detail.ring] }}
        >
          {detail.number}
        </span>
        <a
          href={detail.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-lg font-bold text-slate-50 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        >
          {detail.name}
          <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
        </a>
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold text-black"
          style={{ background: RING_COLORS[detail.ring] }}
        >
          {detail.ring}
        </span>
        <span
          className={cn(
            'text-[10px] font-bold',
            detail.returning ? 'text-slate-400' : 'text-emerald-400'
          )}
        >
          {detail.returning ? '● returning' : '▲ new'}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {RING_HELP[detail.ring]} · {detail.category}
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-slate-500">Maintenance</dt>
        <dd className="text-slate-200">{detail.maintenance}</dd>
        <dt className="text-slate-500">Latest</dt>
        <dd className="text-slate-200">{detail.latest}</dd>
        <dt className="text-slate-500">Adoption</dt>
        <dd className="text-slate-200">
          {[detail.stars, detail.downloads].filter(Boolean).join(' · ') || '—'}
        </dd>
        {detail.adopters && (
          <>
            <dt className="text-slate-500">Users</dt>
            <dd className="text-slate-200">{detail.adopters}</dd>
          </>
        )}
        <dt className="text-slate-500">Seen in</dt>
        <dd className="text-slate-300">{detail.mentions}</dd>
      </dl>
      {detail.note && <p className="mt-2 text-[11px] italic text-slate-400">{detail.note}</p>}
      <p className="mt-3 text-[11px] text-slate-500">
        Press <kbd className="rounded border border-white/15 px-1">Esc</kbd> to close · ▲ new · ●
        returning · size ≈ adoption
      </p>
    </div>
  )
}

export default function RadarDetail({ detail, isMobile, onClose }: RadarDetailProps) {
  if (!detail) return null

  if (isMobile) {
    // Bottom sheet on small viewports.
    return (
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 animate-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none">
        <div className="rounded-t-2xl border-t border-white/10 bg-slate-950/95 p-4 text-slate-200 shadow-2xl backdrop-blur-md">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" aria-hidden />
          <button
            type="button"
            aria-label="Close detail"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-md p-1 text-slate-400 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <DetailBody detail={detail} />
        </div>
      </div>
    )
  }

  // Floating glass card (desktop), top-right.
  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-30 w-[min(90vw,22rem)] animate-in fade-in slide-in-from-right-2 duration-200 motion-reduce:animate-none md:right-5 md:top-5">
      <div className="relative rounded-2xl border border-white/10 bg-slate-950/85 p-4 text-slate-200 shadow-xl backdrop-blur-md">
        <button
          type="button"
          aria-label="Close detail"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-slate-400 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        <DetailBody detail={detail} />
      </div>
    </div>
  )
}
