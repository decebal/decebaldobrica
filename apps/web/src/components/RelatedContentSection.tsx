'use client'

import { ArrowRight, BookOpen, Briefcase, Clock } from 'lucide-react'
import Link from 'next/link'

// Simplified types for client-side rendering (avoids importing from server-only modules)
export interface RelatedBlogPost {
  slug: string
  title: string
  description: string
  date: string
  readingTime?: string
}

export interface RelatedCaseStudy {
  slug: string
  title: string
  tagline: string
  role: string
  metrics: Array<{ label: string; value: string }>
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

interface RelatedBlogPostsProps {
  posts: RelatedBlogPost[]
  title?: string
  viewAllHref?: string
}

export function RelatedBlogPosts({
  posts,
  title = 'Related Articles',
  viewAllHref,
}: RelatedBlogPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-brand-teal hover:text-brand-teal/80 transition-colors flex items-center gap-1 text-sm"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1"
          >
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
              <h3 className="text-lg font-semibold text-brand-heading group-hover:text-brand-teal transition-colors line-clamp-2">
                {post.title}
              </h3>
            </div>
            <p className="text-white/80 text-sm line-clamp-2 mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>{formatDate(post.date)}</span>
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

interface RelatedCaseStudiesProps {
  caseStudies: RelatedCaseStudy[]
  title?: string
  viewAllHref?: string
}

export function RelatedCaseStudies({
  caseStudies,
  title = 'Case Studies',
  viewAllHref = '/work',
}: RelatedCaseStudiesProps) {
  if (caseStudies.length === 0) return null

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-brand-teal hover:text-brand-teal/80 transition-colors flex items-center gap-1 text-sm"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="group bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1"
          >
            <div className="flex items-start gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-brand-heading group-hover:text-brand-teal transition-colors">
                  {study.title}
                </h3>
                <p className="text-brand-teal text-sm mt-1">{study.role}</p>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-4">{study.tagline}</p>
            <div className="flex flex-wrap gap-3">
              {study.metrics.slice(0, 3).map((metric) => (
                <div key={metric.label} className="bg-brand-teal/10 px-3 py-1 rounded-full text-xs">
                  <span className="text-white/70">{metric.label}:</span>{' '}
                  <span className="text-brand-teal font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
