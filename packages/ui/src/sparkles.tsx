'use client'

import { motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useState } from 'react'

interface SparklesProps {
  children: React.ReactNode
  className?: string
  sparkleCount?: number
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export function Sparkles({ children, className, sparkleCount = 10 }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    // Generate sparkles only on client to avoid hydration mismatch
    setSparkles(
      Array.from({ length: sparkleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
      }))
    )
  }, [sparkleCount])

  return (
    <div className={`relative inline-block ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-brand-teal"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: sparkle.delay,
          }}
        />
      ))}
      {children}
    </div>
  )
}
