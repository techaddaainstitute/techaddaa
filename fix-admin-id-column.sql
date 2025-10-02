-- =============================================
-- Fix Admin ID Column Mismatch
-- =============================================
-- This script fixes the column name mismatch between the table (id) and RPC functions (admin_id)

-- Drop and recreate the verify_admin_password function with correct column mapping
DROP FUNCTION IF EXISTS public.verify_admin_password(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.verify_admin_password(
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
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_admin_record RECORD;
BEGIN
  -- Get the admin user record
  SELECT au.id, au.email, au.password_hash, au.full_name, au.phone_number, au.role, au.is_active, au.failed_login_attempts, au.locked_until, au.last_login
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

  -- Return the admin user info with correct column mapping
  RETURN QUERY
  SELECT 
    v_admin_record.id as admin_id,  -- Map id to admin_id
    v_admin_record.email,
    v_admin_record.full_name,
    v_admin_record.phone_number,
    v_admin_record.role,
    v_admin_record.is_active,
    v_admin_record.last_login;
END;
$$;

-- Drop and recreate the create_admin_user function with correct column mapping
DROP FUNCTION IF EXISTS public.create_admin_user(TEXT, TEXT, TEXT, TEXT);

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

  -- Return the created user info with correct column mapping
  RETURN QUERY
  SELECT 
    v_admin_id as admin_id,  -- Map id to admin_id
    p_email,
    p_full_name,
    p_role;
END;
$$;

-- Create a function to change admin password
CREATE OR REPLACE FUNCTION public.change_admin_password(
  p_admin_id UUID,
  p_old_password TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_current_hash TEXT;
  v_new_hash TEXT;
BEGIN
  -- Get current password hash
  SELECT password_hash INTO v_current_hash
  FROM public.admin_user
  WHERE id = p_admin_id AND is_active = true;

  -- Check if admin exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Admin user not found or inactive';
  END IF;

  -- Verify old password
  IF NOT (v_current_hash = crypt(p_old_password, v_current_hash)) THEN
    RAISE EXCEPTION 'Current password is incorrect';
  END IF;

  -- Hash new password
  v_new_hash := crypt(p_new_password, gen_salt('bf', 12));

  -- Update password
  UPDATE public.admin_user
  SET 
    password_hash = v_new_hash,
    password_changed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_admin_id;

  RETURN TRUE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.verify_admin_password TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password TO service_role;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO service_role;
GRANT EXECUTE ON FUNCTION public.change_admin_password TO authenticated;
GRANT EXECUTE ON FUNCTION public.change_admin_password TO service_role;

-- Test the fix by verifying the admin user
SELECT 'Functions updated successfully' as status;

-- Verify the existing admin user can login
SELECT public.verify_admin_password('techaddaainstitute@gmail.com', 'Techaddaa@2024');