# Newsletter System - Supabase Setup Guide

This guide will help you set up the newsletter system using Supabase as the database.

---

## Step 1: Run the Database Schema

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Paste and Run Schema**
   - Copy the entire contents of `docs/SUPABASE_NEWSLETTER_SCHEMA.sql`
   - Paste into the SQL editor
   - Click "Run" or press Cmd+Enter

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these new tables:
     - `newsletter_subscribers`
     - `newsletter_issues`
     - `newsletter_events`
     - `newsletter_subscriptions`
     - `social_posts`

---

## Step 2: Verify Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Supabase (should already be configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key  # REQUIRED for newsletter

# Resend (for sending emails)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@decebaldobrica.com
```

**Important:** The newsletter system uses the `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security (RLS) for server-side operations.

---

## Step 3: Test the Newsletter Signup

1. **Start dev server:**
   ```bash
   task dev
   ```

2. **Visit blog page:**
   ```
   http://localhost:3000/blog
   ```

3. **Test subscription:**
   - Scroll down to see the newsletter signup (after 3rd post and at bottom)
   - Enter your email
   - Click "Subscribe"

4. **Verify in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - Open `newsletter_subscribers` table
   - You should see your new subscriber with:
     - `status: 'pending'`
     - `tier: 'free'`
     - `subscribed_at: [current timestamp]`

---

## Step 4: Understanding the Data Model

### Newsletter Subscribers Table

Stores all newsletter subscribers with their preferences and engagement metrics.

**Key Fields:**
- `email` - Subscriber email (unique)
- `name` - Optional subscriber name
- `tier` - Subscription tier: `free`, `premium`, `founding`
- `status` - Current status: `pending`, `active`, `unsubscribed`, `bounced`
- `confirmed_at` - When they confirmed their email (null until confirmed)
- `open_rate` - Percentage of emails they've opened
- `click_rate` - Percentage of emails they've clicked

**Premium Fields:**
- `stripe_customer_id` - Stripe customer ID (for premium/founding)
- `stripe_subscription_id` - Stripe subscription ID
- `solana_wallet_address` - Solana wallet (for crypto payments)
- `subscription_expires_at` - When premium access expires

### Newsletter Issues Table

Stores sent/scheduled newsletters.

**Key Fields:**
- `title` - Internal title
- `subject` - Email subject line
- `content_html` - HTML email content
- `content_text` - Plain text version
- `status` - `draft`, `scheduled`, `sent`
- `tier` - Who can receive it: `free`, `premium`, `all`
- `blog_post_slug` - Related blog post (if any)
- `recipients_count` - How many received it
- `opens_count` / `clicks_count` - Engagement metrics

### Newsletter Events Table

Tracks every interaction with emails.

**Event Types:**
- `sent` - Email was sent
- `delivered` - Email was delivered
- `opened` - User opened the email
- `clicked` - User clicked a link
- `bounced` - Email bounced
- `complained` - User marked as spam

### Newsletter Subscriptions Table

Tracks premium/founding subscriptions.

**Key Fields:**
- `provider` - `stripe` or `solana`
- `tier` - `premium` or `founding`
- `status` - `active`, `cancelled`, `past_due`, `expired`
- `amount` - Price paid
- `interval` - `month` or `year`
- `current_period_end` - When current period expires

### Social Posts Table

Tracks automated social media posts.

**Key Fields:**
- `blog_post_slug` - Which blog post this promotes
- `platform` - `linkedin` or `twitter`
- `content` - Post text
- `media_url` - AI-generated image
- `status` - `draft`, `scheduled`, `published`, `failed`
- `platform_post_id` - ID from LinkedIn/Twitter
- `likes_count` / `comments_count` - Engagement metrics

---

## Step 5: Using the Newsletter Functions

The `src/lib/newsletter.ts` file provides helper functions:

### Subscribe a User
```typescript
import { subscribeToNewsletter } from '@/lib/newsletter'

const result = await subscribeToNewsletter({
  email: 'user@example.com',
  name: 'John Doe',
  utm_source: 'blog',
  utm_medium: 'inline-form',
  utm_campaign: 'winter-2025',
})

if (result.success) {
  console.log('Subscriber ID:', result.subscriberId)
}
```

### Get Subscriber Count
```typescript
import { getSubscriberCount } from '@/lib/newsletter'

const totalSubscribers = await getSubscriberCount()
const premiumSubscribers = await getSubscriberCount('premium')
```

### Get Newsletter Stats
```typescript
import { getNewsletterStats } from '@/lib/newsletter'

const stats = await getNewsletterStats()
console.log(`Total: ${stats.totalSubscribers}`)
console.log(`Free: ${stats.freeSubscribers}`)
console.log(`Premium: ${stats.premiumSubscribers}`)
console.log(`Avg Open Rate: ${stats.avgOpenRate}%`)
```

### Track Events
```typescript
import { trackNewsletterEvent } from '@/lib/newsletter'

await trackNewsletterEvent({
  subscriber_id: 'uuid-here',
  issue_id: 'uuid-here',
  event_type: 'opened',
  user_agent: req.headers['user-agent'],
  ip_address: req.headers['x-forwarded-for'],
})
```

---

## Step 6: Viewing Analytics in Supabase

### Quick Stats Query

Run this in Supabase SQL Editor:

```sql
SELECT * FROM v_subscriber_stats;
```

This returns:
- Subscriber count by tier
- Average open rate by tier
- Average click rate by tier

### Recent Activity Query

```sql
SELECT * FROM v_recent_subscriber_activity LIMIT 10;
```

Shows most recently active subscribers with their engagement metrics.

### Newsletter Performance Query

```sql
SELECT * FROM v_newsletter_performance;
```

Shows all sent newsletters with open rates and click rates.

---

## Step 7: Row Level Security (RLS)

The schema has RLS enabled on all tables for security.

**Current Policies:**
- ✅ Service role has full access (for your Next.js API)
- ✅ Anonymous users can INSERT to `newsletter_subscribers` (for signups)
- ❌ Anonymous users CANNOT read/update/delete

**To add more policies (optional):**

Allow authenticated users to manage their own subscription:

```sql
CREATE POLICY "Users can view their own subscription"
  ON newsletter_subscribers
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own preferences"
  ON newsletter_subscribers
  FOR UPDATE
  USING (auth.uid()::text = id::text);
```

---

## Step 8: Next Steps

### A. Send Confirmation Emails (Resend Integration)

Create `src/lib/newsletterEmail.ts` to send double opt-in emails:

```typescript
import { getResendClient } from '@/lib/emailService'

export async function sendConfirmationEmail(
  subscriberId: string,
  email: string,
  name?: string
) {
  const client = getResendClient()
  if (!client) return false

  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?id=${subscriberId}`

  await client.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@decebaldobrica.com',
    to: email,
    subject: 'Confirm your newsletter subscription',
    html: `
      <h1>Welcome, ${name || 'there'}!</h1>
      <p>Please confirm your subscription by clicking the link below:</p>
      <a href="${confirmUrl}">Confirm Subscription</a>
    `,
  })

  return true
}
```

### B. Create Confirmation Page

`src/app/newsletter/confirm/page.tsx`:

```typescript
import { confirmSubscription } from '@/lib/newsletter'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const success = await confirmSubscription(searchParams.id)

  return (
    <div>
      {success ? (
        <h1>Subscription Confirmed!</h1>
      ) : (
        <h1>Invalid confirmation link</h1>
      )}
    </div>
  )
}
```

### C. Build Newsletter Landing Page

Create `/newsletter` page to showcase:
- Free vs Premium benefits
- Pricing tiers
- Sample newsletter content
- FAQ
- Subscriber testimonials

### D. Create Admin Dashboard

Build `/admin/newsletter` for:
- View subscriber stats
- Send newsletters
- View analytics
- Manage subscribers
- Test email templates

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution:** Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are in `.env.local`

### Error: "permission denied for table newsletter_subscribers"

**Solution:** Check that RLS policies allow service role access. Re-run the schema SQL.

### Subscribers not appearing in database

**Solution:**
1. Check browser console for errors
2. Check server logs (`task dev` output)
3. Verify Supabase connection in SQL Editor:
   ```sql
   SELECT COUNT(*) FROM newsletter_subscribers;
   ```

### "Already subscribed" error for new email

**Solution:** The email might be in the database with `unsubscribed` status. Check:
```sql
SELECT * FROM newsletter_subscribers WHERE email = 'user@example.com';
```

---

## Database Maintenance

### Cleanup Pending Subscriptions (older than 7 days)

```sql
DELETE FROM newsletter_subscribers
WHERE status = 'pending'
  AND subscribed_at < NOW() - INTERVAL '7 days';
```

### Cleanup Old Events (older than 6 months)

```sql
DELETE FROM newsletter_events
WHERE created_at < NOW() - INTERVAL '6 months';
```

### Backup Subscribers

```sql
-- Export to CSV from Supabase Table Editor
-- Or use pg_dump via CLI
```

---

## Security Best Practices

1. **Never expose service role key in client-side code**
   - Only use in API routes and server components
   - Use anon key for client-side Supabase operations

2. **Validate email addresses**
   - Use Zod schema validation (already implemented)
   - Consider email verification service to prevent fake signups

3. **Rate limit subscriptions**
   - Add rate limiting to prevent abuse
   - Use Vercel's edge config or Redis

4. **GDPR Compliance**
   - Allow users to delete their data
   - Provide data export functionality
   - Store consent timestamps

---

## Summary

✅ **Setup Complete!** You now have:
- Supabase database with 5 tables
- Newsletter subscription API working
- Helper functions for all operations
- Analytics views for insights
- Row Level Security for data protection

**Next:** Send confirmation emails with Resend, then build premium payment flow.
