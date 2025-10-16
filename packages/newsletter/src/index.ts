import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

// Types matching our Supabase schema
export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  tier: 'free' | 'premium' | 'founding'
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  confirmed_at?: string
  unsubscribed_at?: string
  confirmation_token?: string
  confirmation_token_expires_at?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  solana_wallet_address?: string
  subscription_expires_at?: string
  frequency: 'weekly' | 'daily' | 'monthly'
  interests?: string[]
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  open_rate: number
  click_rate: number
  last_opened_at?: string
  created_at: string
  updated_at: string
}

export interface NewsletterIssue {
  id: string
  title: string
  subject: string
  preview_text?: string
  content_html: string
  content_text: string
  status: 'draft' | 'scheduled' | 'sent'
  tier: 'free' | 'premium' | 'all'
  blog_post_slug?: string
  scheduled_for?: string
  sent_at?: string
  recipients_count: number
  opens_count: number
  clicks_count: number
  unsubscribes_count: number
  created_at: string
  updated_at: string
}

export interface NewsletterEvent {
  id: string
  subscriber_id: string
  issue_id: string
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  link_url?: string
  user_agent?: string
  ip_address?: string
  created_at: string
}

export interface NewsletterSubscription {
  id: string
  subscriber_id: string
  provider: 'stripe' | 'solana'
  provider_subscription_id?: string
  tier: 'premium' | 'founding'
  status: 'active' | 'cancelled' | 'past_due' | 'expired'
  amount: number
  currency: string
  interval: 'month' | 'year'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at?: string
  created_at: string
  updated_at: string
}

/**
 * Get Supabase client (server-side only)
 * Uses service role key for full access
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Generate a secure confirmation token
 * Returns a URL-safe random token
 */
export function generateConfirmationToken(): string {
  return randomBytes(32).toString('base64url')
}

/**
 * Store confirmation token for a subscriber
 * Token expires in 24 hours
 */
async function storeConfirmationToken(email: string, token: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiry

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        confirmation_token: token,
        confirmation_token_expires_at: expiresAt.toISOString(),
      })
      .eq('email', email)

    if (error) {
      console.error('Error storing confirmation token:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Store confirmation token error:', error)
    return false
  }
}

/**
 * Subscribe a new user to the newsletter
 * Generates confirmation token for double opt-in flow
 * The caller should send the confirmation email using the returned token
 */
export async function subscribeToNewsletter(data: {
  email: string
  name?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}): Promise<{
  success: boolean
  subscriberId?: string
  confirmationToken?: string
  error?: string
}> {
  try {
    const supabase = getSupabaseAdmin()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', data.email)
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return { success: false, error: 'You are already subscribed!' }
      }
      if (existing.status === 'pending') {
        return { success: false, error: 'Please check your email to confirm your subscription.' }
      }
      // If unsubscribed, we can resubscribe them
    }

    // Insert or update subscriber
    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: data.email,
          name: data.name,
          status: 'pending',
          tier: 'free',
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign,
        },
        {
          onConflict: 'email',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error creating subscriber:', error)
      return { success: false, error: 'Failed to subscribe. Please try again.' }
    }

    // Generate and store confirmation token
    const confirmationToken = generateConfirmationToken()
    const tokenStored = await storeConfirmationToken(data.email, confirmationToken)

    if (!tokenStored) {
      console.error('Failed to store confirmation token for:', data.email)
      return {
        success: false,
        error: 'Failed to send confirmation email. Please try again.',
      }
    }

    // Return success with token
    // The caller (API route) will send the confirmation email
    return {
      success: true,
      subscriberId: subscriber.id,
      confirmationToken,
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Confirm a subscriber's email address using confirmation token
 */
export async function confirmSubscription(
  token: string
): Promise<{ success: boolean; error?: string; subscriber?: NewsletterSubscriber }> {
  try {
    const supabase = getSupabaseAdmin()

    // Find subscriber by confirmation token
    const { data: subscriber, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .single()

    if (fetchError || !subscriber) {
      return {
        success: false,
        error: 'Invalid confirmation link. Please try subscribing again.',
      }
    }

    // Check if token is expired
    if (subscriber.confirmation_token_expires_at) {
      const expiresAt = new Date(subscriber.confirmation_token_expires_at)
      if (expiresAt < new Date()) {
        return {
          success: false,
          error: 'This confirmation link has expired. Please subscribe again.',
        }
      }
    }

    // Check if already confirmed
    if (subscriber.status === 'active' && subscriber.confirmed_at) {
      return {
        success: true,
        subscriber,
      }
    }

    // Confirm the subscription
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'active',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null, // Clear the token after use
        confirmation_token_expires_at: null,
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Error confirming subscription:', updateError)
      return {
        success: false,
        error: 'Failed to confirm subscription. Please try again.',
      }
    }

    return {
      success: true,
      subscriber,
    }
  } catch (error) {
    console.error('Subscription confirmation error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred.',
    }
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)

    if (error) {
      console.error('Error unsubscribing:', error)
      return { success: false, error: 'Failed to unsubscribe.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Get subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching subscriber:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Get subscriber error:', error)
    return null
  }
}

/**
 * Get all active subscribers by tier
 */
export async function getActiveSubscribers(
  tier?: 'free' | 'premium' | 'founding' | 'all'
): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = getSupabaseAdmin()

    let query = supabase.from('newsletter_subscribers').select('*').eq('status', 'active')

    if (tier && tier !== 'all') {
      query = query.eq('tier', tier)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching subscribers:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get active subscribers error:', error)
    return []
  }
}

/**
 * Get subscriber count by tier
 */
export async function getSubscriberCount(tier?: 'free' | 'premium' | 'founding'): Promise<number> {
  try {
    const supabase = getSupabaseAdmin()

    let query = supabase
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    if (tier) {
      query = query.eq('tier', tier)
    }

    const { count, error } = await query

    if (error) {
      console.error('Error counting subscribers:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Get subscriber count error:', error)
    return 0
  }
}

/**
 * Track a newsletter event (sent, opened, clicked, etc.)
 */
export async function trackNewsletterEvent(event: {
  subscriber_id: string
  issue_id: string
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  link_url?: string
  user_agent?: string
  ip_address?: string
}): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from('newsletter_events').insert(event)

    if (error) {
      console.error('Error tracking event:', error)
      return false
    }

    // Update last_opened_at if it's an open event
    if (event.event_type === 'opened') {
      await supabase
        .from('newsletter_subscribers')
        .update({ last_opened_at: new Date().toISOString() })
        .eq('id', event.subscriber_id)
    }

    return true
  } catch (error) {
    console.error('Track event error:', error)
    return false
  }
}

/**
 * Create a new newsletter issue
 */
export async function createNewsletterIssue(issue: {
  title: string
  subject: string
  preview_text?: string
  content_html: string
  content_text: string
  tier: 'free' | 'premium' | 'all'
  blog_post_slug?: string
  scheduled_for?: string
}): Promise<{ success: boolean; issueId?: string; error?: string }> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('newsletter_issues')
      .insert({
        ...issue,
        status: issue.scheduled_for ? 'scheduled' : 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating issue:', error)
      return { success: false, error: 'Failed to create newsletter issue.' }
    }

    return { success: true, issueId: data.id }
  } catch (error) {
    console.error('Create newsletter issue error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Get newsletter statistics
 */
export async function getNewsletterStats(): Promise<{
  totalSubscribers: number
  freeSubscribers: number
  premiumSubscribers: number
  foundingSubscribers: number
  totalIssues: number
  avgOpenRate: number
  avgClickRate: number
}> {
  try {
    const supabase = getSupabaseAdmin()

    const [total, free, premium, founding, issues] = await Promise.all([
      getSubscriberCount(),
      getSubscriberCount('free'),
      getSubscriberCount('premium'),
      getSubscriberCount('founding'),
      supabase.from('newsletter_issues').select('id', { count: 'exact', head: true }),
    ])

    // Get average engagement rates
    const { data: stats } = await supabase
      .from('newsletter_subscribers')
      .select('open_rate, click_rate')
      .eq('status', 'active')

    const avgOpenRate =
      stats && stats.length > 0
        ? stats.reduce((acc, s) => acc + (s.open_rate || 0), 0) / stats.length
        : 0

    const avgClickRate =
      stats && stats.length > 0
        ? stats.reduce((acc, s) => acc + (s.click_rate || 0), 0) / stats.length
        : 0

    return {
      totalSubscribers: total,
      freeSubscribers: free,
      premiumSubscribers: premium,
      foundingSubscribers: founding,
      totalIssues: issues.count || 0,
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      avgClickRate: Math.round(avgClickRate * 100) / 100,
    }
  } catch (error) {
    console.error('Get newsletter stats error:', error)
    return {
      totalSubscribers: 0,
      freeSubscribers: 0,
      premiumSubscribers: 0,
      foundingSubscribers: 0,
      totalIssues: 0,
      avgOpenRate: 0,
      avgClickRate: 0,
    }
  }
}
