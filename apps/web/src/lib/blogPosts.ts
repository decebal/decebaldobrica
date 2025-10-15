import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

/**
 * Blog posts management
 * Reads MDX files from content/blog directory
 */

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string // ISO date string
  author: string
  content?: string
  tags?: string[]
  coverImage?: string
  readingTime?: string
  canonicalUrl?: string // For imported posts from old blog
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * Get all blog posts
 * Returns posts sorted by date (newest first)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Check if content directory exists
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    console.warn('Blog content directory not found:', BLOG_CONTENT_DIR)
    return []
  }

  const files = fs.readdirSync(BLOG_CONTENT_DIR).filter((file) => file.endsWith('.mdx'))

  const posts = files.map((file) => {
    const filePath = path.join(BLOG_CONTENT_DIR, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')

    const { data, content } = matter(fileContent)
    const stats = readingTime(content)

    return {
      slug: data.slug || file.replace('.mdx', ''),
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Decebal Dobrica',
      tags: data.tags || [],
      content,
      readingTime: stats.text,
      canonicalUrl: data.canonicalUrl,
    } as BlogPost
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const stats = readingTime(content)

  return {
    slug: data.slug || slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'Decebal Dobrica',
    tags: data.tags || [],
    content,
    readingTime: stats.text,
    canonicalUrl: data.canonicalUrl,
  }
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.filter((post) => post.tags?.includes(tag))
}

/**
 * Get all unique tags from blog posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  const tags = new Set<string>()

  for (const post of posts) {
    post.tags?.forEach((tag) => tags.add(tag))
  }

  return Array.from(tags).sort()
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
