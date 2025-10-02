const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseState() {
  console.log('🔍 Testing database state and foreign key constraints...\n');
  
  try {
    // 1. Check if user_profiles table exists and has data
    console.log('1️⃣ Checking user_profiles table...');
    const { data: userProfiles, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .limit(5);
    
    if (userError) {
      console.error('❌ Error accessing user_profiles:', userError);
    } else {
      console.log(`✅ Found ${userProfiles.length} user profiles`);
      if (userProfiles.length > 0) {
        console.log('   Sample user:', userProfiles[0]);
      }
    }
    
    // 2. Check if courses table exists and has data
    console.log('\n2️⃣ Checking courses table...');
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, is_active')
      .eq('is_active', true)
      .limit(5);
    
    if (courseError) {
      console.error('❌ Error accessing courses:', courseError);
    } else {
      console.log(`✅ Found ${courses.length} active courses`);
      if (courses.length > 0) {
        console.log('   Sample course:', courses[0]);
      }
    }
    
    // 3. Check if course_enrollments table exists
    console.log('\n3️⃣ Checking course_enrollments table...');
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('id, user_id, course_id')
      .limit(5);
    
    if (enrollmentError) {
      console.error('❌ Error accessing course_enrollments:', enrollmentError);
    } else {
      console.log(`✅ Found ${enrollments.length} enrollments`);
      if (enrollments.length > 0) {
        console.log('   Sample enrollment:', enrollments[0]);
      }
    }
    
    // 4. Check if fees table exists
    console.log('\n4️⃣ Checking fees table...');
    const { data: fees, error: feesError } = await supabase
      .from('fees')
      .select('*')
      .limit(1);
    
    if (feesError) {
      console.error('❌ Error accessing fees table:', feesError);
      console.log('   This might be the source of the foreign key constraint error!');
    } else {
      console.log('✅ Fees table is accessible');
      console.log(`   Found ${fees.length} fee records`);
    }
    
    // 5. Test creating a fee entry if we have sample data
    if (userProfiles && userProfiles.length > 0 && courses && courses.length > 0) {
      console.log('\n5️⃣ Testing fee creation with sample data...');
      
      const sampleUser = userProfiles[0];
      const sampleCourse = courses[0];
      
      console.log(`   Using user: ${sampleUser.email} (${sampleUser.id})`);
      console.log(`   Using course: ${sampleCourse.title} (${sampleCourse.id})`);
      
      const testFee = {
        user_id: sampleUser.id,
        course_id: sampleCourse.id,
        total_amount: 5000.00,
        installment_amount: 5000.00,
        installment_number: 1,
        total_installments: 1,
        status: 'pending',
        payment_type: 'full',
        due_date: new Date().toISOString().split('T')[0],
        course_name: sampleCourse.title,
        course_mode: 'online'
      };
      
      const { data: insertResult, error: insertError } = await supabase
        .from('fees')
        .insert([testFee])
        .select();
      
      if (insertError) {
        console.error('❌ Fee creation failed:', insertError);
        console.log('   This is likely the foreign key constraint error you\'re experiencing!');
        
        // Analyze the error
        if (insertError.message.includes('violates foreign key constraint')) {
          console.log('\n🔍 Foreign Key Constraint Analysis:');
          if (insertError.message.includes('user_id')) {
            console.log('   - Issue with user_id foreign key');
            console.log('   - The fees table might be referencing auth.users instead of public.user_profiles');
          }
          if (insertError.message.includes('course_id')) {
            console.log('   - Issue with course_id foreign key');
            console.log('   - The fees table might be referencing a non-existent courses table');
          }
        }
      } else {
        console.log('✅ Fee creation successful!');
        console.log('   Created fee:', insertResult[0]);
        
        // Clean up the test record
        await supabase
          .from('fees')
          .delete()
          .eq('id', insertResult[0].id);
        console.log('   Test record cleaned up');
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('If you see foreign key constraint errors above, you need to:');
    console.log('1. Go to your Supabase dashboard (https://supabase.com/dashboard)');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of migration-fix-fees-table.sql');
    console.log('4. Execute the migration to fix the foreign key constraints');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDatabaseState();