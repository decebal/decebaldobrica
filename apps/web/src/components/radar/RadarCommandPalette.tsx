'use client'

import { RADAR_QUADRANTS } from '@/data/crateRadar'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@decebal/ui/command'
import type { Blip } from './geometry'
import { RING_COLORS } from './geometry'

interface RadarCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blips: Blip[]
  onSelect: (n: number) => void
}

export default function RadarCommandPalette({
  open,
  onOpenChange,
  blips,
  onSelect,
}: RadarCommandPaletteProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools by name or category…" />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        {RADAR_QUADRANTS.map((q) => {
          const items = blips.filter((b) => b.quadrant === q.key)
          if (!items.length) return null
          return (
            <CommandGroup key={q.key} heading={q.label}>
              {items.map((b) => (
                <CommandItem
                  key={b.number}
                  // cmdk filters on this value — include name + category for fuzzy matching.
                  value={`${b.name} ${b.category} ${b.ring}`}
                  onSelect={() => onSelect(b.number)}
                  className="gap-2"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black"
                    style={{ background: RING_COLORS[b.ring] }}
                  >
                    {b.number}
                  </span>
                  <span className="font-medium text-foreground">{b.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{b.category}</span>
                  <span
                    className="ml-auto shrink-0 text-[10px] font-bold"
                    style={{ color: RING_COLORS[b.ring] }}
                  >
                    {b.ring}
                  </span>
                  {(b.stars || b.downloads) && (
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {b.stars || b.downloads}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}
