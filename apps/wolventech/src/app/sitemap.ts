import { siteUrl } from '@/lib/site'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/services/rust-consulting`, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${siteUrl}/services/software-technical-due-diligence`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
