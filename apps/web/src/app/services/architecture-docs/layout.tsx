import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Software Architecture Documentation Service',
  description:
    'Architecture decision records, system maps, runbooks, and technical documentation grounded in the code and operating model.',
  alternates: { canonical: '/services/architecture-docs' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
