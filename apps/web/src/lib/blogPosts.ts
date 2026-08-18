import fs from 'node:fs'
import path from 'node:path'
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
 * A post is a draft (and therefore invisible to the site) if either:
 *   - the filename starts with `_`, or
 *   - the frontmatter says `draft: true`.
 *
 * Drafts never appear in listings, RSS, tags or static params, and the article
 * route refuses to render them. Publishing is a one-line frontmatter change or
 * dropping the underscore; the filename itself is not the source of truth.
 */
function isDraftFileName(fileName: string): boolean {
  return fileName.startsWith('_')
}

/** The canonical slug for a post: frontmatter wins, filename is the fallback. */
function slugFor(fileName: string, data: Record<string, unknown>): string {
  return (data.slug as string) || fileName.replace(/^_+/, '').replace('.mdx', '')
}

function toPost(fileName: string, fileContent: string): BlogPost & { draft: boolean } {
  const { data, content } = matter(fileContent)
  const stats = readingTime(content)

  return {
    slug: slugFor(fileName, data),
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'Decebal Dobrica',
    tags: data.tags || [],
    content,
    readingTime: stats.text,
    canonicalUrl: data.canonicalUrl,
    draft: isDraftFileName(fileName) || data.draft === true,
  }
}

function readAllPosts(): (BlogPost & { draft: boolean })[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    console.warn('Blog content directory not found:', BLOG_CONTENT_DIR)
    return []
  }

  return fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => toPost(file, fs.readFileSync(path.join(BLOG_CONTENT_DIR, file), 'utf-8')))
}

/**
 * Get all published blog posts
 * Returns posts sorted by date (newest first). Drafts are excluded.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return readAllPosts()
    .filter((post) => !post.draft)
    .map(({ draft: _draft, ...post }) => post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a single published blog post by slug.
 *
 * Resolves on the frontmatter `slug`, not the filename, so a post is reachable
 * at the URL it advertises in listings and RSS regardless of what the file is
 * called. Drafts resolve to null.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Fast path: the common case where filename and slug agree.
  const directPath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`)
  if (fs.existsSync(directPath)) {
    const post = toPost(`${slug}.mdx`, fs.readFileSync(directPath, 'utf-8'))
    if (!post.draft && post.slug === slug) {
      const { draft: _draft, ...rest } = post
      return rest
    }
  }

  // Fall back to matching on the frontmatter slug.
  const match = readAllPosts().find((post) => !post.draft && post.slug === slug)
  if (!match) return null

  const { draft: _draft, ...rest } = match
  return rest
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
    if (post.tags) {
      for (const tag of post.tags) {
        tags.add(tag)
      }
    }
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
