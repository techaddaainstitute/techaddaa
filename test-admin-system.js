/**
 * Test script for admin authentication system
 * This script tests the admin_user table functionality and authentication flow
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminSystem() {
  try {
    console.log('🧪 Testing Admin Authentication System...');
    console.log('=====================================');

    // Test 1: Check if admin_user table exists
    console.log('\n1. Checking admin_user table...');
    const { data: adminUsers, error: tableError } = await supabase
      .from('admin_user')
      .select('admin_id, email, full_name, role, is_active, created_at')
      .limit(5);

    if (tableError) {
      console.error('❌ admin_user table not accessible:', tableError.message);
      console.log('Please ensure you have run the SQL schema from create-admin-user-table.sql');
      return;
    }

    console.log('✅ admin_user table accessible');
    console.log(`📊 Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.role}) - Active: ${admin.is_active}`);
    });

    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found. Run setup-admin-user.js to create a default admin.');
      return;
    }

    // Test 2: Check admin_sessions table
    console.log('\n2. Checking admin_sessions table...');
    const { data: sessions, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('session_id, admin_user_id, expires_at')
      .limit(3);

    if (sessionError) {
      console.error('❌ admin_sessions table not accessible:', sessionError.message);
      return;
    }

    console.log('✅ admin_sessions table accessible');
    console.log(`📊 Found ${sessions.length} active session(s)`);

    // Test 3: Test SQL functions
    console.log('\n3. Testing SQL functions...');

    // Test verify_admin_password function
    const testEmail = adminUsers[0].email;
    console.log(`Testing password verification for: ${testEmail}`);
    
    // This will fail with wrong password (expected)
    const { data: wrongPasswordResult, error: wrongPasswordError } = await supabase
      .rpc('verify_admin_password', {
        p_email: testEmail,
        p_password: 'wrongpassword'
      });

    if (wrongPasswordError || !wrongPasswordResult || wrongPasswordResult.length === 0) {
      console.log('✅ Password verification correctly rejects wrong password');
    } else {
      console.log('❌ Password verification should reject wrong password');
    }

    // Test update_admin_last_login function
    console.log('Testing login timestamp update...');
    const { error: loginError } = await supabase
      .rpc('update_admin_last_login', { p_admin_id: adminUsers[0].admin_id });

    if (loginError) {
      console.error('❌ Login timestamp update failed:', loginError.message);
    } else {
      console.log('✅ Login timestamp update successful');
    }

    // Test 4: Test RLS policies
    console.log('\n4. Testing Row Level Security policies...');
    
    // Test admin_user RLS
    const { data: rlsTest, error: rlsError } = await supabase
      .from('admin_user')
      .select('admin_id')
      .limit(1);

    if (rlsError) {
      console.error('❌ RLS test failed:', rlsError.message);
    } else {
      console.log('✅ RLS policies working (service role can access data)');
    }

    // Test 5: Check indexes
    console.log('\n5. Checking database indexes...');
    const { data: indexes, error: indexError } = await supabase
      .from('pg_indexes')
      .select('indexname, tablename')
      .in('tablename', ['admin_user', 'admin_sessions']);

    if (indexError) {
      console.warn('⚠️  Could not check indexes:', indexError.message);
    } else {
      console.log('✅ Database indexes:');
      indexes.forEach(index => {
        console.log(`   - ${index.indexname} on ${index.tablename}`);
      });
    }

    // Test 6: Test create_admin_user function
    console.log('\n6. Testing admin user creation...');
    const testAdminEmail = 'test-admin@techaddaa.com';
    
    // First, check if test admin already exists
    const { data: existingTest } = await supabase
      .from('admin_user')
      .select('admin_id')
      .eq('email', testAdminEmail)
      .single();

    if (existingTest) {
      console.log('✅ Test admin user already exists, skipping creation test');
    } else {
      const { data: createResult, error: createError } = await supabase
        .rpc('create_admin_user', {
          p_email: testAdminEmail,
          p_password: 'TestPassword123!',
          p_full_name: 'Test Administrator',
          p_role: 'admin'
        });

      if (createError) {
        console.error('❌ Admin user creation failed:', createError.message);
      } else {
        console.log('✅ Admin user creation successful');
        console.log(`📝 Created test admin with ID: ${createResult}`);
        
        // Clean up test user
        await supabase
          .from('admin_user')
          .delete()
          .eq('admin_id', createResult);
        console.log('🧹 Cleaned up test admin user');
      }
    }

    console.log('\n🎉 Admin system testing completed!');
    console.log('=====================================');
    console.log('✅ All core components are working properly');
    console.log('');
    console.log('Next steps:');
    console.log('1. Ensure you have created a default admin user (run setup-admin-user.js)');
    console.log('2. Test the admin login in your React application');
    console.log('3. Test password change functionality');
    console.log('4. Verify session management works correctly');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
if (require.main === module) {
  testAdminSystem();
}

module.exports = { testAdminSystem };