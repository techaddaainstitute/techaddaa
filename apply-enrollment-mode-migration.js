const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEnrollmentModeColumn() {
  try {
    console.log('🔍 Checking if enrollment_mode column exists...');
    
    // Try to query the enrollment_mode column
    const { data, error } = await supabase
      .from('course_enrollments')
      .select('id, enrollment_mode')
      .limit(1);
    
    if (error) {
      if (error.message.includes('enrollment_mode does not exist')) {
        console.log('❌ enrollment_mode column does not exist in the database');
        console.log('📝 The database schema needs to be updated manually');
        console.log('');
        console.log('Please run the following SQL commands in your Supabase dashboard:');
        console.log('');
        console.log('ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS enrollment_mode TEXT DEFAULT \'online\' CHECK (enrollment_mode IN (\'online\', \'offline\'));');
        console.log('ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS price_paid DECIMAL(10,2);');
        console.log('ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);');
        console.log('ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS completed_lessons INTEGER DEFAULT 0;');
        console.log('ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();');
        console.log('');
        console.log('UPDATE public.course_enrollments SET enrollment_mode = \'online\', progress_percentage = COALESCE(progress, 0), completed_lessons = 0, updated_at = NOW() WHERE enrollment_mode IS NULL;');
        return false;
      } else {
        console.error('❌ Error checking column:', error);
        return false;
      }
    } else {
      console.log('✅ enrollment_mode column exists!');
      console.log('Sample data:', data[0] || 'No records found');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
    return false;
  }
}

// Run the check
checkEnrollmentModeColumn();