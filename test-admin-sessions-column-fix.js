/**
 * Test Admin Sessions Column Fix
 * This script tests if the admin_id -> id column fix resolves the API error
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminSessionsColumnFix() {
  try {
    console.log('🧪 Testing Admin Sessions Column Fix...');
    console.log('===================================');

    // Step 1: Test the exact query that was failing
    console.log('\n1. Testing the problematic query with correct column name...');
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('admin_sessions')
      .select(`
        admin_user_id,
        expires_at,
        admin_user:admin_user_id (
          id,
          email,
          full_name,
          role,
          is_active
        )
      `)
      .limit(1);

    if (sessionError) {
      console.error('❌ Query still failing:', sessionError.message);
      
      if (sessionError.message.includes('admin_id does not exist')) {
        console.log('   The column name issue persists');
        return false;
      } else if (sessionError.message.includes('No API key found')) {
        console.log('   API key issue - this is expected for direct REST calls');
      } else {
        console.log('   Different error - may need RLS policy fix');
      }
    } else {
      console.log('✅ Query successful with correct column name');
      console.log(`   Found ${sessionData.length} session(s)`);
    }

    // Step 2: Test session creation and validation
    console.log('\n2. Testing session creation and validation...');
    
    // First, login to get admin details
    const { data: loginResult, error: loginError } = await supabase
      .rpc('verify_admin_password', {
        p_email: 'techaddaainstitute@gmail.com',
        p_password: 'Techaddaa@2024'
      });

    if (loginError) {
      console.error('❌ Admin login failed:', loginError.message);
      return false;
    }

    const adminId = loginResult[0].admin_id;
    console.log('✅ Admin login successful');

    // Create a test session
    const sessionToken = 'test_column_fix_' + Date.now();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const { data: newSession, error: createError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: adminId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })
      .select();

    if (createError) {
      console.error('❌ Session creation failed:', createError.message);
      return false;
    }

    console.log('✅ Session creation successful');

    // Step 3: Test the validateSession query pattern
    console.log('\n3. Testing validateSession query pattern...');
    
    const { data: validationData, error: validationError } = await supabase
      .from('admin_sessions')
      .select(`
        admin_user_id,
        expires_at,
        admin_user:admin_user_id (
          id,
          email,
          full_name,
          role,
          is_active
        )
      `)
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (validationError) {
      console.error('❌ Validation query failed:', validationError.message);
      
      // Clean up the test session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);
        
      return false;
    }

    console.log('✅ Validation query successful');
    console.log(`   Admin ID: ${validationData.admin_user.id}`);
    console.log(`   Admin Email: ${validationData.admin_user.email}`);

    // Step 4: Clean up test session
    console.log('\n4. Cleaning up test session...');
    
    const { error: deleteError } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken);

    if (deleteError) {
      console.warn('⚠️  Failed to clean up test session:', deleteError.message);
    } else {
      console.log('✅ Test session cleaned up');
    }

    console.log('\n🎯 Summary:');
    console.log('===================================');
    console.log('✅ Column name fix successful');
    console.log('✅ Admin sessions queries now work with correct column (id)');
    console.log('✅ Session validation pattern working');
    console.log('');
    console.log('The admin_id column error should now be resolved!');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testAdminSessionsColumnFix().then(success => {
    if (success) {
      console.log('\n✅ All column fix tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Column fix tests failed!');
      process.exit(1);
    }
  });
}

module.exports = { testAdminSessionsColumnFix };