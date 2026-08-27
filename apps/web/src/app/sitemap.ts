import { caseStudies } from '@/data/caseStudies'
import { getAllBlogPosts } from '@/lib/blogPosts'
import { serviceOfferings } from '@/lib/serviceOfferings'
import type { MetadataRoute } from 'next'

const siteUrl = 'https://decebaldobrica.com'

const staticPages = [
  '',
  '/about',
  '/ai',
  '/blog',
  '/contact',
  '/cookies',
  '/open-source',
  '/radar',
  '/refunds',
  '/rust',
  '/services',
  '/services/architecture-docs',
  '/services/case-studies',
  '/services/engineering-leadership',
  '/services/technical-writing',
  '/smart-contracts',
  '/privacy',
  '/terms',
  '/testimonials',
  '/work',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts()

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
  }))

  const serviceEntries: MetadataRoute.Sitemap = serviceOfferings.map((offering) => ({
    url: `${siteUrl}/services/${offering.slug}`,
  }))

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.canonicalUrl || post.canonicalUrl.startsWith(siteUrl))
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }))

  const workEntries: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${siteUrl}/work/${study.slug}`,
  }))

  return [...staticEntries, ...serviceEntries, ...postEntries, ...workEntries]
}
