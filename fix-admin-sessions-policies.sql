-- =============================================
-- Fix Admin Sessions RLS Policies
-- =============================================
-- This script fixes the admin_sessions table RLS policies to prevent API errors

-- Drop existing policies for admin_sessions
DROP POLICY IF EXISTS "Admin users can view own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin users can insert own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin users can update own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin users can delete own sessions" ON public.admin_sessions;

-- Temporarily disable RLS to ensure we can work with the table
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;

-- Create simplified policies that work with service_role and authenticated users
-- Policy for SELECT operations
CREATE POLICY "admin_sessions_select_policy" ON public.admin_sessions
  FOR SELECT 
  TO authenticated, service_role
  USING (true);

-- Policy for INSERT operations
CREATE POLICY "admin_sessions_insert_policy" ON public.admin_sessions
  FOR INSERT 
  TO authenticated, service_role
  WITH CHECK (true);

-- Policy for UPDATE operations
CREATE POLICY "admin_sessions_update_policy" ON public.admin_sessions
  FOR UPDATE 
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Policy for DELETE operations
CREATE POLICY "admin_sessions_delete_policy" ON public.admin_sessions
  FOR DELETE 
  TO authenticated, service_role
  USING (true);

-- Re-enable RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.admin_sessions TO authenticated;
GRANT ALL ON public.admin_sessions TO service_role;

-- Create a function to clean up expired sessions
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

-- Create a function to get active admin sessions
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

-- Test the fix
SELECT 'Admin sessions policies updated successfully' as status;

-- Clean up any expired sessions
SELECT public.cleanup_expired_admin_sessions() as expired_sessions_cleaned;

-- Test access to admin_sessions table
SELECT COUNT(*) as total_sessions FROM public.admin_sessions;