import { cn } from '@/lib/utils'
import type React from 'react'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  spotlight?: boolean
}

export const SpotlightCard = ({
  children,
  className,
  spotlight = true,
  ...props
}: SpotlightCardProps) => {
  return (
    <div
      className={cn(
        'relative w-full rounded-xl bg-gradient-to-b from-neutral-800/70 to-neutral-900/70 p-1',
        'before:pointer-events-none before:absolute before:-inset-px before:rounded-xl before:border before:border-neutral-700/50',
        'after:pointer-events-none after:absolute after:-inset-px after:rounded-xl after:shadow-[0_0_15px_rgba(255,255,255,0.07)]',
        'before:transition before:duration-500 hover:before:border-brand-teal/50',
        className
      )}
      {...props}
    >
      {spotlight && (
        <div className="pointer-events-none absolute -top-72 -left-28 z-10 h-[500px] w-[500px]">
          <div className="animate-spotlight absolute inset-0 bg-gradient-radial from-brand-teal/30 via-brand-teal/5 to-transparent" />
        </div>
      )}
      <div className="relative z-20">{children}</div>
    </div>
  )
}
