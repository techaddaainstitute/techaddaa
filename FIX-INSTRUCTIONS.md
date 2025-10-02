# 🔧 Fix Foreign Key Constraint Error - Step by Step Guide

## 🎯 Problem Identified
The `fees` table has an incorrect foreign key constraint that references `auth.users(id)` instead of `public.user_profiles(id)`. This causes the enrollment process to fail with:

```
insert or update on table "fees" violates foreign key constraint "fees_user_id_fkey"
Key is not present in table "users".
```

## 🛠️ Solution Steps

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `xambfjdpmqksypzqygza`

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New query"** to create a new SQL script

### Step 3: Execute the Migration
1. Copy the entire contents of `migration-fix-fees-table.sql` (located in your project root)
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the migration

**⚠️ Important**: This will drop the existing `fees` table and recreate it with correct constraints. Any existing fee data will be lost.

### Step 4: Verify the Fix
After running the migration, you can verify it worked by running this query in the SQL Editor:

```sql
-- Test the foreign key constraints
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
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'fees'
AND tc.table_schema = 'public';
```

You should see:
- `fees_user_id_fkey` referencing `user_profiles(id)`
- `fees_course_id_fkey` referencing `courses(id)`
- `fees_enrollment_id_fkey` referencing `course_enrollments(id)`

## 🧪 Test the Fix

### Option 1: Use the Test Script
Run the test script to verify everything works:
```bash
node test-enrollment.js
```

### Option 2: Test in the Application
1. Go to your application: http://localhost:3001
2. Navigate to a course details page
3. Try to enroll in a course
4. The enrollment should now work without foreign key errors

## 📋 What the Migration Does

1. **Drops** the existing `fees` table (with incorrect constraints)
2. **Creates** a new `fees` table with correct foreign key references:
   - `user_id` → `public.user_profiles(id)`
   - `course_id` → `public.courses(id)`
   - `enrollment_id` → `public.course_enrollments(id)`
3. **Adds** proper indexes for performance
4. **Sets up** Row Level Security (RLS) policies
5. **Grants** necessary permissions

## 🔍 Alternative Quick Fix (If Migration Fails)

If the full migration fails, you can try this minimal fix:

```sql
-- Drop the existing fees table
DROP TABLE IF EXISTS public.fees CASCADE;

-- Create a simple fees table with correct constraints
CREATE TABLE public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    installment_number INTEGER NOT NULL DEFAULT 1,
    total_installments INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_type VARCHAR(20) NOT NULL DEFAULT 'full',
    due_date DATE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_mode VARCHAR(20) NOT NULL DEFAULT 'online',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy
CREATE POLICY "Users can manage own fees" ON public.fees
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.fees TO authenticated;
```

## ✅ Success Indicators

After applying the fix, you should see:
- ✅ No more foreign key constraint errors during enrollment
- ✅ Fees entries are created successfully
- ✅ The test script shows "Fee creation successful!"
- ✅ Course enrollment works end-to-end

## 🆘 Need Help?

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Run the test script to see detailed error messages
3. Verify that `user_profiles` and `courses` tables exist and have data

---

**Next Steps**: After fixing the database, test the enrollment process in your application to confirm everything works correctly.