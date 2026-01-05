/**
 * Server-side content filtering utilities for specialty landing pages
 * This file is server-only due to blogPosts.ts dependency
 */
import 'server-only'

import type { ServiceCategory } from '@/data/caseStudies'
import { SPECIALTY_META, type Specialty } from './specialtyMeta'

// Re-export for convenience
export { type Specialty, SPECIALTY_META }

// Tag mappings for each specialty - used to filter blog posts
export const SPECIALTY_TAGS: Record<Specialty, string[]> = {
  rust: ['rust', 'performance', 'backend', 'axum', 'api', 'postgresql', 'optimization'],
  ai: [
    'ai',
    'machine-learning',
    'ml',
    'llm',
    'rag',
    'genai',
    'groq',
    'deep-learning',
    'neural-networks',
  ],
  'smart-contracts': [
    'blockchain',
    'solana',
    'ethereum',
    'smart-contracts',
    'web3',
    'crypto',
    'defi',
    'fintech',
  ],
  leadership: [
    'engineering-leadership',
    'hiring',
    'team-topologies',
    'architecture',
    'management',
    'cto',
    'interviews',
  ],
}

// Generic types for filtering (avoids importing from server modules at type level)
interface PostWithTags {
  tags?: string[]
  [key: string]: unknown
}

interface StudyWithCategories {
  serviceCategories?: ServiceCategory[]
  [key: string]: unknown
}

/**
 * Filter blog posts by specialty
 * Matches posts that have any tag in the specialty's tag list
 */
export function filterBlogPostsBySpecialty<T extends PostWithTags>(
  posts: T[],
  specialty: Specialty
): T[] {
  const relevantTags = SPECIALTY_TAGS[specialty]

  return posts.filter((post) => post.tags?.some((tag) => relevantTags.includes(tag.toLowerCase())))
}

/**
 * Filter case studies by service category
 * Matches case studies that have the specialty in their serviceCategories
 */
export function filterCaseStudiesBySpecialty<T extends StudyWithCategories>(
  caseStudies: T[],
  specialty: Specialty
): T[] {
  // Map specialty to service category
  const categoryMap: Record<Specialty, ServiceCategory> = {
    rust: 'rust',
    ai: 'ai',
    'smart-contracts': 'smart-contracts',
    leadership: 'leadership',
  }

  const category = categoryMap[specialty]

  return caseStudies.filter((study) => study.serviceCategories?.includes(category))
}

/**
 * Get related content for a specialty page
 * Returns filtered blog posts and case studies
 */
export async function getSpecialtyContent(
  specialty: Specialty,
  options?: {
    maxBlogPosts?: number
    maxCaseStudies?: number
  }
) {
  const { getAllBlogPosts } = await import('./blogPosts')
  const { getAllCaseStudies } = await import('@/data/caseStudies')

  const [allPosts, allCaseStudies] = await Promise.all([
    getAllBlogPosts(),
    Promise.resolve(getAllCaseStudies()),
  ])

  const blogPosts = filterBlogPostsBySpecialty(allPosts, specialty)
  const caseStudies = filterCaseStudiesBySpecialty(allCaseStudies, specialty)

  return {
    blogPosts: blogPosts.slice(0, options?.maxBlogPosts ?? 6),
    caseStudies: caseStudies.slice(0, options?.maxCaseStudies ?? 3),
    totalBlogPosts: blogPosts.length,
    totalCaseStudies: caseStudies.length,
  }
}

/**
 * Get cross-links for a specialty page
 * Returns other specialty pages to link to
 */
export function getSpecialtyCrossLinks(currentSpecialty: Specialty) {
  const allSpecialties: Specialty[] = ['rust', 'ai', 'smart-contracts', 'leadership']

  return allSpecialties
    .filter((s) => s !== currentSpecialty)
    .map((specialty) => ({
      specialty,
      href: specialty === 'leadership' ? '/about' : `/${specialty}`,
      ...SPECIALTY_META[specialty],
    }))
}
