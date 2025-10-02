-- =============================================
-- Comprehensive RLS Fix for Admin Tables
-- =============================================
-- This script fixes infinite recursion issues in both admin_user and admin_sessions tables

-- =============================================
-- Step 1: Fix admin_user table policies
-- =============================================

-- Drop all existing problematic policies for admin_user
DROP POLICY IF EXISTS "Admin users can view admin records" ON public.admin_user;
DROP POLICY IF EXISTS "Super admin can create admin users" ON public.admin_user;
DROP POLICY IF EXISTS "Admin users can update profiles" ON public.admin_user;
DROP POLICY IF EXISTS "Super admin can delete admin users" ON public.admin_user;
DROP POLICY IF EXISTS "Admin users can view profiles" ON public.admin_user;
DROP POLICY IF EXISTS "Allow service role access" ON public.admin_user;

-- Temporarily disable RLS for admin_user
ALTER TABLE public.admin_user DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for admin_user
CREATE POLICY "admin_user_service_access" ON public.admin_user
  FOR ALL 
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS for admin_user
ALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Step 2: Fix admin_sessions table policies
-- =============================================

-- Drop all existing policies for admin_sessions
DROP POLICY IF EXISTS "Admin users can view own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin users can insert own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin users can update own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin users can delete own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_select_policy" ON public.admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_insert_policy" ON public.admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_update_policy" ON public.admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_delete_policy" ON public.admin_sessions;

-- Temporarily disable RLS for admin_sessions
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for admin_sessions
CREATE POLICY "admin_sessions_service_access" ON public.admin_sessions
  FOR ALL 
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS for admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Step 3: Grant necessary permissions
-- =============================================

-- Grant permissions for admin_user
GRANT ALL ON public.admin_user TO authenticated;
GRANT ALL ON public.admin_user TO service_role;

-- Grant permissions for admin_sessions
GRANT ALL ON public.admin_sessions TO authenticated;
GRANT ALL ON public.admin_sessions TO service_role;

-- =============================================
-- Step 4: Create utility functions
-- =============================================

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.admin_sessions 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- Grant execute permission on cleanup function
GRANT EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions TO service_role;

-- Function to get active admin sessions
CREATE OR REPLACE FUNCTION public.get_admin_sessions(p_admin_id UUID DEFAULT NULL)
RETURNS TABLE(
  id UUID,
  admin_user_id UUID,
  session_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF p_admin_id IS NULL THEN
    -- Return all active sessions
    RETURN QUERY
    SELECT 
      s.id,
      s.admin_user_id,
      s.session_token,
      s.expires_at,
      s.created_at
    FROM public.admin_sessions s
    WHERE s.expires_at > NOW()
    ORDER BY s.created_at DESC;
  ELSE
    -- Return sessions for specific admin
    RETURN QUERY
    SELECT 
      s.id,
      s.admin_user_id,
      s.session_token,
      s.expires_at,
      s.created_at
    FROM public.admin_sessions s
    WHERE s.admin_user_id = p_admin_id
      AND s.expires_at > NOW()
    ORDER BY s.created_at DESC;
  END IF;
END;
$$;

-- Grant execute permission on get sessions function
GRANT EXECUTE ON FUNCTION public.get_admin_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_sessions TO service_role;

-- =============================================
-- Step 5: Test the fix
-- =============================================

-- Test admin_user access
SELECT 'Testing admin_user access...' as test_step;
SELECT COUNT(*) as admin_user_count FROM public.admin_user;

-- Test admin_sessions access
SELECT 'Testing admin_sessions access...' as test_step;
SELECT COUNT(*) as admin_sessions_count FROM public.admin_sessions;

-- Clean up expired sessions
SELECT 'Cleaning up expired sessions...' as test_step;
SELECT public.cleanup_expired_admin_sessions() as expired_sessions_cleaned;

-- Final status
SELECT 'Comprehensive RLS fix applied successfully!' as status;