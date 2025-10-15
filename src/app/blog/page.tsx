import Footer from '@/components/Footer'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, getAllBlogPosts, getAllTags } from '@/lib/blogPosts'
import { config } from '@/lib/personalConfig'
import { Calendar, ChevronLeft, ChevronRight, Clock, ExternalLink, Tag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const POSTS_PER_PAGE = 10

interface BlogPageProps {
  searchParams: {
    page?: string
  }
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const allPosts = await getAllBlogPosts()
  const allTags = await getAllTags()

  // Pagination - await searchParams in Next.js 15
  const params = await searchParams
  const currentPage = Number(params?.page) || 1
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const posts = allPosts.slice(startIndex, endIndex)

  // Count posts per tag
  const tagCounts = new Map<string, number>()
  for (const post of allPosts) {
    post.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  }

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-brand-heading">Blog</h1>
              <Link
                href="/rss.xml"
                className="text-brand-teal hover:underline flex items-center gap-1"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="1"></circle>
                </svg>
                RSS Feed
              </Link>
            </div>

            <p className="text-xl text-gray-300 mb-4">
              Thoughts, stories and ideas about technology, development and more.
            </p>

            {/* Tag Filter - Horizontal Scroll */}
            {allTags.length > 0 && (
              <div className="mb-8 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-brand-teal/60" />
                  <span className="text-sm text-gray-400">Filter by topic:</span>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 pb-2">
                    <Link href="/blog">
                      <Badge
                        variant="outline"
                        className="border-brand-teal/50 text-white bg-brand-teal/20 hover:bg-brand-teal/30 cursor-pointer transition-colors px-2.5 py-1 text-xs whitespace-nowrap"
                      >
                        All ({allPosts.length})
                      </Badge>
                    </Link>
                    {allTags.map((tag) => (
                      <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                        <Badge
                          variant="outline"
                          className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10 cursor-pointer transition-colors px-2.5 py-1 text-xs whitespace-nowrap"
                        >
                          {tag} ({tagCounts.get(tag) || 0})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center p-10 brand-card">
                <p className="text-xl text-gray-300">No blog posts found.</p>
                <p className="text-gray-400 mt-2">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <React.Fragment key={post.slug}>
                    <Card
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-brand-teal/50 transition-all hover:scale-[1.02]"
                    >
                      <CardHeader>
                        <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-white text-2xl mb-2 hover:text-brand-teal transition-colors">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="text-gray-300 text-base">
                                {post.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-4">
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
                        </Link>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
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
                      </CardHeader>
                    </Card>

                    {/* Newsletter signup after 3rd post on first page */}
                    {currentPage === 1 && index === 2 && (
                      <NewsletterSignup variant="inline" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/20 hover:bg-brand-teal/30 text-white rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                )}

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="text-gray-400 px-2">
                            ...
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <Link
                        key={page}
                        href={page === 1 ? '/blog' : `/blog?page=${page}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-brand-teal text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/20 hover:bg-brand-teal/30 text-white rounded-lg transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="mt-4 text-center text-gray-400 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, allPosts.length)} of {allPosts.length}{' '}
                posts
              </div>
            )}

            {/* Featured Newsletter Signup */}
            <div className="mt-16">
              <NewsletterSignup variant="featured" showBenefits={true} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BlogPage
