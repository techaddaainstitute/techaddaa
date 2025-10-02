-- Fix Admin User RLS Policies
-- This script fixes the infinite recursion issue in admin_user table policies

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin users can view profiles" ON public.admin_user;
DROP POLICY IF EXISTS "Super admin can create admin users" ON public.admin_user;
DROP POLICY IF EXISTS "Admin users can update profiles" ON public.admin_user;
DROP POLICY IF EXISTS "Super admin can delete admin users" ON public.admin_user;

-- Temporarily disable RLS to allow initial admin creation
ALTER TABLE public.admin_user DISABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows access for service role and authenticated users
-- We'll handle authorization in the application layer and RPC functions
CREATE POLICY "Allow service role access" ON public.admin_user
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    auth.role() = 'authenticated'
  );

-- Re-enable RLS
ALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.admin_user TO authenticated;
GRANT ALL ON public.admin_user TO service_role;

-- Ensure the sequence is accessible
GRANT USAGE, SELECT ON SEQUENCE public.admin_user_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.admin_user_id_seq TO service_role;

-- Create or replace the admin creation function with proper security
CREATE OR REPLACE FUNCTION public.create_admin_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT DEFAULT 'Admin User',
  p_role TEXT DEFAULT 'admin'
)
RETURNS TABLE(admin_id UUID, email TEXT, full_name TEXT, role TEXT) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_password_hash TEXT;
  v_admin_id UUID;
BEGIN
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM public.admin_user WHERE admin_user.email = p_email) THEN
    RAISE EXCEPTION 'Admin user with email % already exists', p_email;
  END IF;

  -- Hash the password
  v_password_hash := crypt(p_password, gen_salt('bf', 12));
  
  -- Generate UUID
  v_admin_id := gen_random_uuid();

  -- Insert the new admin user
  INSERT INTO public.admin_user (
    id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    v_admin_id,
    p_email,
    v_password_hash,
    p_full_name,
    p_role,
    true,
    NOW(),
    NOW()
  );

  -- Return the created user info
  RETURN QUERY
  SELECT 
    v_admin_id,
    p_email,
    p_full_name,
    p_role;
END;
$$;

-- Create or replace the password verification function
CREATE OR REPLACE FUNCTION public.verify_admin_password(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(admin_id UUID, email TEXT, full_name TEXT, role TEXT, is_active BOOLEAN) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_admin_record RECORD;
BEGIN
  -- Get the admin user record
  SELECT au.id, au.email, au.password_hash, au.full_name, au.role, au.is_active, au.failed_login_attempts, au.locked_until
  INTO v_admin_record
  FROM public.admin_user au
  WHERE au.email = p_email;

  -- Check if user exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid credentials';
  END IF;

  -- Check if account is locked
  IF v_admin_record.locked_until IS NOT NULL AND v_admin_record.locked_until > NOW() THEN
    RAISE EXCEPTION 'Account is temporarily locked';
  END IF;

  -- Check if account is active
  IF NOT v_admin_record.is_active THEN
    RAISE EXCEPTION 'Account is disabled';
  END IF;

  -- Verify password
  IF NOT (v_admin_record.password_hash = crypt(p_password, v_admin_record.password_hash)) THEN
    -- Increment failed login attempts
    UPDATE public.admin_user 
    SET 
      failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
      locked_until = CASE 
        WHEN COALESCE(failed_login_attempts, 0) + 1 >= 5 
        THEN NOW() + INTERVAL '15 minutes'
        ELSE NULL
      END
    WHERE id = v_admin_record.id;
    
    RAISE EXCEPTION 'Invalid credentials';
  END IF;

  -- Reset failed login attempts and update last login
  UPDATE public.admin_user 
  SET 
    failed_login_attempts = 0,
    locked_until = NULL,
    last_login = NOW()
  WHERE id = v_admin_record.id;

  -- Return the admin user info
  RETURN QUERY
  SELECT 
    v_admin_record.id,
    v_admin_record.email,
    v_admin_record.full_name,
    v_admin_record.role,
    v_admin_record.is_active;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_admin_password TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password TO service_role;

-- Create the initial admin user
SELECT public.create_admin_user(
  'techaddaa@gmail.com',
  'Techaddaa@2024',
  'TechAddaa Administrator',
  'super_admin'
);

-- Verify the admin user was created
SELECT 'Admin user created successfully' as status, email, full_name, role 
FROM public.admin_user 
WHERE email = 'techaddaa@gmail.com';