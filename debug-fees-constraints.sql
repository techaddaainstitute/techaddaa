-- Debug script for fees table foreign key constraints
-- Run this script to identify potential issues before creating fees entries

-- 1. Check if user_profiles table exists and has data
SELECT 'user_profiles' as table_name, COUNT(*) as record_count 
FROM public.user_profiles;

-- 2. Check if courses table exists and has data
SELECT 'courses' as table_name, COUNT(*) as record_count 
FROM public.courses;

-- 3. Check if course_enrollments table exists and has data
SELECT 'course_enrollments' as table_name, COUNT(*) as record_count 
FROM public.course_enrollments;

-- 4. Sample user_profiles data (first 5 records)
SELECT 'Sample user_profiles:' as info;
SELECT id, email, full_name, role 
FROM public.user_profiles 
LIMIT 5;

-- 5. Sample courses data (first 5 records)
SELECT 'Sample courses:' as info;
SELECT id, title, price, is_active 
FROM public.courses 
WHERE is_active = true
LIMIT 5;

-- 6. Check if fees table exists
SELECT 'fees table exists:' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'fees'
) as table_exists;

-- 7. Check foreign key constraints on fees table
SELECT 'Foreign key constraints:' as info;
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'fees'
AND tc.table_schema = 'public';

-- 8. Test insert with sample data (replace with actual IDs from your database)
-- Uncomment and modify the following lines with actual user_id and course_id values:

/*
-- Get a sample user_id
SELECT 'Sample user for testing:' as info;
SELECT id as user_id, email FROM public.user_profiles LIMIT 1;

-- Get a sample course_id  
SELECT 'Sample course for testing:' as info;
SELECT id as course_id, title FROM public.courses WHERE is_active = true LIMIT 1;

-- Test insert (replace USER_ID and COURSE_ID with actual values)
INSERT INTO public.fees (
    user_id,
    course_id,
    total_amount,
    installment_amount,
    installment_number,
    total_installments,
    status,
    payment_type,
    due_date,
    course_name,
    course_mode
) VALUES (
    'USER_ID_HERE',  -- Replace with actual user_id
    'COURSE_ID_HERE', -- Replace with actual course_id
    5000.00,
    5000.00,
    1,
    1,
    'paid',
    'full',
    CURRENT_DATE,
    'Test Course',
    'online'
);
*/