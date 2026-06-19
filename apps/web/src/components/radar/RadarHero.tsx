'use client'

import { crateRadarTools } from '@/data/crateRadar'
import type { RadarQuadrant, RadarRing } from '@/data/crateRadar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import RadarBackdrop from './RadarBackdrop'
import RadarCanvas from './RadarCanvas'
import RadarCommandPalette from './RadarCommandPalette'
import RadarControls from './RadarControls'
import RadarDetail from './RadarDetail'
import RadarList from './RadarList'
import { type Blip, blipPoint, buildBlips, quadrantCentroid } from './geometry'
import { useRadarTransform } from './useRadarTransform'
import { useReducedMotion } from './useReducedMotion'

// Zoom levels for programmatic focus moves.
const QUADRANT_FOCUS_SCALE = 1.7
const BLIP_FOCUS_SCALE = 2.1

export default function RadarHero() {
  const blips = useMemo(() => buildBlips(crateRadarTools), [])
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const api = useRadarTransform()

  const [hiddenRings, setHiddenRings] = useState<Set<RadarRing>>(new Set())
  const [hiddenQuads, setHiddenQuads] = useState<Set<RadarQuadrant>>(new Set())
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [focusedQuadrant, setFocusedQuadrant] = useState<RadarQuadrant | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)

  // DOM refs for blip <g> nodes so we can move focus to a programmatically-selected blip.
  const blipRefs = useRef<Map<number, SVGGElement>>(new Map())
  const registerBlipRef = useCallback((n: number, el: SVGGElement | null) => {
    if (el) blipRefs.current.set(n, el)
    else blipRefs.current.delete(n)
  }, [])
  // Restore focus to whatever opened the palette.
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const isVisible = useCallback(
    (b: Blip) => !hiddenRings.has(b.ring) && !hiddenQuads.has(b.quadrant),
    [hiddenRings, hiddenQuads]
  )
  const shownCount = useMemo(() => blips.filter(isVisible).length, [blips, isVisible])
  const focusNum = hovered ?? selected
  const detail = useMemo(() => blips.find((b) => b.number === focusNum) ?? null, [blips, focusNum])

  const toggleRing = useCallback((ring: RadarRing) => {
    setHiddenRings((cur) => {
      const next = new Set(cur)
      if (next.has(ring)) next.delete(ring)
      else next.add(ring)
      return next
    })
  }, [])

  const toggleQuad = useCallback((quad: RadarQuadrant) => {
    setHiddenQuads((cur) => {
      const next = new Set(cur)
      if (next.has(quad)) next.delete(quad)
      else next.add(quad)
      return next
    })
    // Hiding the focused quadrant drops focus.
    setFocusedQuadrant((q) => (q === quad ? null : q))
  }, [])

  const focusQuadrant = useCallback(
    (quad: RadarQuadrant) => {
      setFocusedQuadrant((cur) => {
        if (cur === quad) {
          // Toggle off → back to full radar.
          api.reset()
          return null
        }
        api.focusPoint(quadrantCentroid(quad), QUADRANT_FOCUS_SCALE)
        return quad
      })
    },
    [api]
  )

  const selectBlip = useCallback(
    (n: number, opts?: { center?: boolean; focusDom?: boolean }) => {
      const b = blips.find((x) => x.number === n)
      if (!b) return
      setSelected((cur) => {
        // Plain click on an already-selected blip toggles it off (matches old behavior).
        if (cur === n && !opts?.center) return null
        return n
      })
      if (opts?.center) {
        api.focusPoint(blipPoint(b), BLIP_FOCUS_SCALE)
      }
      if (opts?.focusDom) {
        // Defer until the node is mounted/visible.
        requestAnimationFrame(() => blipRefs.current.get(n)?.focus())
      }
    },
    [api, blips]
  )

  const clearSelection = useCallback(() => {
    setSelected(null)
    setHovered(null)
  }, [])

  const handleBackgroundClick = useCallback(() => {
    if (focusedQuadrant) {
      setFocusedQuadrant(null)
      api.reset()
    } else {
      clearSelection()
    }
  }, [api, clearSelection, focusedQuadrant])

  const openPalette = useCallback(() => {
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null
    setPaletteOpen(true)
  }, [])

  const onPaletteSelect = useCallback(
    (n: number) => {
      setPaletteOpen(false)
      selectBlip(n, { center: true, focusDom: true })
    },
    [selectBlip]
  )

  const onListSelect = useCallback(
    (n: number) => {
      selectBlip(n, { center: true, focusDom: true })
      if (isMobile) setListOpen(false)
    },
    [isMobile, selectBlip]
  )

  // ⌘K / Ctrl+K to open the palette; Esc to step back out of focus/selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        openPalette()
        return
      }
      if (e.key === 'Escape') {
        // Let open dialogs handle their own Escape.
        if (paletteOpen || listOpen) return
        if (focusedQuadrant) {
          setFocusedQuadrant(null)
          api.reset()
        } else if (selected != null) {
          clearSelection()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [api, clearSelection, focusedQuadrant, listOpen, openPalette, paletteOpen, selected])

  // Restore focus when the palette closes (focus-trap restoration).
  useEffect(() => {
    if (!paletteOpen && restoreFocusRef.current) {
      const el = restoreFocusRef.current
      restoreFocusRef.current = null
      // Only restore if we didn't intentionally move focus to a blip.
      requestAnimationFrame(() => {
        if (document.activeElement === document.body) el.focus?.()
      })
    }
  }, [paletteOpen])

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-slate-950"
      style={{ height: 'calc(100svh - 5rem)', minHeight: '34rem' }}
      aria-label="Rust and AI Crate Radar interactive surface"
    >
      <RadarBackdrop />

      <RadarCanvas
        blips={blips}
        transform={api.transform}
        api={api}
        isVisible={isVisible}
        focusedQuadrant={focusedQuadrant}
        hiddenQuads={hiddenQuads}
        focusNum={focusNum}
        selectedNum={selected}
        reducedMotion={reducedMotion}
        onHoverBlip={setHovered}
        onSelectBlip={(n) => selectBlip(n)}
        onFocusQuadrant={focusQuadrant}
        onBackgroundClick={handleBackgroundClick}
        registerBlipRef={registerBlipRef}
      />

      {/* Overlays sit above the canvas; the wrapper is click-through so the
          canvas keeps receiving pan/zoom, while each panel re-enables pointers. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <RadarControls
          blips={blips}
          shownCount={shownCount}
          hiddenRings={hiddenRings}
          hiddenQuads={hiddenQuads}
          focusedQuadrant={focusedQuadrant}
          onToggleRing={toggleRing}
          onToggleQuad={toggleQuad}
          onFocusQuadrant={focusQuadrant}
          onZoomIn={() => api.zoomBy(1.3)}
          onZoomOut={() => api.zoomBy(0.77)}
          onReset={() => {
            setFocusedQuadrant(null)
            api.reset()
          }}
          onOpenPalette={openPalette}
        />

        <RadarDetail detail={detail} isMobile={isMobile} onClose={clearSelection} />

        {/* Browse-all trigger + "back to full radar" affordance */}
        <div className="pointer-events-auto absolute bottom-3 left-3 z-20 flex items-center gap-2 md:bottom-5 md:left-5">
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-sm font-semibold text-slate-200 shadow-xl backdrop-blur-md transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none"
          >
            <List className="h-4 w-4" aria-hidden />
            Browse all
          </button>
          {focusedQuadrant && (
            <button
              type="button"
              onClick={() => {
                setFocusedQuadrant(null)
                api.reset()
              }}
              className="rounded-xl border border-sky-400/40 bg-sky-500/15 px-3 py-2 text-sm font-semibold text-sky-100 shadow-xl backdrop-blur-md transition hover:bg-sky-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 motion-reduce:transition-none"
            >
              ← Full radar
            </button>
          )}
        </div>
      </div>

      <RadarList
        open={listOpen}
        onOpenChange={setListOpen}
        blips={blips}
        hiddenRings={hiddenRings}
        hiddenQuads={hiddenQuads}
        selectedNum={selected}
        focusNum={focusNum}
        onHover={setHovered}
        onSelect={onListSelect}
      />

      <RadarCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        blips={blips}
        onSelect={onPaletteSelect}
      />

      <span className={cn('sr-only')} aria-live="polite">
        {focusedQuadrant ? `Focused on ${focusedQuadrant} quadrant.` : 'Full radar view.'}
      </span>
    </section>
  )
}
