/**
 * Debug Admin Login Issues
 * This script helps diagnose and fix admin login problems
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAdminLogin() {
  try {
    console.log('🔍 Debugging Admin Login Issues...');
    console.log('=====================================');

    const testEmail = 'techaddaa@gmail.com';
    const testPassword = 'Techaddaa@2024';

    // Step 1: Check if admin_user table exists and is accessible
    console.log('\n1. Checking admin_user table access...');
    try {
      const { data: tableTest, error: tableError } = await supabase
        .from('admin_user')
        .select('count')
        .limit(1);

      if (tableError) {
        console.error('❌ Cannot access admin_user table:', tableError.message);
        console.log('💡 You may need to run the create-admin-user-table.sql script first');
        return;
      }
      console.log('✅ admin_user table is accessible');
    } catch (error) {
      console.error('❌ Table access error:', error.message);
      return;
    }

    // Step 2: Check if the specific admin user exists
    console.log('\n2. Checking if admin user exists...');
    const { data: existingAdmin, error: fetchError } = await supabase
      .from('admin_user')
      .select('id, email, full_name, role, is_active, password_hash')
      .eq('email', testEmail)
      .single();

    if (fetchError || !existingAdmin) {
      console.log('❌ Admin user does not exist. Creating now...');
      
      // Create the admin user
      const passwordHash = await bcrypt.hash(testPassword, 12);
      
      const { data: newAdmin, error: createError } = await supabase
        .from('admin_user')
        .insert([
          {
            email: testEmail,
            password_hash: passwordHash,
            full_name: 'TechAddaa Administrator',
            role: 'super_admin',
            is_active: true
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('❌ Failed to create admin user:', createError.message);
        
        // Try alternative approach with RPC function
        console.log('\n🔄 Trying with RPC function...');
        try {
          const { data: rpcResult, error: rpcError } = await supabase
            .rpc('create_admin_user', {
              p_email: testEmail,
              p_password: testPassword,
              p_full_name: 'TechAddaa Administrator',
              p_role: 'super_admin'
            });

          if (rpcError) {
            console.error('❌ RPC function also failed:', rpcError.message);
            console.log('💡 You may need to run the SQL schema manually in Supabase');
            return;
          } else {
            console.log('✅ Admin user created via RPC function');
          }
        } catch (rpcErr) {
          console.error('❌ RPC function error:', rpcErr.message);
          return;
        }
      } else {
        console.log('✅ Admin user created successfully');
        console.log(`   ID: ${newAdmin.id}`);
        console.log(`   Email: ${newAdmin.email}`);
      }
    } else {
      console.log('✅ Admin user exists:');
      console.log(`   ID: ${existingAdmin.id}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.full_name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.is_active}`);
    }

    // Step 3: Test password verification
    console.log('\n3. Testing password verification...');
    
    // First, try the RPC function approach
    try {
      const { data: verifyResult, error: verifyError } = await supabase
        .rpc('verify_admin_password', {
          p_email: testEmail,
          p_password: testPassword
        });

      if (verifyError) {
        console.error('❌ RPC password verification failed:', verifyError.message);
        
        // Try manual verification
        console.log('\n🔄 Trying manual password verification...');
        const { data: adminData, error: adminError } = await supabase
          .from('admin_user')
          .select('id, email, password_hash, is_active')
          .eq('email', testEmail)
          .single();

        if (adminError || !adminData) {
          console.error('❌ Cannot fetch admin for manual verification');
        } else {
          const isValid = await bcrypt.compare(testPassword, adminData.password_hash);
          console.log(`🔐 Manual password verification: ${isValid ? 'VALID' : 'INVALID'}`);
          
          if (!isValid) {
            console.log('⚠️  Password hash mismatch. Updating password...');
            const newHash = await bcrypt.hash(testPassword, 12);
            
            const { error: updateError } = await supabase
              .from('admin_user')
              .update({ password_hash: newHash })
              .eq('id', adminData.id);

            if (updateError) {
              console.error('❌ Failed to update password:', updateError.message);
            } else {
              console.log('✅ Password updated successfully');
            }
          }
        }
      } else {
        console.log('✅ RPC password verification successful');
        if (verifyResult && verifyResult.length > 0) {
          console.log(`   Admin ID: ${verifyResult[0].admin_id}`);
          console.log(`   Role: ${verifyResult[0].role}`);
        }
      }
    } catch (error) {
      console.error('❌ Password verification error:', error.message);
    }

    // Step 4: Test the actual login flow
    console.log('\n4. Testing complete login flow...');
    try {
      // Simulate the AdminDatasource.adminLogin call
      const { data: loginResult, error: loginError } = await supabase
        .rpc('verify_admin_password', {
          p_email: testEmail,
          p_password: testPassword
        });

      if (loginError || !loginResult || loginResult.length === 0) {
        console.error('❌ Login flow failed:', loginError?.message || 'No admin data returned');
      } else {
        console.log('✅ Login flow successful');
        console.log('📋 Login result:', loginResult[0]);
      }
    } catch (error) {
      console.error('❌ Login flow error:', error.message);
    }

    console.log('\n🎯 Summary:');
    console.log('=====================================');
    console.log('If all tests passed, try logging in again with:');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log('\nIf issues persist, check:');
    console.log('1. Supabase RLS policies');
    console.log('2. Database functions are properly created');
    console.log('3. pgcrypto extension is enabled');

  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  }
}

// Run the debug script
if (require.main === module) {
  debugAdminLogin();
}

module.exports = { debugAdminLogin };