import { RADAR_RINGS, crateRadarTools } from '@/data/crateRadar'
import { Button } from '@decebal/ui/button'
import { ArrowRight, Radar } from 'lucide-react'
import Link from 'next/link'

// Tags that make a post relevant to the Rust & AI Crate Radar. A post showing
// any of these gets the banner; everything else (personal/older posts) stays clean.
const RADAR_TAGS = new Set(['rust', 'crates', 'crate-radar', 'ai', 'llm', 'agents', 'inference'])

export function shouldShowRadarBanner(tags?: string[]): boolean {
  if (!tags?.length) return false
  return tags.some((t) => RADAR_TAGS.has(t.toLowerCase()))
}

// Ring accent colors mirror the radar itself (traffic-light verdict semantics).
const RING_DOT: Record<string, string> = {
  Adopt: '#3fb950',
  Trial: '#58a6ff',
  Assess: '#d29922',
  Hold: '#f85149',
}

const TOOL_COUNT = crateRadarTools.length

function RingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {RADAR_RINGS.map((ring) => (
        <span
          key={ring}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: RING_DOT[ring] }}
        />
      ))}
    </span>
  )
}

interface RadarBannerProps {
  /** `strip` = slim one-liner (top of post); `card` = compact CTA card (bottom). */
  variant?: 'strip' | 'card'
}

export function RadarBanner({ variant = 'card' }: RadarBannerProps) {
  if (variant === 'strip') {
    return (
      <Link
        href="/radar"
        className="group mb-8 flex items-center gap-3 rounded-lg border border-brand-teal/30 bg-white/5 px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-brand-teal/60 hover:bg-brand-teal/10"
      >
        <Radar className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
        <span className="text-sm text-gray-300">
          <span className="font-semibold text-white">Rust &amp; AI Crate Radar</span>
          <span className="hidden sm:inline">
            {' '}
            — {TOOL_COUNT} tools mapped by Adopt / Trial / Assess / Hold
          </span>
        </span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-teal">
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    )
  }

  return (
    <div className="mt-12 flex flex-col gap-4 rounded-xl border border-brand-teal/30 bg-white/5 p-5 backdrop-blur-sm sm:flex-row sm:items-center">
      {/* Radar glyph */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-teal/40 bg-brand-teal/10">
        <Radar className="h-6 w-6 text-brand-teal" aria-hidden="true" />
      </div>

      {/* Copy */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white">Rust &amp; AI Crate Radar</h3>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-300">
          Every tool I feature, mapped by verdict
          <RingDots />
          <span className="text-gray-400">· {TOOL_COUNT} tools</span>
        </p>
      </div>

      {/* CTA */}
      <Link href="/radar" className="shrink-0">
        <Button className="bg-brand-teal text-white hover:bg-brand-teal/80">
          Explore the radar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
