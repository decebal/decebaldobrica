import { cn } from './lib/utils'
import type React from 'react'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const ShimmerButton = ({ children, className, ...props }: ShimmerButtonProps) => {
  return (
    <button
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'bg-black/95 px-6 py-3 transition-all duration-300',
        'hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem] hover:shadow-brand-teal/40',
        'active:scale-100',
        'disabled:pointer-events-none disabled:opacity-50',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-brand-teal/10 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%]',
        'before:transition-transform before:duration-500',
        'border border-brand-teal/20 hover:border-brand-teal/50',
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}
