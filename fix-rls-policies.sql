-- Fix RLS policies for fees table
-- The issue is that the RLS policies are too restrictive for the application's needs

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own fees" ON public.fees;
DROP POLICY IF EXISTS "Users can insert own fees" ON public.fees;
DROP POLICY IF EXISTS "Users can update own fees" ON public.fees;

-- Create more permissive policies that allow the application to work
-- Policy 1: Allow authenticated users to view their own fees
CREATE POLICY "Users can view own fees" ON public.fees
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT id FROM public.user_profiles WHERE role IN ('admin', 'instructor')
        )
    );

-- Policy 2: Allow authenticated users to insert fees (for enrollment process)
-- This allows the application to create fees during enrollment
CREATE POLICY "Users can insert fees" ON public.fees
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            auth.uid() IN (
                SELECT id FROM public.user_profiles WHERE role IN ('admin', 'instructor')
            )
        )
    );

-- Policy 3: Allow authenticated users to update their own fees
CREATE POLICY "Users can update own fees" ON public.fees
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT id FROM public.user_profiles WHERE role IN ('admin', 'instructor')
        )
    );

-- Alternative: If the above doesn't work, we can temporarily disable RLS for testing
-- Uncomment the line below to disable RLS temporarily
-- ALTER TABLE public.fees DISABLE ROW LEVEL SECURITY;

-- Verify the policies were created
SELECT 'RLS policies updated successfully!' as status;

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'fees';