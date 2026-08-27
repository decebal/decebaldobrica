import type { MetadataRoute } from 'next'

const siteUrl = 'https://wolventech.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
