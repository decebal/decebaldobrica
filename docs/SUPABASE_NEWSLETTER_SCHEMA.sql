-- Newsletter System - Supabase Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Newsletter Subscribers Table
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'premium', 'founding'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'unsubscribed', 'bounced'

  -- Subscription metadata
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,

  -- Payment info
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  solana_wallet_address TEXT,
  subscription_expires_at TIMESTAMPTZ,

  -- Preferences
  frequency TEXT DEFAULT 'weekly', -- 'weekly', 'daily', 'monthly'
  interests JSONB, -- Array of topics

  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Engagement metrics
  open_rate DECIMAL(5,2) DEFAULT 0.0,
  click_rate DECIMAL(5,2) DEFAULT 0.0,
  last_opened_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_tier ON newsletter_subscribers(tier);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_stripe_customer ON newsletter_subscribers(stripe_customer_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Newsletter Issues (Sent Newsletters)
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT, -- Email preview text

  -- Content
  content_html TEXT NOT NULL,
  content_text TEXT NOT NULL,

  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'premium', 'all'

  -- Related blog post
  blog_post_slug TEXT,

  -- Schedule
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  -- Metrics
  recipients_count INTEGER DEFAULT 0,
  opens_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  unsubscribes_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_status ON newsletter_issues(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_tier ON newsletter_issues(tier);
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_blog_post ON newsletter_issues(blog_post_slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_sent_at ON newsletter_issues(sent_at);

-- Trigger for updated_at
CREATE TRIGGER update_newsletter_issues_updated_at
  BEFORE UPDATE ON newsletter_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Newsletter Events (Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  issue_id UUID NOT NULL REFERENCES newsletter_issues(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained'

  -- Event data
  link_url TEXT, -- For click events
  user_agent TEXT,
  ip_address TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_newsletter_events_subscriber ON newsletter_events(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_issue ON newsletter_events(issue_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_type ON newsletter_events(event_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_created ON newsletter_events(created_at);

-- ============================================
-- 4. Newsletter Subscriptions (Payment Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,

  -- Payment provider
  provider TEXT NOT NULL, -- 'stripe', 'solana'
  provider_subscription_id TEXT,

  -- Subscription details
  tier TEXT NOT NULL, -- 'premium', 'founding'
  status TEXT NOT NULL, -- 'active', 'cancelled', 'past_due', 'expired'

  -- Billing
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL, -- 'month', 'year'

  -- Dates
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_subscriber ON newsletter_subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_provider ON newsletter_subscriptions(provider);

-- Trigger for updated_at
CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Social Media Posts (Automation Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_slug TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'linkedin', 'twitter'

  -- Post content
  content TEXT NOT NULL,
  media_url TEXT, -- AI-generated image

  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- Platform IDs
  platform_post_id TEXT,
  platform_url TEXT,

  -- Engagement (fetched later)
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,

  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_blog_post ON social_posts(blog_post_slug);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_published ON social_posts(published_at);

-- Trigger for updated_at
CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (for server-side operations)
CREATE POLICY "Service role has full access to newsletter_subscribers"
  ON newsletter_subscribers
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to newsletter_issues"
  ON newsletter_issues
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to newsletter_events"
  ON newsletter_events
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to newsletter_subscriptions"
  ON newsletter_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to social_posts"
  ON social_posts
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anonymous users to subscribe (insert only)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 7. Helper Functions
-- ============================================

-- Function to get subscriber count by tier
CREATE OR REPLACE FUNCTION get_subscriber_count(tier_filter TEXT DEFAULT NULL)
RETURNS INTEGER AS $$
BEGIN
  IF tier_filter IS NULL THEN
    RETURN (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active');
  ELSE
    RETURN (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active' AND tier = tier_filter);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate open rate for a newsletter issue
CREATE OR REPLACE FUNCTION calculate_open_rate(issue_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_sent INTEGER;
  total_opened INTEGER;
BEGIN
  SELECT recipients_count INTO total_sent FROM newsletter_issues WHERE id = issue_uuid;
  SELECT COUNT(DISTINCT subscriber_id) INTO total_opened
    FROM newsletter_events
    WHERE issue_id = issue_uuid AND event_type = 'opened';

  IF total_sent = 0 THEN
    RETURN 0;
  END IF;

  RETURN (total_opened::DECIMAL / total_sent::DECIMAL * 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update subscriber engagement metrics
CREATE OR REPLACE FUNCTION update_subscriber_engagement(subscriber_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_issues INTEGER;
  total_opens INTEGER;
  total_clicks INTEGER;
BEGIN
  -- Count total issues sent to subscriber
  SELECT COUNT(DISTINCT issue_id) INTO total_issues
    FROM newsletter_events
    WHERE subscriber_id = subscriber_uuid AND event_type = 'sent';

  -- Count unique opens
  SELECT COUNT(DISTINCT issue_id) INTO total_opens
    FROM newsletter_events
    WHERE subscriber_id = subscriber_uuid AND event_type = 'opened';

  -- Count unique clicks
  SELECT COUNT(DISTINCT issue_id) INTO total_clicks
    FROM newsletter_events
    WHERE subscriber_id = subscriber_uuid AND event_type = 'clicked';

  -- Update subscriber metrics
  IF total_issues > 0 THEN
    UPDATE newsletter_subscribers
    SET
      open_rate = (total_opens::DECIMAL / total_issues::DECIMAL * 100),
      click_rate = (total_clicks::DECIMAL / total_issues::DECIMAL * 100)
    WHERE id = subscriber_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Sample Data (Optional - for testing)
-- ============================================

-- Insert a test free subscriber
-- INSERT INTO newsletter_subscribers (email, name, tier, status, confirmed_at)
-- VALUES ('test@example.com', 'Test User', 'free', 'active', NOW());

-- Insert a test premium subscriber
-- INSERT INTO newsletter_subscribers (email, name, tier, status, confirmed_at, subscription_expires_at)
-- VALUES ('premium@example.com', 'Premium User', 'premium', 'active', NOW(), NOW() + INTERVAL '1 month');

-- ============================================
-- 9. Views for Analytics
-- ============================================

-- View: Active subscribers by tier
CREATE OR REPLACE VIEW v_subscriber_stats AS
SELECT
  tier,
  COUNT(*) as count,
  AVG(open_rate) as avg_open_rate,
  AVG(click_rate) as avg_click_rate
FROM newsletter_subscribers
WHERE status = 'active'
GROUP BY tier;

-- View: Newsletter performance
CREATE OR REPLACE VIEW v_newsletter_performance AS
SELECT
  i.id,
  i.title,
  i.sent_at,
  i.tier,
  i.recipients_count,
  i.opens_count,
  i.clicks_count,
  CASE
    WHEN i.recipients_count > 0
    THEN ROUND((i.opens_count::DECIMAL / i.recipients_count::DECIMAL * 100), 2)
    ELSE 0
  END as open_rate_pct,
  CASE
    WHEN i.recipients_count > 0
    THEN ROUND((i.clicks_count::DECIMAL / i.recipients_count::DECIMAL * 100), 2)
    ELSE 0
  END as click_rate_pct
FROM newsletter_issues i
WHERE i.status = 'sent'
ORDER BY i.sent_at DESC;

-- View: Recent subscriber activity
CREATE OR REPLACE VIEW v_recent_subscriber_activity AS
SELECT
  s.email,
  s.name,
  s.tier,
  s.status,
  s.subscribed_at,
  s.last_opened_at,
  s.open_rate,
  s.click_rate,
  (
    SELECT COUNT(*)
    FROM newsletter_events e
    WHERE e.subscriber_id = s.id AND e.event_type = 'opened'
  ) as total_opens,
  (
    SELECT COUNT(*)
    FROM newsletter_events e
    WHERE e.subscriber_id = s.id AND e.event_type = 'clicked'
  ) as total_clicks
FROM newsletter_subscribers s
ORDER BY s.last_opened_at DESC NULLS LAST
LIMIT 100;

-- ============================================
-- Done! Schema created successfully
-- ============================================

-- Grant access to authenticated and service roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;
