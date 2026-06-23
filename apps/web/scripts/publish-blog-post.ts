#!/usr/bin/env bun

/**
 * Blog Post Publishing Automation (manual, one slug at a time)
 *
 * This script automates the entire publishing workflow:
 * 1. Loads blog post from MDX
 * 2. Sends newsletter to subscribers
 * 3. Posts to LinkedIn / Twitter
 * 4. Generates and uses social media images
 *
 * Usage: bun run publish-post --slug=my-blog-post
 *
 * The recurring/automated equivalent is publish-due-posts.ts (Fly cron), which
 * scans for due+unsent posts. Both share apps/web/scripts/lib/publish-core.ts.
 */

import {
  type BlogPost,
  type SendGuard,
  loadBlogPost,
  postToSocialMedia,
  resolveSendGuard,
  sendNewsletterToSubscribers,
} from './lib/publish-core'

async function publishBlogPost(slug: string, guard: SendGuard): Promise<void> {
  console.log('🚀 Blog Post Publishing Automation')
  console.log('=====================================\n')

  // 1. Load blog post
  console.log(`📄 Loading blog post: ${slug}...`)
  const post: BlogPost | null = loadBlogPost(slug)

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

// CLI Entry Point
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
