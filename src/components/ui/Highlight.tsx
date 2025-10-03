import React from 'react'

interface HighlightProps {
  children: React.ReactNode
}

export function Highlight({ children }: HighlightProps) {
  return (
    <span className="text-brand-teal font-semibold">
      {children}
    </span>
  )
}
