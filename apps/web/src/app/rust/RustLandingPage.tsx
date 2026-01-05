'use client'

import {
  type CrossLink,
  type ExpertiseItem,
  ProfileLandingPage,
} from '@/components/ProfileLandingPage'
import type { RelatedBlogPost, RelatedCaseStudy } from '@/components/RelatedContentSection'
import { SPECIALTY_META } from '@/lib/specialtyMeta'
import { Blocks, Brain, Cog, Database, Gauge, Users, Zap } from 'lucide-react'

const expertise: ExpertiseItem[] = [
  {
    title: 'High-Performance APIs',
    description:
      'Building blazing-fast REST and GraphQL APIs with Axum, Tower middleware, and async Rust. Optimized for production workloads with connection pooling and structured logging.',
    icon: <Zap className="w-6 h-6" />,
    skills: ['Axum', 'Tower', 'tokio', 'async/await', 'REST APIs'],
  },
  {
    title: 'Database Optimization',
    description:
      'Expert in PostgreSQL with SQLx for type-safe queries, connection pool tuning, and performance optimization. Achieved 30% faster response times through strategic pooling.',
    icon: <Database className="w-6 h-6" />,
    skills: ['SQLx', 'PostgreSQL', 'Connection Pooling', 'Query Optimization'],
  },
  {
    title: 'Systems Programming',
    description:
      "Leveraging Rust's memory safety and zero-cost abstractions for reliable, high-performance systems. Building backend services that run efficiently with minimal resource usage.",
    icon: <Cog className="w-6 h-6" />,
    skills: ['Memory Safety', 'Zero-Cost Abstractions', 'Concurrency', 'Error Handling'],
  },
  {
    title: 'Production Observability',
    description:
      'Implementing structured JSON logging, distributed tracing, and metrics for production visibility. Making systems debuggable and maintainable at scale.',
    icon: <Gauge className="w-6 h-6" />,
    skills: ['tracing', 'Structured Logging', 'Metrics', 'Sentry'],
  },
]

const crossLinks: CrossLink[] = [
  {
    title: 'AI Engineering',
    tagline: 'GenAI integration and RAG systems',
    href: '/ai',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    title: 'Smart Contracts',
    tagline: 'Blockchain and DeFi solutions',
    href: '/smart-contracts',
    icon: <Blocks className="w-5 h-5" />,
  },
  {
    title: 'Engineering Leadership',
    tagline: 'Strategic technical leadership',
    href: '/about',
    icon: <Users className="w-5 h-5" />,
  },
]

interface RustLandingPageProps {
  blogPosts: RelatedBlogPost[]
  caseStudies: RelatedCaseStudy[]
}

export function RustLandingPage({ blogPosts, caseStudies }: RustLandingPageProps) {
  const meta = SPECIALTY_META.rust

  return (
    <ProfileLandingPage
      specialty={meta.title}
      tagline={meta.tagline}
      heroDescription={
        <>
          <p>
            With <strong>15+ years in software engineering</strong> and hands-on Rust experience
            since 2024, I specialize in building <strong>high-performance backend systems</strong>.
            From blazing-fast APIs to production-grade services, I leverage Rust's memory safety and
            zero-cost abstractions to deliver reliable, efficient solutions.
          </p>
          <p>
            My recent work includes optimizing a{' '}
            <strong>cryptocurrency portfolio management API</strong>, achieving{' '}
            <strong>30% faster response times</strong> and <strong>10% lower memory usage</strong>
            through strategic connection pool optimization, structured logging, and multi-error
            validation.
          </p>
          <p>
            Whether you need a new Rust backend built from scratch, performance optimization for
            existing systems, or migration from other languages to Rust, I bring deep expertise in
            the ecosystem including <strong>Axum, SQLx, tokio, and Tower</strong>.
          </p>
        </>
      }
      expertise={expertise}
      relatedBlogPosts={blogPosts}
      relatedCaseStudies={caseStudies}
      contactCategory={meta.contactCategory}
      primaryCTAText="Discuss Your Rust Project"
      crossLinks={crossLinks}
    />
  )
}
