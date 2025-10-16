'use client'

import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'

interface ConfettiProps {
  particleCount?: number
}

interface Particle {
  id: number
  x: number
  startY: number
  endY: number
  size: number
  delay: number
  duration: number
  rotation: number
  color: string
}

export function Confetti({ particleCount = 50 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    setParticles(
      Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        startY: -10,
        endY: 110,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 2,
        rotation: Math.random() * 360,
        color:
          ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)] ||
          '#10b981',
      }))
    )
  }, [particleCount])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
          initial={{
            y: `${particle.startY}%`,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: `${particle.endY}%`,
            rotate: particle.rotation,
            opacity: 0,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}
