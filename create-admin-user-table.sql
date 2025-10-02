-- =============================================
-- TechAddaa Institute - Admin User Table
-- =============================================
-- This table stores dedicated admin users separate from regular user_profiles
-- Provides enhanced security and admin-specific features

-- =============================================
-- Admin User Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.admin_user (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admin_user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_admin_user_email ON public.admin_user(email);
CREATE INDEX IF NOT EXISTS idx_admin_user_active ON public.admin_user(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_user_role ON public.admin_user(role);
CREATE INDEX IF NOT EXISTS idx_admin_user_last_login ON public.admin_user(last_login);

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admin users can view admin records
CREATE POLICY "Admin users can view admin records" ON public.admin_user
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_user au 
      WHERE au.email = auth.jwt() ->> 'email' 
      AND au.is_active = true
    )
  );

-- Policy: Only super_admin can insert new admin users
CREATE POLICY "Super admin can create admin users" ON public.admin_user
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_user au 
      WHERE au.email = auth.jwt() ->> 'email' 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

-- Policy: Admin users can update their own profile, super_admin can update all
CREATE POLICY "Admin users can update profiles" ON public.admin_user
  FOR UPDATE USING (
    email = auth.jwt() ->> 'email' OR
    EXISTS (
      SELECT 1 FROM public.admin_user au 
      WHERE au.email = auth.jwt() ->> 'email' 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

-- Policy: Only super_admin can delete admin users
CREATE POLICY "Super admin can delete admin users" ON public.admin_user
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_user au 
      WHERE au.email = auth.jwt() ->> 'email' 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

-- =============================================
-- Triggers
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_admin_user_updated_at_trigger
  BEFORE UPDATE ON public.admin_user
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_user_updated_at();

-- =============================================
-- Admin Session Management Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES public.admin_user(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for session management
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user ON public.admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- Enable RLS for admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Admin users can only see their own sessions
CREATE POLICY "Admin users can view own sessions" ON public.admin_sessions
  FOR SELECT USING (
    admin_user_id IN (
      SELECT id FROM public.admin_user 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- =============================================
-- Helper Functions
-- =============================================

-- Function to create admin user with hashed password
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_phone_number TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
  v_admin_id UUID;
  v_password_hash TEXT;
BEGIN
  -- Hash the password (in production, use proper bcrypt)
  v_password_hash := crypt(p_password, gen_salt('bf'));
  
  -- Insert the admin user
  INSERT INTO public.admin_user (
    email, password_hash, full_name, phone_number, role
  ) VALUES (
    p_email, v_password_hash, p_full_name, p_phone_number, p_role
  ) RETURNING id INTO v_admin_id;
  
  RETURN v_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  admin_id UUID,
  email TEXT,
  full_name TEXT,
  phone_number TEXT,
  role TEXT,
  is_active BOOLEAN,
  last_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.full_name,
    au.phone_number,
    au.role,
    au.is_active,
    au.last_login
  FROM public.admin_user au
  WHERE au.email = p_email 
    AND au.password_hash = crypt(p_password, au.password_hash)
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last login
CREATE OR REPLACE FUNCTION update_admin_last_login(p_admin_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.admin_user 
  SET last_login = NOW(),
      failed_login_attempts = 0,
      locked_until = NULL
  WHERE id = p_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_admin_failed_login(p_email TEXT)
RETURNS VOID AS $$
DECLARE
  v_attempts INTEGER;
BEGIN
  UPDATE public.admin_user 
  SET failed_login_attempts = failed_login_attempts + 1
  WHERE email = p_email
  RETURNING failed_login_attempts INTO v_attempts;
  
  -- Lock account after 5 failed attempts for 30 minutes
  IF v_attempts >= 5 THEN
    UPDATE public.admin_user 
    SET locked_until = NOW() + INTERVAL '30 minutes'
    WHERE email = p_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Sample Data (Optional - for development)
-- =============================================
-- Uncomment the following to create a default super admin user
-- Note: Change the password in production!

/*
SELECT create_admin_user(
  'admin@techaddaa.com',
  'TechAddaa@2024',
  'Super Administrator',
  '+91-9876543210',
  'super_admin'
);
*/

-- =============================================
-- Verification Queries
-- =============================================
-- Check if admin_user table was created successfully
-- SELECT COUNT(*) as admin_count FROM public.admin_user;

-- Check table structure
-- \d public.admin_user;

-- Test admin creation (uncomment to test)
-- SELECT create_admin_user('test@admin.com', 'TestPass123', 'Test Admin');

-- Test admin verification (uncomment to test)
-- SELECT * FROM verify_admin_password('test@admin.com', 'TestPass123');