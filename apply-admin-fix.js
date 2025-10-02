/**
 * Apply Admin User RLS Policy Fix
 * This script fixes the infinite recursion issue and creates the admin user
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Supabase configuration with service role key for admin operations
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  console.log('Required: REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyAdminFix() {
  try {
    console.log('🔧 Applying Admin User RLS Policy Fix...');
    console.log('==========================================');

    // Step 1: Try to create the admin user using the RPC function
    console.log('\n1. Creating admin user via RPC function...');
    
    try {
      const { data: createResult, error: createError } = await supabase
        .rpc('create_admin_user', {
          p_email: 'techaddaa@gmail.com',
          p_password: 'Techaddaa@2024',
          p_full_name: 'TechAddaa Administrator',
          p_role: 'super_admin'
        });

      if (createError) {
        if (createError.message.includes('already exists')) {
          console.log('ℹ️  Admin user already exists, skipping creation');
        } else {
          console.error('❌ Failed to create admin user:', createError.message);
          
          // If RPC fails, we need to apply the SQL fix manually
          console.log('\n🔄 The RLS policies need to be fixed in Supabase directly.');
          console.log('Please run the following SQL in your Supabase SQL Editor:');
          console.log('==========================================');
          
          const sqlFix = fs.readFileSync(path.join(__dirname, 'fix-admin-user-policies.sql'), 'utf8');
          console.log(sqlFix);
          console.log('==========================================');
          
          return;
        }
      } else {
        console.log('✅ Admin user created successfully');
        if (createResult && createResult.length > 0) {
          console.log(`   ID: ${createResult[0].admin_id}`);
          console.log(`   Email: ${createResult[0].email}`);
          console.log(`   Name: ${createResult[0].full_name}`);
          console.log(`   Role: ${createResult[0].role}`);
        }
      }
    } catch (error) {
      console.error('❌ RPC function error:', error.message);
      console.log('\n💡 This likely means the RLS policies need to be fixed.');
      console.log('Please run the SQL in fix-admin-user-policies.sql in Supabase SQL Editor');
      return;
    }

    // Step 2: Test the login
    console.log('\n2. Testing admin login...');
    
    try {
      const { data: loginResult, error: loginError } = await supabase
        .rpc('verify_admin_password', {
          p_email: 'techaddaa@gmail.com',
          p_password: 'Techaddaa@2024'
        });

      if (loginError) {
        console.error('❌ Login test failed:', loginError.message);
      } else {
        console.log('✅ Login test successful');
        if (loginResult && loginResult.length > 0) {
          console.log(`   Admin ID: ${loginResult[0].admin_id}`);
          console.log(`   Email: ${loginResult[0].email}`);
          console.log(`   Role: ${loginResult[0].role}`);
          console.log(`   Active: ${loginResult[0].is_active}`);
        }
      }
    } catch (error) {
      console.error('❌ Login test error:', error.message);
    }

    // Step 3: Verify table access
    console.log('\n3. Testing table access...');
    
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('admin_user')
        .select('id, email, full_name, role, is_active')
        .eq('email', 'techaddaa@gmail.com')
        .single();

      if (tableError) {
        console.error('❌ Table access failed:', tableError.message);
      } else {
        console.log('✅ Table access successful');
        console.log(`   Found admin: ${tableData.email} (${tableData.role})`);
      }
    } catch (error) {
      console.error('❌ Table access error:', error.message);
    }

    console.log('\n🎯 Summary:');
    console.log('==========================================');
    console.log('Admin credentials for login:');
    console.log('Email: techaddaa@gmail.com');
    console.log('Password: Techaddaa@2024');
    console.log('\nIf login still fails, please:');
    console.log('1. Run fix-admin-user-policies.sql in Supabase SQL Editor');
    console.log('2. Ensure pgcrypto extension is enabled');
    console.log('3. Check that your .env file has the correct Supabase URL');

  } catch (error) {
    console.error('❌ Fix script failed:', error.message);
  }
}

// Run the fix script
if (require.main === module) {
  applyAdminFix();
}

module.exports = { applyAdminFix };