import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, getAllBlogPosts, getAllTags } from '@/lib/blogPosts'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, Tag } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 10

interface TagPageProps {
  params: {
    tag: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)
  const posts = await getAllBlogPosts()
  const filteredPosts = posts.filter((post) => post.tags?.includes(tag))

  return {
    title: `${tag} - Blog`,
    description: `Browse ${filteredPosts.length} blog posts about ${tag}`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)
  const allPosts = await getAllBlogPosts()
  const allTags = await getAllTags()
  const allFilteredPosts = allPosts.filter((post) => post.tags?.includes(tag))

  if (allFilteredPosts.length === 0) {
    notFound()
  }

  // Pagination - await searchParams in Next.js 15
  const searchParamsAwaited = await searchParams
  const currentPage = Number(searchParamsAwaited?.page) || 1
  const totalPages = Math.ceil(allFilteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const posts = allFilteredPosts.slice(startIndex, endIndex)

  // Count posts per tag
  const tagCounts = new Map<string, number>()
  for (const post of allPosts) {
    post.tags?.forEach((t) => {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
    })
  }

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="h-8 w-8 text-brand-teal" />
                <h1 className="text-4xl font-bold text-white">{tag}</h1>
              </div>
              <p className="text-xl text-gray-300">
                {allFilteredPosts.length} {allFilteredPosts.length === 1 ? 'post' : 'posts'} tagged
                with "{tag}"
              </p>
            </div>

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
                        className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10 cursor-pointer transition-colors px-2.5 py-1 text-xs whitespace-nowrap"
                      >
                        All ({allPosts.length})
                      </Badge>
                    </Link>
                    {allTags.map((t) => (
                      <Link key={t} href={`/blog/tag/${encodeURIComponent(t)}`}>
                        <Badge
                          variant="outline"
                          className={`cursor-pointer transition-colors px-2.5 py-1 text-xs whitespace-nowrap ${
                            t === tag
                              ? 'border-brand-teal/50 text-white bg-brand-teal/20 hover:bg-brand-teal/30'
                              : 'border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10'
                          }`}
                        >
                          {t} ({tagCounts.get(t) || 0})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-brand-teal/50 transition-all hover:scale-[1.02] cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-white text-2xl mb-2">{post.title}</CardTitle>
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
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((postTag) => (
                            <Link key={postTag} href={`/blog/tag/${encodeURIComponent(postTag)}`}>
                              <Badge
                                variant="outline"
                                className={`cursor-pointer transition-colors ${
                                  postTag === tag
                                    ? 'border-brand-teal/50 text-white bg-brand-teal/20'
                                    : 'border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10'
                                }`}
                              >
                                {postTag}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={
                      currentPage === 2
                        ? `/blog/tag/${encodeURIComponent(tag)}`
                        : `/blog/tag/${encodeURIComponent(tag)}?page=${currentPage - 1}`
                    }
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
                        href={
                          page === 1
                            ? `/blog/tag/${encodeURIComponent(tag)}`
                            : `/blog/tag/${encodeURIComponent(tag)}?page=${page}`
                        }
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
                    href={`/blog/tag/${encodeURIComponent(tag)}?page=${currentPage + 1}`}
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
                Showing {startIndex + 1}-{Math.min(endIndex, allFilteredPosts.length)} of{' '}
                {allFilteredPosts.length} posts
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
