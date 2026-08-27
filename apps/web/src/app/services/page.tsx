import type { Metadata } from 'next'
import { ServicesClient } from './ServicesClient'

export const metadata: Metadata = {
  title: 'Rust, Agentic AI & Technical Leadership Services',
  description:
    'Engineering services delivered through Wolven Tech: Rust systems, agentic AI architecture, technical leadership, and evidence-led technical content.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesClient />
}
