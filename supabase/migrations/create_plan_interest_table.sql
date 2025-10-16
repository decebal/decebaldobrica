-- Create plan_interest table for tracking user interest in premium plans
CREATE TABLE IF NOT EXISTS plan_interest (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('premium', 'founding')),
  plan_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(email, plan_id)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_plan_interest_email ON plan_interest(email);
CREATE INDEX IF NOT EXISTS idx_plan_interest_plan_id ON plan_interest(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_interest_created_at ON plan_interest(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plan_interest_notified_at ON plan_interest(notified_at) WHERE notified_at IS NULL;

-- Add RLS policies
ALTER TABLE plan_interest ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role has full access to plan_interest"
  ON plan_interest
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to view their own interests
CREATE POLICY "Users can view their own plan interests"
  ON plan_interest
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Add comment
COMMENT ON TABLE plan_interest IS 'Tracks user interest in premium newsletter plans that are not yet available';
