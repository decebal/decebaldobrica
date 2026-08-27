import type { MetadataRoute } from 'next'

const siteUrl = 'https://decebaldobrica.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/newsletter/confirm', '/newsletter/success', '/services/book'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
