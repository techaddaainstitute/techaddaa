const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testFeesDisplay() {
  console.log('🔍 Testing Fees Display Issue...\n');

  try {
    // 1. Check if fees table exists and has data
    console.log('1. Checking fees table...');
    const { data: feesData, error: feesError } = await supabase
      .from('fees')
      .select('*')
      .limit(5);

    if (feesError) {
      console.error('❌ Error fetching fees:', feesError);
      return;
    }

    console.log(`✅ Found ${feesData.length} fee records in database`);
    if (feesData.length > 0) {
      console.log('📋 Sample fee record:');
      console.log(JSON.stringify(feesData[0], null, 2));
    }

    // 2. Check user_profiles table
    console.log('\n2. Checking user_profiles...');
    const { data: usersData, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .limit(3);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`✅ Found ${usersData.length} user profiles`);
    if (usersData.length > 0) {
      console.log('👤 Sample user:');
      console.log(JSON.stringify(usersData[0], null, 2));
    }

    // 3. Test getUserFees for a specific user
    if (usersData.length > 0 && feesData.length > 0) {
      const testUserId = usersData[0].id;
      console.log(`\n3. Testing getUserFees for user: ${testUserId}`);
      
      const { data: userFeesData, error: userFeesError } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', testUserId)
        .order('due_date', { ascending: true });

      if (userFeesError) {
        console.error('❌ Error fetching user fees:', userFeesError);
        return;
      }

      console.log(`✅ Found ${userFeesData.length} fee records for this user`);
      if (userFeesData.length > 0) {
        console.log('💰 User fees:');
        userFeesData.forEach((fee, index) => {
          console.log(`  ${index + 1}. Course: ${fee.course_name}, Amount: ₹${fee.installment_amount}, Status: ${fee.status}, Due: ${fee.due_date}`);
        });
      } else {
        console.log('⚠️  No fees found for this user');
        
        // Check if there are fees for any user
        const { data: anyUserFees, error: anyUserFeesError } = await supabase
          .from('fees')
          .select('user_id, course_name, installment_amount, status')
          .limit(5);

        if (!anyUserFeesError && anyUserFees.length > 0) {
          console.log('\n📊 Fees exist for other users:');
          anyUserFees.forEach((fee, index) => {
            console.log(`  ${index + 1}. User: ${fee.user_id}, Course: ${fee.course_name}, Amount: ₹${fee.installment_amount}, Status: ${fee.status}`);
          });
        }
      }
    }

    // 4. Check RLS policies
    console.log('\n4. Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: 'fees' })
      .catch(() => {
        // If RPC doesn't exist, try direct query
        return supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', 'fees');
      });

    if (!policiesError && policies) {
      console.log(`✅ Found ${policies.length} RLS policies for fees table`);
    } else {
      console.log('⚠️  Could not check RLS policies');
    }

    // 5. Test with authentication context (simulate logged-in user)
    console.log('\n5. Testing with authentication simulation...');
    
    // Check if we can access fees without authentication
    const { data: publicFeesData, error: publicFeesError } = await supabase
      .from('fees')
      .select('count')
      .single();

    if (publicFeesError) {
      console.log('⚠️  RLS is likely blocking access without authentication');
      console.log('   Error:', publicFeesError.message);
    } else {
      console.log('✅ Can access fees table without authentication');
    }

    console.log('\n🎯 Summary:');
    console.log(`- Fees table has ${feesData.length} records`);
    console.log(`- User profiles table has ${usersData.length} records`);
    console.log('- Check if the user ID in your application matches the user_id in fees table');
    console.log('- Verify that RLS policies are not blocking the data access');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testFeesDisplay();