-- Admin Users Table
-- Stores authorized admin users with roles and permissions

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Auth Reference
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,

  -- Role & Permissions
  role TEXT NOT NULL DEFAULT 'viewer',
  permissions JSONB DEFAULT '[]'::jsonb,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_super_admin BOOLEAN DEFAULT FALSE,

  -- Metadata
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id),

  -- Constraints
  CONSTRAINT valid_role CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_auth_user_id ON admin_users(auth_user_id);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active) WHERE is_active = TRUE;

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Super admins can see all admin users
CREATE POLICY "Super admins can view all admin users"
  ON admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid()
      AND is_super_admin = TRUE
      AND is_active = TRUE
    )
  );

-- Admins can see all admin users
CREATE POLICY "Admins can view all admin users"
  ON admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
      AND is_active = TRUE
    )
  );

-- Users can see their own profile
CREATE POLICY "Users can view their own profile"
  ON admin_users
  FOR SELECT
  USING (auth_user_id = auth.uid());

-- Only super admins can insert new admin users
CREATE POLICY "Super admins can insert admin users"
  ON admin_users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid()
      AND is_super_admin = TRUE
      AND is_active = TRUE
    )
  );

-- Super admins can update all admin users
CREATE POLICY "Super admins can update admin users"
  ON admin_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid()
      AND is_super_admin = TRUE
      AND is_active = TRUE
    )
  );

-- Admins can update non-super-admin users
CREATE POLICY "Admins can update regular users"
  ON admin_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users a
      WHERE a.auth_user_id = auth.uid()
      AND a.role IN ('admin', 'super_admin')
      AND a.is_active = TRUE
    )
    AND is_super_admin = FALSE
  );

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update their own profile"
  ON admin_users
  FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (
    auth_user_id = auth.uid()
    AND role = (SELECT role FROM admin_users WHERE auth_user_id = auth.uid())
    AND is_super_admin = (SELECT is_super_admin FROM admin_users WHERE auth_user_id = auth.uid())
  );

-- Only super admins can delete admin users
CREATE POLICY "Super admins can delete admin users"
  ON admin_users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid()
      AND is_super_admin = TRUE
      AND is_active = TRUE
    )
  );

-- Helper Functions

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = user_id
    AND is_active = TRUE
    AND role IN ('admin', 'super_admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = user_id
    AND is_active = TRUE
    AND is_super_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin user role
CREATE OR REPLACE FUNCTION get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM admin_users
  WHERE auth_user_id = user_id
  AND is_active = TRUE;

  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin permission
CREATE OR REPLACE FUNCTION has_admin_permission(permission_name TEXT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admins have all permissions
  IF is_super_admin(user_id) THEN
    RETURN TRUE;
  END IF;

  -- Check if user has specific permission
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = user_id
    AND is_active = TRUE
    AND (
      permissions @> jsonb_build_array(permission_name)
      OR role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record admin login
CREATE OR REPLACE FUNCTION record_admin_login(user_id UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  UPDATE admin_users
  SET
    last_login_at = NOW(),
    login_count = login_count + 1,
    updated_at = NOW()
  WHERE auth_user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert default super admin (update with your email)
-- You'll need to sign up with this email first, then run this insert
-- INSERT INTO admin_users (
--   email,
--   full_name,
--   role,
--   is_super_admin,
--   is_active,
--   permissions
-- ) VALUES (
--   'your-email@example.com',
--   'Super Admin',
--   'super_admin',
--   TRUE,
--   TRUE,
--   '["all"]'::jsonb
-- );

-- Admin Activity Log Table (optional but recommended)
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,

  -- Activity Details
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,

  -- Changes
  old_data JSONB,
  new_data JSONB,

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for activity log
CREATE INDEX idx_admin_activity_log_user ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX idx_admin_activity_log_action ON admin_activity_log(action);

-- Enable RLS for activity log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
      AND is_active = TRUE
    )
  );

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_admin_user_id UUID;
BEGIN
  -- Get admin user ID from auth user ID
  SELECT id INTO v_admin_user_id
  FROM admin_users
  WHERE auth_user_id = auth.uid();

  -- Insert activity log
  INSERT INTO admin_activity_log (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    old_data,
    new_data
  ) VALUES (
    v_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_data,
    p_new_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE admin_users IS 'Stores authorized admin users with roles and permissions';
COMMENT ON COLUMN admin_users.role IS 'User role: super_admin, admin, editor, or viewer';
COMMENT ON COLUMN admin_users.permissions IS 'Array of specific permissions granted to user';
COMMENT ON COLUMN admin_users.is_super_admin IS 'Super admin flag - grants all permissions';
COMMENT ON TABLE admin_activity_log IS 'Logs all admin actions for audit trail';
