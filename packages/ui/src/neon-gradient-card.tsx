'use client'

import { cn } from '@/lib/utils'
import type React from 'react'
import type { CSSProperties } from 'react'

interface NeonGradientCardProps {
  children: React.ReactNode
  className?: string
  borderSize?: number
  borderRadius?: number
  neonColors?: {
    firstColor: string
    secondColor: string
  }
}

export function NeonGradientCard({
  children,
  className,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: '#14b8a6',
    secondColor: '#0891b2',
  },
}: NeonGradientCardProps) {
  return (
    <div
      className={cn('relative', className)}
      style={
        {
          '--border-size': `${borderSize}px`,
          '--border-radius': `${borderRadius}px`,
          '--neon-first-color': neonColors.firstColor,
          '--neon-second-color': neonColors.secondColor,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[var(--border-radius)]"
        style={{
          background: `
            linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
            linear-gradient(135deg, var(--neon-first-color), var(--neon-second-color)) border-box
          `,
          border: 'var(--border-size) solid transparent',
          animation: 'neon-pulse 3s ease-in-out infinite',
        }}
      />
      <div className="relative z-10 rounded-[calc(var(--border-radius)-var(--border-size))] bg-brand-navy/90 backdrop-blur-sm p-6">
        {children}
      </div>

      <style jsx>{`
        @keyframes neon-pulse {
          0%,
          100% {
            opacity: 1;
            filter: drop-shadow(0 0 10px var(--neon-first-color))
              drop-shadow(0 0 20px var(--neon-first-color));
          }
          50% {
            opacity: 0.8;
            filter: drop-shadow(0 0 20px var(--neon-second-color))
              drop-shadow(0 0 30px var(--neon-second-color));
          }
        }
      `}</style>
    </div>
  )
}
