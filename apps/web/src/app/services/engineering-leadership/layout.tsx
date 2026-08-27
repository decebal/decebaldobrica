import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fractional CTO & Engineering Leadership',
  description:
    'Technical direction, architecture review, delivery systems, and engineering leadership for product teams through Wolven Tech.',
  alternates: { canonical: '/services/engineering-leadership' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
