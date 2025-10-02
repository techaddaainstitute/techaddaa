-- =============================================
-- Create Admin User for TechAddaa Institute
-- =============================================
-- This script creates an admin user with email: techaddaainstitute@gmail.com
-- and password: Techaddaa@2024

-- Method 1: Using the create_admin_user function (Recommended)
SELECT create_admin_user(
  'techaddaainstitute@gmail.com',  -- p_email
  'Techaddaa@2024',                -- p_password  
  'TechAddaa Institute Administrator', -- p_full_name
  NULL,                            -- p_phone_number (optional)
  'super_admin'                    -- p_role
);

-- Method 2: Direct INSERT (Alternative approach)
-- Note: This requires the pgcrypto extension to be enabled
-- INSERT INTO public.admin_user (
--   email, 
--   password_hash, 
--   full_name, 
--   role, 
--   is_active,
--   created_at,
--   updated_at
-- ) VALUES (
--   'techaddaainstitute@gmail.com',
--   crypt('Techaddaa@2024', gen_salt('bf')),
--   'TechAddaa Institute Administrator',
--   'super_admin',
--   true,
--   NOW(),
--   NOW()
-- );

-- Verify the admin user was created successfully
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM public.admin_user 
WHERE email = 'techaddaainstitute@gmail.com';

-- =============================================
-- Instructions for use:
-- =============================================
-- 1. Copy and paste this SQL into your Supabase SQL Editor
-- 2. Run the script to create the admin user
-- 3. The admin can now login with:
--    Email: techaddaainstitute@gmail.com
--    Password: Techaddaa@2024
-- 
-- IMPORTANT: Change the password after first login for security!
-- =============================================