-- Update user_profiles table to support phone-only users
-- This removes the foreign key constraint and makes email nullable

-- First, drop the existing foreign key constraint
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Make email nullable since phone users don't need email
ALTER TABLE public.user_profiles ALTER COLUMN email DROP NOT NULL;

-- Make email unique constraint conditional (only for non-null emails)
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_email_key;
-- Drop the index if it already exists before creating it
DROP INDEX IF EXISTS user_profiles_email_unique;
CREATE UNIQUE INDEX user_profiles_email_unique ON public.user_profiles (email) WHERE email IS NOT NULL;

-- Make phone_number unique to prevent duplicate phone registrations
-- Use IF NOT EXISTS equivalent by dropping first, then adding
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_phone_number_unique;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_phone_number_unique UNIQUE (phone_number);

-- Add a check constraint to ensure either email or phone_number is provided
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_contact_check;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_contact_check 
CHECK (email IS NOT NULL OR phone_number IS NOT NULL);

-- Update RLS policies to work with phone-only users
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create new RLS policies that work for both email and phone users
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT USING (
  auth.uid() = id OR 
  (auth.uid() IS NULL AND id IS NOT NULL)
);

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (
  auth.uid() = id OR 
  (auth.uid() IS NULL AND id IS NOT NULL)
);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (true);