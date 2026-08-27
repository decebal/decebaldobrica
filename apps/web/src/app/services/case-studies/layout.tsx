import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical B2B Case Study Writing',
  description:
    'Evidence-led technical case studies that explain constraints, engineering decisions, implementation, and measurable outcomes.',
  alternates: { canonical: '/services/case-studies' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
