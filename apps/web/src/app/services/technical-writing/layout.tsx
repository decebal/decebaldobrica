import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Writing for Developer Products',
  description:
    'Code-verified developer content, tutorials, migration guides, and product documentation for technical buyers.',
  alternates: { canonical: '/services/technical-writing' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
