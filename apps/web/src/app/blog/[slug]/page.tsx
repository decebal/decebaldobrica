import fs from 'node:fs'
import path from 'node:path'
import { BlogCTA } from '@/components/BlogCTA'
import { BlogTOC } from '@/components/BlogTOC'
import Footer from '@/components/Footer'
import { RadarBanner, shouldShowRadarBanner } from '@/components/RadarBanner'
import { Terminal, TerminalCommand, TerminalLine, TerminalOutput } from '@/components/blog/Terminal'
import { extractText } from '@/components/blog/extractText'
import { getAllBlogPosts, getBlogPost } from '@/lib/blogPosts'
import { formatDate } from '@/lib/blogPosts'
import { articleSchema, breadcrumbSchema, jsonLd } from '@/lib/structuredData'
import { Badge } from '@decebal/ui/badge'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

/**
 * Social card resolution: a post gets /images/social/<slug>.png when that file
 * exists (the per-issue card generated at publish time), otherwise the site's
 * default opengraph image. Without an explicit og:image, LinkedIn/X render
 * imageless link cards — public/opengraph-image.png is NOT auto-wired by
 * Next.js (the file convention only applies inside app/).
 */
function getSocialImage(slug: string): string {
  const socialPath = path.join(process.cwd(), 'public', 'images', 'social', `${slug}.png`)
  return fs.existsSync(socialPath) ? `/images/social/${slug}.png` : '/opengraph-image.png'
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const socialImage = getSocialImage(slug)

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      type: 'article',
      url: `/blog/${slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: socialImage, width: 1200, height: 760, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [socialImage],
    },
    alternates: {
      canonical: post.canonicalUrl || `/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const showRadar = shouldShowRadarBanner(post.tags)
  const socialImage = getSocialImage(slug)
  const article = articleSchema({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    datePublished: post.date,
    image: socialImage,
  })
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${slug}` },
  ])

  return (
    <div className="min-h-screen relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            {/* Post header */}
            <article className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                      <Badge
                        variant="outline"
                        className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10 cursor-pointer transition-colors"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Radar promo — slim strip (Rust/AI posts only) */}
              {showRadar && <RadarBanner variant="strip" />}

              {/* Archive Notice for Imported Posts */}
              {post.canonicalUrl && (
                <div className="bg-brand-teal/10 border-l-4 border-brand-teal rounded-lg p-4 mb-8">
                  <p className="text-gray-100 text-sm">
                    📚 <strong>Archive:</strong> This post was imported from my previous blog at{' '}
                    <a
                      href="https://decebalonprogramming.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:underline"
                    >
                      decebalonprogramming.net
                    </a>
                  </p>
                </div>
              )}

              {/* Table of Contents */}
              <BlogTOC content={post.content ?? ''} />

              {/* Post content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-white mb-4 mt-8 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-white mb-3 mt-6">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">{children}</h3>
                      ),
                      p: ({ children }) => <p className="text-gray-300 mb-4">{children}</p>,
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 text-gray-300 mb-4 space-y-4">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-300 leading-relaxed">{children}</li>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-brand-teal hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      code: ({ className, children }) => {
                        const isInline = !className
                        if (isInline) {
                          return (
                            <code className="bg-brand-teal/10 text-brand-teal px-1.5 py-0.5 rounded text-sm">
                              {children}
                            </code>
                          )
                        }

                        // Check if this is a terminal code block
                        const isTerminal =
                          className?.includes('language-terminal') ||
                          className?.includes('language-bash') ||
                          className?.includes('language-shell') ||
                          className?.includes('language-console')

                        if (isTerminal) {
                          // Parse terminal content. rehype-highlight turns the
                          // code body into token elements, so String(children)
                          // would yield "[object Object]" — extract the text.
                          const content = extractText(children).trim()
                          const lines = content.split('\n')

                          // Extract title from first line if it's a comment
                          let title = 'Terminal'
                          let contentLines = lines
                          if (lines[0]?.startsWith('#')) {
                            title = lines[0].replace(/^#\s*/, '')
                            contentLines = lines.slice(1)
                          }
                          const terminalLines = contentLines.map((line, index) => ({
                            key: `${index}:${line}`,
                            line,
                          }))

                          return (
                            <Terminal title={title} user="user" host="localhost" path="~">
                              {terminalLines.map(({ key, line }) => {
                                // Detect command lines (start with $ or >)
                                if (line.startsWith('$ ') || line.startsWith('> ')) {
                                  return (
                                    <TerminalCommand key={key}>
                                      {line.replace(/^[$>]\s*/, '')}
                                    </TerminalCommand>
                                  )
                                }
                                // Detect output variants
                                if (
                                  line.startsWith('✓') ||
                                  line.startsWith('✅') ||
                                  line.includes('success')
                                ) {
                                  return (
                                    <TerminalOutput key={key} variant="success">
                                      {line}
                                    </TerminalOutput>
                                  )
                                }
                                if (
                                  line.startsWith('✗') ||
                                  line.startsWith('❌') ||
                                  line.includes('error')
                                ) {
                                  return (
                                    <TerminalOutput key={key} variant="error">
                                      {line}
                                    </TerminalOutput>
                                  )
                                }
                                if (line.startsWith('⚠') || line.includes('warning')) {
                                  return (
                                    <TerminalOutput key={key} variant="warning">
                                      {line}
                                    </TerminalOutput>
                                  )
                                }
                                // Default output
                                return <TerminalLine key={key}>{line}</TerminalLine>
                              })}
                            </Terminal>
                          )
                        }

                        return <code className={className}>{children}</code>
                      },
                      pre: ({ children }) => {
                        // Skip pre wrapper if Terminal component is already rendered
                        const isTerminalBlock =
                          children &&
                          typeof children === 'object' &&
                          'props' in children &&
                          children.props?.className?.includes('language-terminal')

                        if (isTerminalBlock) {
                          return <>{children}</>
                        }

                        return (
                          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                            {children}
                          </pre>
                        )
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-brand-teal pl-4 italic text-gray-200 my-4">
                          {children}
                        </blockquote>
                      ),
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt || ''} className="rounded-lg my-6 w-full" />
                      ),
                      hr: () => <hr className="border-white/10 my-6" />,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-brand-teal/20 border-b-2 border-brand-teal">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-white/10">{children}</tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-white/5 transition-colors">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                          {children}
                        </td>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-brand-teal font-bold">{children}</strong>
                      ),
                      em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Radar promo — compact card above the connect CTA (Rust/AI posts only) */}
              {showRadar && <RadarBanner variant="card" />}

              {/* Call to Action */}
              <BlogCTA postTitle={post.title} />
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
