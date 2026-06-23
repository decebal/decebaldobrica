#!/usr/bin/env bun

/**
 * Newsletter autopilot — publish every DUE, NOT-YET-SENT blog post.
 *
 * This is the unattended equivalent of publish-blog-post.ts, designed to run on
 * a recurring schedule (Fly cron / supercronic). On each tick it:
 *
 *   1. Loads every post under content/blog.
 *   2. Keeps the ones that are published AND dated in the window
 *      [now - PUBLISH_LOOKBACK_DAYS, now]  (default 7 days).
 *   3. Skips any whose newsletter issue was already sent (AllSource dedupe via
 *      wasIssueSentForSlug) — so re-running the cron never double-sends.
 *   4. Sends the rest as branded newsletter issues, then posts to social.
 *
 * Two safety rails make a runaway blast impossible:
 *   - The lookback window means the first run can NEVER fire the whole archive;
 *     only recently-dated posts are eligible.
 *   - assertProductionBaseUrl (in the send path) refuses to send localhost links
 *     to real subscribers — the bug this whole system was built to fix.
 *
 * Env:
 *   NEXT_PUBLIC_APP_URL      canonical site URL (MUST NOT be localhost for a real send)
 *   PUBLISH_LOOKBACK_DAYS    eligibility window in days (default 7)
 *   PUBLISH_DRY_RUN=1        log candidates + recipients, send nothing
 *   PUBLISH_TEST_RECIPIENT   send only to this address
 *   PUBLISH_ALLOW_LOCALHOST=1  escape hatch for local testing only
 *
 * Usage:
 *   bun run publish-due                 # real send of all due+unsent posts
 *   PUBLISH_DRY_RUN=1 bun run publish-due
 */

import { wasIssueSentForSlug } from '@decebal/newsletter'
import {
  type BlogPost,
  type SendGuard,
  assertProductionBaseUrl,
  getBaseUrl,
  loadAllPosts,
  postToSocialMedia,
  resolveSendGuard,
  sendNewsletterToSubscribers,
} from './lib/publish-core'

const DAY_MS = 24 * 60 * 60 * 1000

function resolveLookbackDays(): number {
  const raw = Number.parseInt(process.env.PUBLISH_LOOKBACK_DAYS ?? '', 10)
  return Number.isFinite(raw) && raw > 0 ? raw : 7
}

/**
 * Posts that are published and dated within [now - lookback, now], sorted
 * oldest-first so a backlog goes out in chronological order. Future-dated posts
 * are intentionally excluded → set a future `date` to schedule a send.
 */
function selectDuePosts(posts: BlogPost[], lookbackDays: number): BlogPost[] {
  const now = Date.now()
  const cutoff = now - lookbackDays * DAY_MS

  return posts
    .filter((p) => {
      if (!p.published) return false
      if (!p.newsletter) return false // opt-out: `newsletter: false` in frontmatter
      const t = new Date(p.date).getTime()
      if (!Number.isFinite(t)) return false
      return t <= now && t >= cutoff
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

async function publishDuePosts(guard: SendGuard): Promise<void> {
  console.log('🛰️  Newsletter autopilot — publishing due posts')
  console.log('================================================\n')

  const lookbackDays = resolveLookbackDays()
  const baseUrl = getBaseUrl()

  // Fail fast before touching AllSource / Resend if the URL would ship dead links.
  assertProductionBaseUrl(baseUrl, guard)

  console.log(`🔗 Base URL: ${baseUrl}`)
  console.log(`🪟 Eligibility window: last ${lookbackDays} day(s)`)
  if (guard.dryRun) console.log('🧪 DRY RUN — nothing will be sent')
  else if (guard.testRecipient) console.log(`🧪 TEST RECIPIENT — ${guard.testRecipient}`)

  const candidates = selectDuePosts(loadAllPosts(), lookbackDays)

  if (candidates.length === 0) {
    console.log('\n✅ No due posts in the window. Nothing to send.')
    return
  }

  console.log(`\n📋 ${candidates.length} candidate(s) in window:`)
  for (const p of candidates) {
    console.log(`   - ${p.slug} (${p.date})`)
  }

  let published = 0
  let skipped = 0
  let errored = 0

  for (const post of candidates) {
    console.log(`\n──────── ${post.slug} ────────`)

    // Idempotency: never re-send a post whose issue already went out.
    if (await wasIssueSentForSlug(post.slug)) {
      console.log('⏭️  Already sent — skipping.')
      skipped++
      continue
    }

    const result = await sendNewsletterToSubscribers(post, guard)
    if (result.errors > 0 && result.sent === 0) {
      console.error(`❌ Send failed for ${post.slug} (0 sent, ${result.errors} errors).`)
      errored++
      continue
    }

    // Social only on a real, successful send (never in dry-run / test mode).
    if (!guard.dryRun && !guard.testRecipient && result.sent > 0) {
      await postToSocialMedia(post)
    } else {
      console.log('📱 Social media: skipped (dry-run / test / nothing sent)')
    }

    published++
  }

  console.log('\n================================================')
  console.log(`✨ Autopilot done: ${published} published, ${skipped} skipped, ${errored} failed.`)

  if (errored > 0) process.exit(1)
}

const guard = resolveSendGuard(process.argv.slice(2))
publishDuePosts(guard).catch((error) => {
  console.error('❌ Autopilot fatal error:', error)
  process.exit(1)
})
