/**
 * Shared publishing core.
 *
 * Used by both publish entrypoints:
 *  - `publish-blog-post.ts`  → manual, one slug at a time (the human flow).
 *  - `publish-due-posts.ts`  → autopilot, scans for due+unsent posts (Fly cron).
 *
 * Keeping the load → build → send → social logic here means the two entrypoints
 * can never drift, and the localhost guard (assertProductionBaseUrl) protects
 * every send path from the bug where a laptop's `.env.local`
 * (NEXT_PUBLIC_APP_URL=http://localhost:3000) leaks dead links into real emails.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  type NewsletterIssueEmailProps,
  renderNewsletterIssue,
  sendNewsletterPost,
} from '@decebal/email'
import { createNewsletterIssue, getActiveSubscribers, markIssueSent } from '@decebal/newsletter'
import { generateOGImageUrl, postToAllPlatforms } from '@decebal/social'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  author: string
  published: boolean
  /** Opt a post OUT of the autopilot with `newsletter: false` in frontmatter. */
  newsletter: boolean
}

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
 * human uses for a real publish, and the mode the Fly cron uses on schedule.
 */
export interface SendGuard {
  dryRun: boolean
  testRecipient: string | null
}

export function resolveSendGuard(argv: string[]): SendGuard {
  const dryRun = process.env.PUBLISH_DRY_RUN === '1' || argv.includes('--dry-run')
  const testArg = argv.find((a) => a.startsWith('--test-recipient='))
  const testRecipient =
    (testArg ? testArg.replace('--test-recipient=', '') : process.env.PUBLISH_TEST_RECIPIENT) ||
    null
  return { dryRun, testRecipient }
}

/**
 * Canonical site URL used for every link in the email and every social post.
 * Defaults to production so a missing env var is safe; the real danger is an
 * env var explicitly set to localhost (see assertProductionBaseUrl).
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://decebaldobrica.com'
}

/** True for localhost / loopback hosts in a URL. */
export function isLocalhostUrl(url: string): boolean {
  return /\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|\/|$)/i.test(url)
}

/**
 * Hard guard against the original bug: a real send (to the subscriber list,
 * publicly to social) must never go out with localhost links. Permit localhost
 * only when the send is explicitly guarded for local testing — a dry-run, a
 * single test-recipient, or an explicit PUBLISH_ALLOW_LOCALHOST=1 escape hatch.
 */
export function assertProductionBaseUrl(baseUrl: string, guard: SendGuard): void {
  if (!isLocalhostUrl(baseUrl)) return

  const allowed =
    guard.dryRun || guard.testRecipient !== null || process.env.PUBLISH_ALLOW_LOCALHOST === '1'

  if (allowed) {
    console.warn(
      `⚠️  Base URL is localhost (${baseUrl}). Allowed (dry-run / test-recipient / PUBLISH_ALLOW_LOCALHOST). Links in this email will NOT work for real subscribers.`
    )
    return
  }

  throw new Error(
    `Refusing to send: NEXT_PUBLIC_APP_URL is "${baseUrl}" (localhost). Real subscriber emails would contain dead localhost links. Set NEXT_PUBLIC_APP_URL=https://decebaldobrica.com, or pass --dry-run / --test-recipient=<addr> / PUBLISH_ALLOW_LOCALHOST=1 for local testing.`
  )
}

function mdxToPost(fileName: string, raw: string): BlogPost {
  const { data, content } = matter(raw)
  return {
    slug: fileName.replace('.mdx', ''),
    title: data.title || '',
    excerpt: data.excerpt || data.description || '',
    content,
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    author: data.author || 'Decebal Dobrica',
    published: data.published !== false,
    newsletter: data.newsletter !== false,
  }
}

/** Load a single blog post by slug (substring match on the MDX filename). */
export function loadBlogPost(slug: string): BlogPost | null {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const files = readdirSync(contentDir)
    const mdxFile = files.find((f) => f.endsWith('.mdx') && f.includes(slug))

    if (!mdxFile) {
      console.error(`❌ Blog post not found: ${slug}`)
      console.log('\nAvailable posts:')
      for (const f of files.filter((f) => f.endsWith('.mdx'))) {
        console.log(`  - ${f.replace('.mdx', '')}`)
      }
      return null
    }

    return mdxToPost(mdxFile, readFileSync(join(contentDir, mdxFile), 'utf-8'))
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

/** Load every blog post under content/blog (used by the due-scan autopilot). */
export function loadAllPosts(): BlogPost[] {
  const contentDir = join(process.cwd(), 'content', 'blog')
  return readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => mdxToPost(f, readFileSync(join(contentDir, f), 'utf-8')))
}

/**
 * Rewrite root-relative markdown links/images (e.g. `](/blog/x)`) to absolute
 * URLs so they resolve inside an email client. The branded email template
 * renders the markdown itself (links, lists, code) — no hand-rolled HTML.
 */
export function absolutizeMarkdownUrls(markdown: string, baseUrl: string): string {
  return markdown.replace(/\]\(\/(?!\/)/g, `](${baseUrl}/`)
}

/** Build the branded newsletter-issue props for a post against a base URL. */
export function buildIssueProps(post: BlogPost, baseUrl: string): NewsletterIssueEmailProps {
  return {
    title: post.title,
    preview: post.excerpt,
    markdown: absolutizeMarkdownUrls(post.content, baseUrl),
    postUrl: `${baseUrl}/blog/${post.slug}`,
    kicker: post.tags[0] ?? 'New post',
    unsubscribeUrl: `${baseUrl}/newsletter/unsubscribe`,
  }
}

/**
 * Send a single post as a newsletter issue to all active subscribers (guarded).
 * Records an `issue.created` + (on a real send) `issue.sent` in AllSource — the
 * same events wasIssueSentForSlug() reads to dedupe the autopilot.
 */
export async function sendNewsletterToSubscribers(
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
    const baseUrl = getBaseUrl()
    assertProductionBaseUrl(baseUrl, guard)

    const issueProps = buildIssueProps(post, baseUrl)
    const subject = `New Post: ${post.title}`

    // Store the exact HTML that subscribers receive on the AllSource issue event.
    const contentHtml = await renderNewsletterIssue(issueProps)
    const issue = await createNewsletterIssue({
      title: post.title,
      subject,
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

    let sent = 0
    let errors = 0

    // Send to each subscriber (guarded). In production use a batching service.
    for (const subscriber of subscribers) {
      if (guard.dryRun) {
        console.log(`   [dry-run] would send "${subject}" to ${subscriber.email}`)
        sent++
        continue
      }

      // In test-recipient mode, never send to the real subscriber list.
      const recipient = guard.testRecipient ?? subscriber.email
      try {
        const result = await sendNewsletterPost(recipient, subject, issueProps)
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

/** Post a published blog post to all configured social platforms. */
export async function postToSocialMedia(post: BlogPost): Promise<void> {
  console.log('\n📱 Posting to social media...')

  const baseUrl = getBaseUrl()
  const postUrl = `${baseUrl}/blog/${post.slug}`

  const imageUrl = generateOGImageUrl(
    {
      title: post.title,
      excerpt: post.excerpt.slice(0, 100),
      date: new Date(post.date).toLocaleDateString(),
      tags: post.tags,
    },
    baseUrl
  )

  const results = await postToAllPlatforms({
    title: post.title,
    excerpt: post.excerpt,
    url: postUrl,
    tags: post.tags,
    imageUrl,
    date: post.date,
  })

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
