import { getSpecialtyContent } from '@/lib/contentFilters'
import { config } from '@/lib/personalConfig'
import type { Metadata } from 'next'
import { RustLandingPage } from './RustLandingPage'

export const metadata: Metadata = {
  title: `Rust Developer & Contractor | ${config.name}`,
  description:
    'Expert Rust developer specializing in high-performance APIs, systems programming, and production-grade backend services. 30%+ performance improvements with Axum, SQLx, and async Rust.',
  keywords: [
    'Rust developer',
    'Rust contractor',
    'Axum',
    'performance optimization',
    'backend development',
    'systems programming',
    'async Rust',
    'SQLx',
    'PostgreSQL',
  ],
  openGraph: {
    title: `Rust Developer & Contractor | ${config.name}`,
    description:
      'Expert Rust developer specializing in high-performance APIs and systems programming.',
    type: 'website',
    url: `${config.website}/rust`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Rust Developer & Contractor | ${config.name}`,
    description: 'Expert Rust developer specializing in high-performance APIs.',
  },
}

export default async function RustPage() {
  const { blogPosts, caseStudies } = await getSpecialtyContent('rust')
  return <RustLandingPage blogPosts={blogPosts} caseStudies={caseStudies} />
}
