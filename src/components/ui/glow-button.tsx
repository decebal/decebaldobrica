import { cn } from '@/lib/utils'
import type React from 'react'

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  glowColor?: string
}

export const GlowButton = ({
  children,
  className,
  glowColor = 'rgba(3, 201, 169, 0.35)',
  ...props
}: GlowButtonProps) => {
  return (
    <button
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'bg-brand-teal px-6 py-3 text-white',
        'transition-all duration-300',
        'hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem] hover:shadow-brand-teal/40',
        'active:scale-100',
        'disabled:pointer-events-none disabled:opacity-50',
        'after:absolute after:inset-0',
        'after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
        'after:translate-x-[-100%] hover:after:translate-x-[100%]',
        'after:transition-transform after:duration-500',
        'border border-brand-teal hover:border-brand-teal/80',
        className
      )}
      style={
        {
          '--glow-color': glowColor,
        } as React.CSSProperties
      }
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}
