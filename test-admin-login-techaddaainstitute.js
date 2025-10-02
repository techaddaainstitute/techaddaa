/**
 * Test Admin Login for techaddaainstitute@gmail.com
 * This script tests the admin login functionality
 */

const { createClient } = require('@supabase/supabase-js');

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

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login');
    console.log('=====================');

    const testEmail = 'techaddaainstitute@gmail.com';
    const testPassword = 'Techaddaa@2024';

    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log('');

    // Test the login using the verify_admin_password RPC function
    console.log('🔐 Testing password verification...');
    
    const { data: loginResult, error: loginError } = await supabase
      .rpc('verify_admin_password', {
        p_email: testEmail,
        p_password: testPassword
      });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      
      if (loginError.message.includes('Invalid credentials')) {
        console.log('\n💡 Possible issues:');
        console.log('1. Password might be incorrect');
        console.log('2. User might not exist');
        console.log('3. Account might be disabled');
      } else if (loginError.message.includes('infinite recursion')) {
        console.log('\n💡 RLS policy issue detected');
        console.log('Please run the SQL commands provided earlier in Supabase SQL Editor');
      }
      
      return false;
    }

    if (!loginResult || loginResult.length === 0) {
      console.error('❌ No login data returned');
      return false;
    }

    console.log('✅ Login successful!');
    console.log('📋 Admin Details:');
    console.log(`   ID: ${loginResult[0].admin_id}`);
    console.log(`   Email: ${loginResult[0].email}`);
    console.log(`   Name: ${loginResult[0].full_name}`);
    console.log(`   Role: ${loginResult[0].role}`);
    console.log(`   Active: ${loginResult[0].is_active}`);

    console.log('\n🎉 Admin login is working correctly!');
    console.log('You can now use these credentials in the admin panel.');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testAdminLogin().then(success => {
    if (success) {
      console.log('\n✅ All tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Tests failed!');
      process.exit(1);
    }
  });
}

module.exports = { testAdminLogin };