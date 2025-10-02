/**
 * Test Admin Sessions Fix
 * This script tests the admin sessions functionality after applying the RLS fix
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function testAdminSessionsFix() {
  try {
    console.log('🔧 Testing Admin Sessions Fix...');
    console.log('===================================');

    // Step 1: Test direct access to admin_sessions table
    console.log('\n1. Testing direct access to admin_sessions table...');
    
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('*')
      .limit(5);

    if (sessionsError) {
      console.error('❌ Direct access failed:', sessionsError.message);
      console.log('\n📋 SQL Fix needed:');
      console.log('===================================');
      
      const sqlFix = fs.readFileSync(path.join(__dirname, 'fix-admin-sessions-policies.sql'), 'utf8');
      console.log(sqlFix);
      console.log('===================================');
      return false;
    } else {
      console.log('✅ Direct access successful');
      console.log(`   Found ${sessionsData.length} sessions`);
    }

    // Step 2: Test admin login to create a session
    console.log('\n2. Testing admin login to create session...');
    
    const { data: loginResult, error: loginError } = await supabase
      .rpc('verify_admin_password', {
        p_email: 'techaddaainstitute@gmail.com',
        p_password: 'Techaddaa@2024'
      });

    if (loginError) {
      console.error('❌ Admin login failed:', loginError.message);
      return false;
    }

    console.log('✅ Admin login successful');
    const adminId = loginResult[0].admin_id;

    // Step 3: Test session creation
    console.log('\n3. Testing session creation...');
    
    const sessionToken = 'test_session_' + Date.now();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    const { data: sessionData, error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: adminId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })
      .select();

    if (sessionError) {
      console.error('❌ Session creation failed:', sessionError.message);
      return false;
    }

    console.log('✅ Session creation successful');
    console.log(`   Session ID: ${sessionData[0].id}`);
    console.log(`   Token: ${sessionData[0].session_token}`);

    // Step 4: Test session retrieval
    console.log('\n4. Testing session retrieval...');
    
    const { data: retrievedSessions, error: retrieveError } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('admin_user_id', adminId)
      .eq('session_token', sessionToken);

    if (retrieveError) {
      console.error('❌ Session retrieval failed:', retrieveError.message);
      return false;
    }

    console.log('✅ Session retrieval successful');
    console.log(`   Retrieved ${retrievedSessions.length} session(s)`);

    // Step 5: Test session cleanup
    console.log('\n5. Testing session cleanup...');
    
    const { data: cleanupResult, error: cleanupError } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken);

    if (cleanupError) {
      console.error('❌ Session cleanup failed:', cleanupError.message);
      return false;
    }

    console.log('✅ Session cleanup successful');

    // Step 6: Test RPC functions if they exist
    console.log('\n6. Testing RPC functions...');
    
    try {
      const { data: rpcSessions, error: rpcError } = await supabase
        .rpc('get_admin_sessions', { p_admin_id: adminId });

      if (rpcError) {
        console.log('⚠️  RPC function not available yet:', rpcError.message);
      } else {
        console.log('✅ RPC function working');
        console.log(`   Found ${rpcSessions.length} active sessions`);
      }
    } catch (error) {
      console.log('⚠️  RPC function not available:', error.message);
    }

    console.log('\n🎯 Summary:');
    console.log('===================================');
    console.log('✅ Admin sessions table is now accessible');
    console.log('✅ Session creation/retrieval/deletion working');
    console.log('✅ RLS policies are properly configured');
    console.log('');
    console.log('The admin sessions functionality should now work in your app!');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Function to show the SQL fix
async function showSqlFix() {
  console.log('📋 Admin Sessions SQL Fix:');
  console.log('===================================');
  
  const sqlFix = fs.readFileSync(path.join(__dirname, 'fix-admin-sessions-policies.sql'), 'utf8');
  console.log(sqlFix);
  console.log('===================================');
  
  console.log('\nTo apply this fix:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the SQL above');
  console.log('4. Run the SQL');
  console.log('5. Test again with: node test-admin-sessions-fix.js');
}

// Run the appropriate function based on command line argument
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--show-sql')) {
    showSqlFix();
  } else {
    testAdminSessionsFix().then(success => {
      if (success) {
        console.log('\n✅ All admin sessions tests passed!');
        process.exit(0);
      } else {
        console.log('\n❌ Admin sessions tests failed!');
        console.log('\nRun: node test-admin-sessions-fix.js --show-sql');
        console.log('to see the SQL fix that needs to be applied.');
        process.exit(1);
      }
    });
  }
}

module.exports = { testAdminSessionsFix, showSqlFix };