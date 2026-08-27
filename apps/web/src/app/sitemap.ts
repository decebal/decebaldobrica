import { caseStudies } from '@/data/caseStudies'
import { getAllBlogPosts } from '@/lib/blogPosts'
import type { MetadataRoute } from 'next'

const siteUrl = 'https://decebaldobrica.com'

const staticPages = [
  '',
  '/about',
  '/ai',
  '/blog',
  '/contact',
  '/newsletter/pricing',
  '/radar',
  '/rust',
  '/services',
  '/services/architecture-docs',
  '/services/case-studies',
  '/services/engineering-leadership',
  '/services/technical-writing',
  '/smart-contracts',
  '/testimonials',
  '/work',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts()

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === '' || path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/blog' || path === '/work' ? 0.8 : 0.7,
  }))

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.canonicalUrl || post.canonicalUrl.startsWith(siteUrl))
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  const workEntries: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${siteUrl}/work/${study.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...postEntries, ...workEntries]
}
