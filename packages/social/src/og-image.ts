/**
 * Open Graph image generation for social media posts
 * Uses @vercel/og for template-based images
 */

interface OGImageOptions {
  title: string
  subtitle?: string
  author?: string
  date?: string
  tags?: string[]
  theme?: "light" | "dark"
}

/**
 * Generate OG image HTML for @vercel/og
 * This returns the JSX-like structure that @vercel/og expects
 */
export function generateOGImageHTML(options: OGImageOptions): any {
  const {
    title,
    subtitle,
    author = "Decebal Dobrica",
    date,
    tags = [],
    theme = "dark",
  } = options

  const isDark = theme === "dark"

  return {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "#0a1929" : "#ffffff",
        backgroundImage: isDark
          ? "radial-gradient(circle at 25px 25px, #1a2332 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a2332 2%, transparent 0%)"
          : "radial-gradient(circle at 25px 25px, #f0f0f0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f0f0 2%, transparent 0%)",
        backgroundSize: "100px 100px",
        padding: "60px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
              maxWidth: "1000px",
            },
            children: [
              // Title
              {
                type: "div",
                props: {
                  style: {
                    fontSize: title.length > 50 ? "60px" : "72px",
                    fontWeight: "bold",
                    color: isDark ? "#ffffff" : "#0a1929",
                    lineHeight: 1.2,
                    marginBottom: subtitle ? "20px" : "40px",
                    maxWidth: "900px",
                  },
                  children: title,
                },
              },
              // Subtitle
              ...(subtitle
                ? [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "32px",
                          color: isDark ? "#94a3b8" : "#64748b",
                          lineHeight: 1.4,
                          marginBottom: "40px",
                          maxWidth: "800px",
                        },
                        children: subtitle,
                      },
                    },
                  ]
                : []),
              // Tags
              ...(tags.length > 0
                ? [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          gap: "12px",
                          marginBottom: "40px",
                        },
                        children: tags.slice(0, 3).map((tag: string) => ({
                          type: "div",
                          props: {
                            style: {
                              backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                              color: isDark ? "#03c9a9" : "#0891b2",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontSize: "24px",
                              fontWeight: 500,
                            },
                            children: `#${tag}`,
                          },
                        })),
                      },
                    },
                  ]
                : []),
              // Footer (author and date)
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "auto",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "28px",
                          color: isDark ? "#94a3b8" : "#64748b",
                        },
                        children: author,
                      },
                    },
                    ...(date
                      ? [
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: "28px",
                                color: isDark ? "#64748b" : "#94a3b8",
                              },
                              children: date,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Generate OG image URL for a blog post
 * This creates a URL that points to your OG image API endpoint
 */
export function generateOGImageUrl(
  blogPost: {
    title: string
    excerpt?: string
    date?: string
    tags?: string[]
  },
  baseUrl: string = "https://decebaldobrica.com"
): string {
  const params = new URLSearchParams({
    title: blogPost.title,
    ...(blogPost.excerpt && { subtitle: blogPost.excerpt }),
    ...(blogPost.date && { date: blogPost.date }),
    ...(blogPost.tags && { tags: blogPost.tags.join(",") }),
  })

  return `${baseUrl}/api/og?${params.toString()}`
}

/**
 * Prompt for AI-generated social media images
 * Use with DALL-E, Midjourney, or Stable Diffusion
 */
export function generateAIImagePrompt(blogPost: {
  title: string
  excerpt: string
  tags?: string[]
}): string {
  const techKeywords = blogPost.tags?.join(", ") || "technology, software"

  return `Create a modern, professional social media banner image for a tech blog post.

Title: ${blogPost.title}
Topic: ${blogPost.excerpt}
Keywords: ${techKeywords}

Style: Clean, modern, tech-focused
Colors: Dark blue gradient background (#0a1929 to #1a2332) with teal accents (#03c9a9)
Elements: Abstract tech patterns, subtle grid lines, minimal geometric shapes
Mood: Professional, innovative, cutting-edge
Aspect ratio: 1200x630 (OG image standard)

Requirements:
- No text in the image (will be added separately)
- Leave center space clear for text overlay
- Professional and eye-catching
- Suitable for LinkedIn and Twitter
- Modern tech aesthetic`
}
