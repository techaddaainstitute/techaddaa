console.log('🧪 Testing Comprehensive RLS Fix...');
console.log('=====================================');

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testComprehensiveFix() {
  try {
    console.log('\n1. Testing admin_user table access...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_user')
      .select('id, email, full_name, role, is_active')
      .limit(1);
    
    if (adminError) {
      console.log('❌ Admin user access failed:', adminError.message);
      return false;
    } else {
      console.log('✅ Admin user access working!');
      console.log('📊 Admin users found:', adminUsers.length);
    }

    console.log('\n2. Testing admin_sessions table access...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('admin_user_id, expires_at')
      .limit(1);
    
    if (sessionsError) {
      console.log('❌ Admin sessions access failed:', sessionsError.message);
      return false;
    } else {
      console.log('✅ Admin sessions access working!');
      console.log('📊 Sessions found:', sessions.length);
    }

    console.log('\n3. Testing the problematic query with join...');
    const { data: joinData, error: joinError } = await supabase
      .from('admin_sessions')
      .select('admin_user_id, expires_at, admin_user:admin_user_id(id, email, full_name, role, is_active)')
      .limit(1);
    
    if (joinError) {
      console.log('❌ Join query failed:', joinError.message);
      return false;
    } else {
      console.log('✅ Join query working!');
      console.log('📊 Join data:', joinData);
    }

    console.log('\n4. Testing admin login...');
    const { data: loginData, error: loginError } = await supabase.rpc('verify_admin_password', {
      p_email: 'techaddaainstitute@gmail.com',
      p_password: 'Techaddaa@2024'
    });

    if (loginError) {
      console.log('❌ Admin login failed:', loginError.message);
      return false;
    } else {
      console.log('✅ Admin login working!');
      console.log('📊 Login successful for:', loginData[0]?.email);
    }

    console.log('\n🎉 All tests passed! RLS fix is working correctly.');
    return true;

  } catch (err) {
    console.log('❌ Test failed with error:', err.message);
    return false;
  }
}

async function showFixInstructions() {
  console.log('\n📋 INSTRUCTIONS TO APPLY THE FIX:');
  console.log('==================================');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor (left sidebar)');
  console.log('3. Copy the contents of: comprehensive-rls-fix.sql');
  console.log('4. Paste and run the SQL script');
  console.log('5. Run this test again to verify the fix');
  console.log('\n💡 The comprehensive fix addresses:');
  console.log('   - Infinite recursion in admin_user policies');
  console.log('   - Infinite recursion in admin_sessions policies');
  console.log('   - Proper permissions for service_role and authenticated users');
  console.log('   - Utility functions for session management');
}

// Run the test
testComprehensiveFix().then(success => {
  if (!success) {
    showFixInstructions();
  }
});
