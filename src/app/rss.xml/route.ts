// RSS feed route handler
// Generates RSS 2.0 feed from blog posts

import { type BlogPost, getAllBlogPosts } from '@/lib/blogPosts'
import type { NextRequest } from 'next/server'

const generateRssFeed = (posts: BlogPost[]): string => {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const buildDate = new Date().toUTCString()

  const rssItems = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Decebal Dobrica - Blog</title>
    <description>Thoughts, stories and ideas about technology, development and more.</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`
}

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllBlogPosts()
    const rssFeed = generateRssFeed(posts)

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('RSS feed generation error:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
