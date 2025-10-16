'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type React from 'react'

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function NeonButton({
  children,
  className,
  variant = 'primary',
  ...props
}: NeonButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      className={cn(
        'relative px-6 py-3 rounded-lg font-semibold transition-all duration-300',
        'before:absolute before:inset-0 before:rounded-lg before:p-[2px]',
        'before:bg-gradient-to-r before:from-purple-500 before:via-violet-500 before:to-fuchsia-500',
        'before:-z-10 before:transition-all before:duration-300',
        'after:absolute after:inset-[2px] after:rounded-lg after:-z-10',
        isPrimary
          ? 'after:bg-gradient-to-r after:from-purple-600 after:to-violet-600 text-white hover:after:from-purple-500 hover:after:to-violet-500'
          : 'after:bg-brand-navy text-purple-400 hover:after:bg-brand-navy/80',
        'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...(props as React.ComponentPropsWithoutRef<'button'>)}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
