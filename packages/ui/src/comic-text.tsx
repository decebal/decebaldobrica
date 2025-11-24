'use client'

import { cn } from './lib/utils'
import { motion } from 'motion/react'
import React from 'react'

interface ComicTextProps {
  children: string
  className?: string
  delay?: number
}

export function ComicText({ children, className, delay = 0 }: ComicTextProps) {
  const letters = children.split('').map((letter, idx) => ({ letter, id: `char-${idx}` }))

  return (
    <div className={cn('inline-block', className)}>
      {letters.map((item, idx) => (
        <motion.span
          key={item.id}
          initial={{ y: -20, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + idx * 0.05,
            type: 'spring',
            stiffness: 200,
          }}
          className="inline-block"
          style={{
            textShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)',
          }}
        >
          {item.letter === ' ' ? '\u00A0' : item.letter}
        </motion.span>
      ))}
    </div>
  )
}
