/**
 * Blog posts management
 * This file manages blog posts for the portfolio
 *
 * TODO: Integrate with your preferred content source:
 * - MDX files from a /content directory
 * - Headless CMS (Contentful, Sanity, etc.)
 * - Database (PostgreSQL, MongoDB, etc.)
 * - Git-based CMS (Forestry, Tina, etc.)
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
}

/**
 * Get all blog posts
 * Returns posts sorted by date (newest first)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual data source
  // Example implementations:

  // 1. From MDX files:
  // const files = await fs.readdir('./content/blog')
  // const posts = await Promise.all(files.map(async (file) => {
  //   const content = await fs.readFile(`./content/blog/${file}`, 'utf-8')
  //   const { data, content: mdxContent } = matter(content)
  //   return { slug: file.replace('.mdx', ''), ...data, content: mdxContent }
  // }))

  // 2. From CMS:
  // const posts = await cmsClient.getEntries({ content_type: 'blogPost' })

  // 3. From database:
  // const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.date))

  // For now, return empty array (or example posts for testing)
  const examplePosts: BlogPost[] = [
    // Uncomment to see example posts:
    // {
    //   slug: 'getting-started-with-nextjs',
    //   title: 'Getting Started with Next.js 15',
    //   description: 'A comprehensive guide to building modern web applications with Next.js 15 and the App Router.',
    //   date: new Date('2025-01-15').toISOString(),
    //   author: 'Decebal Dobrica',
    //   tags: ['nextjs', 'react', 'web development'],
    //   readingTime: '5 min read',
    // },
    // {
    //   slug: 'solana-pay-integration',
    //   title: 'Integrating Solana Pay for Crypto Payments',
    //   description: 'Learn how to accept cryptocurrency payments in your web app using Solana Pay.',
    //   date: new Date('2025-01-10').toISOString(),
    //   author: 'Decebal Dobrica',
    //   tags: ['solana', 'crypto', 'payments'],
    //   readingTime: '8 min read',
    // },
  ]

  return examplePosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts()
  return posts.find((post) => post.slug === slug) || null
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
