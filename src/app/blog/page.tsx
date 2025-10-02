import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getAllBlogPosts } from '@/lib/blogPosts'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BlogPage = async () => {
  const posts = await getAllBlogPosts()

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

            <p className="text-xl text-gray-300 mb-12">
              Thoughts, stories and ideas about technology, development and more.
            </p>

            {posts.length === 0 ? (
              <div className="text-center p-10 brand-card">
                <p className="text-xl text-gray-300">No blog posts found.</p>
                <p className="text-gray-400 mt-2">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-brand-teal/50 transition-all hover:scale-[1.02] cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-white text-2xl mb-2">
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
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-brand-teal/30 text-brand-teal"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BlogPage
