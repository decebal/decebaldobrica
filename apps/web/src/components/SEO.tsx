import type React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  pathname?: string
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Personal portfolio and blog discussing technology, web development, and programming.',
  keywords = ['web development', 'programming', 'technology', 'react', 'javascript'],
  ogImage = '/og-image.png',
  ogType = 'website',
  pathname = '',
}) => {
  const siteUrl = window.location.origin
  const url = `${siteUrl}${pathname}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEO
