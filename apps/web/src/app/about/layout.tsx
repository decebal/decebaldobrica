import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Decebal Dobrica — Rust & AI Product Engineer',
  description:
    'Background, open-source work, and production experience of Decebal Dobrica, founder and principal engineer at Wolven Tech.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
