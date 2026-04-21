import type { ReactNode } from 'react'

interface SectionHeaderProps {
  kicker: string
  title: ReactNode
  subtitle?: ReactNode
}

export default function SectionHeader({ kicker, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-rust-primary-2">
        {kicker}
      </div>
      <h2 className="mt-1.5 text-[32px] font-extrabold tracking-tight text-rust-ink">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-[780px] text-base text-rust-ink-soft">{subtitle}</p>
      ) : null}
    </div>
  )
}
