/**
 * Apply Admin ID Column Fix
 * This script fixes the column name mismatch in RPC functions
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

async function applyAdminIdFix() {
  try {
    console.log('🔧 Applying Admin ID Column Fix...');
    console.log('===================================');

    // Step 1: Test current login to confirm the error
    console.log('\n1. Testing current login to confirm error...');
    
    try {
      const { data: testResult, error: testError } = await supabase
        .rpc('verify_admin_password', {
          p_email: 'techaddaainstitute@gmail.com',
          p_password: 'Techaddaa@2024'
        });

      if (testError) {
        console.log('✅ Confirmed error:', testError.message);
        if (testError.message.includes('admin_id does not exist')) {
          console.log('   This is the expected column mismatch error');
        }
      } else {
        console.log('⚠️  No error found, but let\'s apply the fix anyway');
      }
    } catch (error) {
      console.log('✅ Confirmed error:', error.message);
    }

    // Step 2: Apply the SQL fix
    console.log('\n2. The fix needs to be applied manually in Supabase SQL Editor');
    console.log('   Please copy and run the following SQL:');
    console.log('===================================');
    
    const sqlFix = fs.readFileSync(path.join(__dirname, 'fix-admin-id-column.sql'), 'utf8');
    console.log(sqlFix);
    console.log('===================================');

    // Step 3: Test after manual fix (this will likely still fail until SQL is run)
    console.log('\n3. After running the SQL above, test with this script again');
    console.log('   Or run: node test-admin-login-techaddaainstitute.js');

    console.log('\n🎯 Summary:');
    console.log('===================================');
    console.log('Issue: RPC functions return admin_id but table column is id');
    console.log('Solution: Updated RPC functions to map id -> admin_id correctly');
    console.log('');
    console.log('Next steps:');
    console.log('1. Copy the SQL above into Supabase SQL Editor');
    console.log('2. Run the SQL to update the functions');
    console.log('3. Test login again');

  } catch (error) {
    console.error('❌ Fix script failed:', error.message);
  }
}

// Function to test after fix is applied
async function testAfterFix() {
  try {
    console.log('🧪 Testing Admin Login After Fix...');
    console.log('===================================');

    const { data: loginResult, error: loginError } = await supabase
      .rpc('verify_admin_password', {
        p_email: 'techaddaainstitute@gmail.com',
        p_password: 'Techaddaa@2024'
      });

    if (loginError) {
      console.error('❌ Login still failing:', loginError.message);
      return false;
    }

    if (!loginResult || loginResult.length === 0) {
      console.error('❌ No login data returned');
      return false;
    }

    console.log('✅ Login successful after fix!');
    console.log('📋 Admin Details:');
    console.log(`   ID: ${loginResult[0].admin_id}`);
    console.log(`   Email: ${loginResult[0].email}`);
    console.log(`   Name: ${loginResult[0].full_name}`);
    console.log(`   Role: ${loginResult[0].role}`);
    console.log(`   Active: ${loginResult[0].is_active}`);

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the appropriate function based on command line argument
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    testAfterFix().then(success => {
      if (success) {
        console.log('\n✅ All tests passed!');
        process.exit(0);
      } else {
        console.log('\n❌ Tests failed!');
        process.exit(1);
      }
    });
  } else {
    applyAdminIdFix();
  }
}

module.exports = { applyAdminIdFix, testAfterFix };