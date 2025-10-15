'use client'

import { cn } from '@decebal/ui/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface ComicTextProps {
  children: string
  className?: string
  delay?: number
}

export function ComicText({ children, className, delay = 0 }: ComicTextProps) {
  const letters = children.split('')

  return (
    <div className={cn('inline-block', className)}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: -20, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.05,
            type: 'spring',
            stiffness: 200,
          }}
          className="inline-block"
          style={{
            textShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  )
}
