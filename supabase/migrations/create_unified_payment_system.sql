-- ============================================
-- UNIFIED PAYMENT SYSTEM
-- Consolidates meeting payments, service access, and newsletter payments
-- Replaces in-memory payment storage with persistent Supabase tables
-- ============================================

-- ============================================
-- 1. User Profiles (Wallet-based Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Wallet information
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_chain TEXT NOT NULL DEFAULT 'solana', -- 'solana', 'ethereum', 'bitcoin'

  -- Optional user info
  email TEXT,
  name TEXT,

  -- Preferences
  preferred_payment_method TEXT DEFAULT 'sol', -- 'sol', 'btc', 'eth', 'usdc'

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Updated at trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Unified Payments Table
-- Handles ALL payment types: meetings, service access, newsletter, deposits
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who made the payment
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  wallet_address TEXT NOT NULL,

  -- Payment type and context
  payment_type TEXT NOT NULL CHECK (
    payment_type IN ('meeting', 'service_access', 'newsletter_subscription', 'deposit', 'tip')
  ),

  -- Reference to related entity (meeting_id, service_slug, subscriber_id, etc.)
  entity_type TEXT, -- 'meeting', 'service', 'subscriber'
  entity_id TEXT, -- The actual ID or slug

  -- Payment details
  amount DECIMAL(20,8) NOT NULL, -- Support crypto decimals
  currency TEXT NOT NULL DEFAULT 'SOL', -- 'SOL', 'BTC', 'ETH', 'USDC', 'USD'
  currency_type TEXT NOT NULL DEFAULT 'crypto' CHECK (currency_type IN ('crypto', 'fiat')),

  -- Blockchain details
  chain TEXT NOT NULL DEFAULT 'solana', -- 'solana', 'ethereum', 'bitcoin', 'polygon', 'arbitrum'
  network TEXT, -- 'mainnet', 'devnet', 'lightning', 'polygon', 'arbitrum', 'base'
  reference TEXT UNIQUE, -- Solana reference public key or similar
  signature TEXT, -- Transaction signature/hash

  -- Payment provider (if using gateway)
  provider TEXT DEFAULT 'solana_pay', -- 'solana_pay', 'stripe', 'nowpayments', 'btcpay'
  provider_payment_id TEXT, -- External payment ID

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'failed', 'refunded', 'expired')
  ),

  -- Metadata
  description TEXT,
  metadata JSONB, -- Flexible field for payment-specific data

  -- Dates
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_wallet ON payments(wallet_address);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_signature ON payments(signature);
CREATE INDEX IF NOT EXISTS idx_payments_entity ON payments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);

-- Updated at trigger
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Service Access (Gating)
-- Tracks which services users have unlocked
-- ============================================
CREATE TABLE IF NOT EXISTS service_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User information
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,

  -- Service details
  service_slug TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'one_time' CHECK (
    service_type IN ('one_time', 'subscription', 'time_limited')
  ),

  -- Access details
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL for lifetime access

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint: one access record per user+service
  UNIQUE(wallet_address, service_slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_access_user ON service_access(user_id);
CREATE INDEX IF NOT EXISTS idx_service_access_wallet ON service_access(wallet_address);
CREATE INDEX IF NOT EXISTS idx_service_access_service ON service_access(service_slug);
CREATE INDEX IF NOT EXISTS idx_service_access_active ON service_access(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_service_access_expires ON service_access(expires_at) WHERE expires_at IS NOT NULL;

-- Updated at trigger
CREATE TRIGGER update_service_access_updated_at
  BEFORE UPDATE ON service_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. Meeting Bookings
-- Store meeting booking details (previously in-memory)
-- ============================================
CREATE TABLE IF NOT EXISTS meeting_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Meeting details
  meeting_type TEXT NOT NULL,
  meeting_id TEXT UNIQUE NOT NULL, -- Generated meeting ID

  -- User information
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  wallet_address TEXT,
  email TEXT NOT NULL,
  name TEXT,

  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  timezone TEXT DEFAULT 'UTC',

  -- Payment
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  requires_payment BOOLEAN DEFAULT FALSE,
  payment_amount DECIMAL(20,8),
  payment_currency TEXT DEFAULT 'SOL',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')
  ),

  -- Calendar integration
  google_calendar_event_id TEXT,

  -- Metadata
  notes TEXT,
  conversation_id TEXT, -- If booked via AI chat
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_user ON meeting_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_wallet ON meeting_bookings(wallet_address);
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_email ON meeting_bookings(email);
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_type ON meeting_bookings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_status ON meeting_bookings(status);
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_scheduled ON meeting_bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meeting_bookings_meeting_id ON meeting_bookings(meeting_id);

-- Updated at trigger
CREATE TRIGGER update_meeting_bookings_updated_at
  BEFORE UPDATE ON meeting_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Payment Configuration
-- Central configuration for all payment types and pricing
-- ============================================
CREATE TABLE IF NOT EXISTS payment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Config identifier
  config_type TEXT NOT NULL, -- 'meeting_type', 'service_tier', 'newsletter_tier', 'deposit_type'
  config_slug TEXT NOT NULL, -- e.g., 'quick-chat-15min', 'all-pricing', 'premium'

  -- Display information
  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price_sol DECIMAL(20,8),
  price_usd DECIMAL(10,2),
  price_btc DECIMAL(20,8),
  price_eth DECIMAL(20,8),

  -- Configuration details
  duration_minutes INTEGER, -- For meetings
  benefits JSONB, -- Array of benefits
  metadata JSONB, -- Flexible config data

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(config_type, config_slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_config_type ON payment_config(config_type);
CREATE INDEX IF NOT EXISTS idx_payment_config_slug ON payment_config(config_slug);
CREATE INDEX IF NOT EXISTS idx_payment_config_active ON payment_config(is_active) WHERE is_active = true;

-- Updated at trigger
CREATE TRIGGER update_payment_config_updated_at
  BEFORE UPDATE ON payment_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Row Level Security (RLS)
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_config ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role has full access to user_profiles"
  ON user_profiles FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to payments"
  ON payments FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to service_access"
  ON service_access FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to meeting_bookings"
  ON meeting_bookings FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to payment_config"
  ON payment_config FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own data
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view their own service access"
  ON service_access FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view their own meeting bookings"
  ON meeting_bookings FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Anyone can view payment config (it's public)
CREATE POLICY "Anyone can view payment config"
  ON payment_config FOR SELECT USING (is_active = true);

-- ============================================
-- 7. Helper Functions
-- ============================================

-- Function to check if user has access to a service
CREATE OR REPLACE FUNCTION has_service_access(
  p_wallet_address TEXT,
  p_service_slug TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM service_access
    WHERE wallet_address = p_wallet_address
      AND service_slug = p_service_slug
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get payment statistics
CREATE OR REPLACE FUNCTION get_payment_stats(
  p_payment_type TEXT DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
) RETURNS TABLE (
  total_payments BIGINT,
  confirmed_payments BIGINT,
  pending_payments BIGINT,
  total_revenue_sol DECIMAL,
  total_revenue_usd DECIMAL,
  unique_customers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_payments,
    COUNT(*) FILTER (WHERE status = 'confirmed')::BIGINT as confirmed_payments,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_payments,
    COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed' AND currency = 'SOL'), 0)::DECIMAL as total_revenue_sol,
    COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed' AND currency = 'USD'), 0)::DECIMAL as total_revenue_usd,
    COUNT(DISTINCT wallet_address)::BIGINT as unique_customers
  FROM payments
  WHERE created_at BETWEEN p_start_date AND p_end_date
    AND (p_payment_type IS NULL OR payment_type = p_payment_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically expire service access
CREATE OR REPLACE FUNCTION expire_service_access()
RETURNS void AS $$
BEGIN
  UPDATE service_access
  SET
    is_active = false,
    revoked_at = NOW(),
    revoke_reason = 'Expired'
  WHERE is_active = true
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Initial Payment Configuration Data
-- ============================================

-- Meeting Types
INSERT INTO payment_config (config_type, config_slug, name, description, price_sol, price_usd, duration_minutes, benefits, is_active)
VALUES
  ('meeting_type', 'quick-chat-15min', 'Quick Chat (15 min)', 'Free discovery call to discuss your needs', 0, 0, 15, '["Free discovery call to discuss your needs"]'::jsonb, true),
  ('meeting_type', 'discovery-call-30min', 'Discovery Call (30 min)', 'Initial project scoping and feasibility analysis', 0.7, 150, 30, '["Initial project scoping and feasibility analysis"]'::jsonb, true),
  ('meeting_type', 'strategy-session-60min', 'Strategy Session (60 min)', 'Architecture review, tech stack decisions, and roadmap planning', 1.9, 400, 60, '["Architecture review", "Tech stack decisions", "Roadmap planning"]'::jsonb, true),
  ('meeting_type', 'deep-dive-90min', 'Deep Dive (90 min)', 'Comprehensive system architecture review and detailed technical planning', 3.3, 700, 90, '["Comprehensive system architecture review", "Detailed technical planning"]'::jsonb, true)
ON CONFLICT (config_type, config_slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_sol = EXCLUDED.price_sol,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

-- Service Access Tiers
INSERT INTO payment_config (config_type, config_slug, name, description, price_sol, price_usd, benefits, is_active, is_popular)
VALUES
  ('service_tier', 'all-pricing', 'Unlock All Pricing', 'View transparent pricing for all my services', 0.023, 5,
   '["View all Fractional CTO packages & pricing", "See Technical Writing rates", "Access Case Study pricing", "View Architecture Documentation costs", "Lifetime access - never expires"]'::jsonb,
   true, true)
ON CONFLICT (config_type, config_slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_sol = EXCLUDED.price_sol,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

-- Newsletter Tiers
INSERT INTO payment_config (config_type, config_slug, name, description, price_sol, price_usd, benefits, is_active, is_popular, metadata)
VALUES
  ('newsletter_tier', 'free', 'Free', 'Get weekly insights delivered to your inbox', 0, 0,
   '["Weekly newsletter with latest articles", "Curated tech insights and tips", "Access to free content", "No spam, unsubscribe anytime"]'::jsonb,
   true, false, '{"interval": "forever"}'::jsonb),
  ('newsletter_tier', 'premium', 'Premium', 'Unlock exclusive content and deep dives', 0.07, 14.99,
   '["All free benefits", "Exclusive premium content and tutorials", "In-depth technical deep dives", "Code examples and projects", "Early access to new articles", "Priority email support"]'::jsonb,
   true, true, '{"interval": "month"}'::jsonb),
  ('newsletter_tier', 'founding', 'Founding Member', 'One-time payment for lifetime access', 1.4, 300,
   '["All premium benefits", "Lifetime access - pay once, access forever", "Direct access for questions", "Founding member community", "Your name in supporters list (optional)", "1:1 consultation call (60 min)"]'::jsonb,
   true, false, '{"interval": "lifetime"}'::jsonb)
ON CONFLICT (config_type, config_slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_sol = EXCLUDED.price_sol,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

-- ============================================
-- 9. Views for Analytics
-- ============================================

-- Unified payment analytics view
CREATE OR REPLACE VIEW v_payment_analytics AS
SELECT
  payment_type,
  currency,
  status,
  DATE_TRUNC('day', created_at) as payment_date,
  COUNT(*) as payment_count,
  SUM(amount) as total_amount,
  COUNT(DISTINCT wallet_address) as unique_customers
FROM payments
GROUP BY payment_type, currency, status, DATE_TRUNC('day', created_at)
ORDER BY payment_date DESC;

-- Active service access view
CREATE OR REPLACE VIEW v_active_service_access AS
SELECT
  sa.service_slug,
  COUNT(*) as access_count,
  COUNT(*) FILTER (WHERE sa.expires_at IS NULL) as lifetime_access_count,
  COUNT(*) FILTER (WHERE sa.expires_at IS NOT NULL AND sa.expires_at > NOW()) as time_limited_access_count
FROM service_access sa
WHERE sa.is_active = true
GROUP BY sa.service_slug;

-- Meeting booking statistics
CREATE OR REPLACE VIEW v_meeting_stats AS
SELECT
  meeting_type,
  status,
  DATE_TRUNC('week', scheduled_at) as week,
  COUNT(*) as booking_count,
  COUNT(*) FILTER (WHERE requires_payment = true) as paid_bookings,
  SUM(payment_amount) FILTER (WHERE status = 'confirmed') as revenue
FROM meeting_bookings
GROUP BY meeting_type, status, DATE_TRUNC('week', scheduled_at)
ORDER BY week DESC;

-- ============================================
-- Done! Unified Payment System Created
-- ============================================

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- Add helpful comment
COMMENT ON TABLE payments IS 'Unified payment tracking for all payment types: meetings, service access, newsletter subscriptions, deposits, and tips';
COMMENT ON TABLE service_access IS 'Tracks user access to gated services and content';
COMMENT ON TABLE meeting_bookings IS 'Meeting booking records with payment integration';
COMMENT ON TABLE payment_config IS 'Central configuration for all payment types and pricing tiers';
