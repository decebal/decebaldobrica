#!/usr/bin/env bun

/**
 * Blog Post Publishing Automation
 *
 * This script automates the entire publishing workflow:
 * 1. Loads blog post from MDX
 * 2. Sends newsletter to subscribers
 * 3. Posts to LinkedIn
 * 4. Posts to Twitter
 * 5. Generates and uses social media images
 *
 * Usage: bun run publish-post --slug=my-blog-post
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { sendNewsletterIssue } from '@decebal/email'
import { createNewsletterIssue, getActiveSubscribers, markIssueSent } from '@decebal/newsletter'
import { generateOGImageUrl, postToAllPlatforms } from '@decebal/social'
import matter from 'gray-matter'

/**
 * Guarded-send config. Lets verification run the FULL publish path (load post →
 * create issue event in AllSource → resolve subscribers → reach the send loop)
 * WITHOUT emailing real subscribers.
 *
 *  - PUBLISH_DRY_RUN=1 (or --dry-run): log intended recipients, send nothing.
 *  - --test-recipient=<addr> (or PUBLISH_TEST_RECIPIENT): send ONLY to that
 *    address, never to the resolved subscriber list.
 *
 * With neither flag the real (unguarded) send path runs — that is the mode the
 * human uses for a real publish.
 */
interface SendGuard {
  dryRun: boolean
  testRecipient: string | null
}

function resolveSendGuard(argv: string[]): SendGuard {
  const dryRun = process.env.PUBLISH_DRY_RUN === '1' || argv.includes('--dry-run')
  const testArg = argv.find((a) => a.startsWith('--test-recipient='))
  const testRecipient =
    (testArg ? testArg.replace('--test-recipient=', '') : process.env.PUBLISH_TEST_RECIPIENT) ||
    null
  return { dryRun, testRecipient }
}

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  author: string
  published: boolean
}

/**
 * Load blog post from MDX file
 */
function loadBlogPost(slug: string): BlogPost | null {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const files = readdirSync(contentDir)
    const mdxFile = files.find((f) => f.endsWith('.mdx') && f.includes(slug))

    if (!mdxFile) {
      console.error(`❌ Blog post not found: ${slug}`)
      console.log('\nAvailable posts:')
      const mdxFiles = files.filter((f) => f.endsWith('.mdx'))
      for (const f of mdxFiles) {
        console.log(`  - ${f.replace('.mdx', '')}`)
      }
      return null
    }

    const filePath = join(contentDir, mdxFile)
    const fileContent = readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug: mdxFile.replace('.mdx', ''),
      title: data.title || '',
      excerpt: data.excerpt || data.description || '',
      content,
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      author: data.author || 'Decebal Dobrica',
      published: data.published !== false,
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

/**
 * Convert MDX content to HTML for email
 */
function mdxToHtml(content: string): string {
  // Basic MDX to HTML conversion
  // In production, use a proper MDX parser like @mdx-js/mdx
  const html = content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')

  return `<p>${html}</p>`
}

/**
 * Send newsletter to subscribers
 */
async function sendNewsletterToSubscribers(
  post: BlogPost,
  guard: SendGuard
): Promise<{ sent: number; errors: number }> {
  console.log('\n📧 Sending newsletter to subscribers...')
  if (guard.dryRun) {
    console.log('🧪 DRY RUN — no real emails will be sent (recipients logged only)')
  } else if (guard.testRecipient) {
    console.log(`🧪 TEST RECIPIENT — sending only to ${guard.testRecipient}`)
  }

  try {
    // Create newsletter issue (appends issue.created to AllSource)
    const contentHtml = mdxToHtml(post.content)
    const issue = await createNewsletterIssue({
      title: post.title,
      subject: `New Post: ${post.title}`,
      preview_text: post.excerpt,
      content_html: contentHtml,
      content_text: post.content,
      tier: 'all', // Send to all tiers
      blog_post_slug: post.slug,
    })

    if (!issue.success || !issue.issueId) {
      console.error('❌ Failed to create newsletter issue')
      return { sent: 0, errors: 1 }
    }
    console.log(`📝 Created newsletter issue in AllSource: ${issue.issueId}`)

    // Resolve active subscribers from the AllSource projection
    const subscribers = await getActiveSubscribers('all')

    if (subscribers.length === 0) {
      console.log('⚠️  No active subscribers found')
      return { sent: 0, errors: 0 }
    }

    console.log(
      `📬 Resolved ${subscribers.length} active subscriber(s): ${subscribers
        .map((s) => s.email)
        .join(', ')}`
    )

    const subject = `New Post: ${post.title}`
    let sent = 0
    let errors = 0

    // Send to each subscriber (guarded). In production use a batching service.
    for (const subscriber of subscribers) {
      if (guard.dryRun) {
        // Full path up to (not including) the real send.
        console.log(`   [dry-run] would send "${subject}" to ${subscriber.email}`)
        sent++
        continue
      }

      // In test-recipient mode, never send to the real subscriber list.
      const recipient = guard.testRecipient ?? subscriber.email
      try {
        const result = await sendNewsletterIssue(recipient, subject, contentHtml)
        if (result.success) {
          sent++
          process.stdout.write('.')
        } else {
          errors++
          process.stdout.write('x')
        }
      } catch (_error) {
        errors++
        process.stdout.write('x')
      }

      // test-recipient sends a single email then stops scanning the list.
      if (guard.testRecipient) break
    }

    console.log(
      `\n✅ Newsletter ${guard.dryRun ? 'dry-run' : 'send'}: ${sent} ok, ${errors} failed`
    )

    // Record issue.sent only for a real send (not dry-run / single test email).
    if (!guard.dryRun && !guard.testRecipient && sent > 0) {
      await markIssueSent(issue.issueId, sent)
      console.log('📨 Recorded issue.sent in AllSource')
    }

    return { sent, errors }
  } catch (error) {
    console.error('❌ Newsletter sending error:', error)
    return { sent: 0, errors: 1 }
  }
}

/**
 * Post to social media platforms
 */
async function postToSocialMedia(post: BlogPost): Promise<void> {
  console.log('\n📱 Posting to social media...')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://decebaldobrica.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // Generate OG image URL
  const imageUrl = generateOGImageUrl(
    {
      title: post.title,
      excerpt: post.excerpt.slice(0, 100),
      date: new Date(post.date).toLocaleDateString(),
      tags: post.tags,
    },
    baseUrl
  )

  // Post to all platforms
  const results = await postToAllPlatforms({
    title: post.title,
    excerpt: post.excerpt,
    url: postUrl,
    tags: post.tags,
    imageUrl,
    date: post.date,
  })

  // Report results
  if (results.linkedin?.success) {
    console.log(`✅ LinkedIn: ${results.linkedin.postUrl}`)
  } else {
    console.log(`❌ LinkedIn: ${results.linkedin?.error || 'Failed'}`)
  }

  if (results.twitter?.success) {
    console.log(`✅ Twitter: ${results.twitter.tweetUrl}`)
    if (results.twitter.threadIds && results.twitter.threadIds.length > 1) {
      console.log(`   Thread: ${results.twitter.threadIds.length} tweets`)
    }
  } else {
    console.log(`❌ Twitter: ${results.twitter?.error || 'Failed'}`)
  }
}

/**
 * Main publishing function
 */
async function publishBlogPost(slug: string, guard: SendGuard): Promise<void> {
  console.log('🚀 Blog Post Publishing Automation')
  console.log('=====================================\n')

  // 1. Load blog post
  console.log(`📄 Loading blog post: ${slug}...`)
  const post = loadBlogPost(slug)

  if (!post) {
    process.exit(1)
  }

  if (!post.published) {
    console.error('❌ Post is marked as draft (published: false)')
    process.exit(1)
  }

  console.log(`✅ Loaded: ${post.title}`)
  console.log(`   Author: ${post.author}`)
  console.log(`   Date: ${post.date}`)
  console.log(`   Tags: ${post.tags.join(', ')}`)

  // 2. Send newsletter (guarded — see resolveSendGuard)
  await sendNewsletterToSubscribers(post, guard)

  // 3. Post to social media — skipped in dry-run to avoid real public posts.
  if (guard.dryRun) {
    console.log('\n📱 Social media: skipped (dry-run)')
  } else {
    await postToSocialMedia(post)
  }

  // Done!
  console.log('\n✨ Publishing complete!')
  console.log('\nNext steps:')
  console.log('  - Check your email for newsletter delivery')
  console.log('  - Visit LinkedIn and Twitter to see posts')
  console.log('  - Monitor engagement and replies\n')
}

/**
 * CLI Entry Point
 */
const args = process.argv.slice(2)
const slugArg = args.find((arg) => arg.startsWith('--slug='))

if (!slugArg) {
  console.error('❌ Missing --slug argument')
  console.log('\nUsage:')
  console.log('  bun run publish-post --slug=my-blog-post')
  console.log('\nExample:')
  console.log('  bun run publish-post --slug=nextjs-15-features')
  process.exit(1)
}

const slug = slugArg.replace('--slug=', '')
const guard = resolveSendGuard(args)
publishBlogPost(slug, guard)
