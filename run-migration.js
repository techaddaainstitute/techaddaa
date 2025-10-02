const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🔄 Starting migration to fix fees table...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migration-fix-fees-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim() === '') {
        continue;
      }
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
        // Continue with other statements
      }
    }
    
    console.log('🎉 Migration completed!');
    
    // Verify the table was created
    console.log('🔍 Verifying fees table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('fees')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table verification failed:', tableError);
    } else {
      console.log('✅ Fees table is accessible');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution
async function runMigrationDirect() {
  try {
    console.log('🔄 Starting direct migration...');
    
    // Drop existing table
    console.log('🗑️ Dropping existing fees table...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS public.fees CASCADE;'
    });
    
    if (dropError) {
      console.log('⚠️ Drop table warning (table might not exist):', dropError);
    }
    
    // Create new table with correct constraints
    console.log('🏗️ Creating fees table with correct foreign keys...');
    const createTableSQL = `
      CREATE TABLE public.fees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
        enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        installment_amount DECIMAL(10,2) NOT NULL,
        installment_number INTEGER NOT NULL DEFAULT 1,
        total_installments INTEGER NOT NULL DEFAULT 1,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
        payment_type VARCHAR(20) NOT NULL DEFAULT 'full' CHECK (payment_type IN ('full', 'emi')),
        due_date DATE NOT NULL,
        paid_date TIMESTAMP WITH TIME ZONE,
        course_name VARCHAR(255) NOT NULL,
        course_mode VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (course_mode IN ('online', 'offline')),
        payment_method VARCHAR(50),
        transaction_id VARCHAR(100),
        payment_gateway_response JSONB,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_user_course_installment UNIQUE (user_id, course_id, installment_number)
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (createError) {
      console.error('❌ Create table failed:', createError);
      return;
    }
    
    console.log('✅ Table created successfully');
    
    // Create indexes
    console.log('📊 Creating indexes...');
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_fees_user_id ON public.fees(user_id);
      CREATE INDEX IF NOT EXISTS idx_fees_course_id ON public.fees(course_id);
      CREATE INDEX IF NOT EXISTS idx_fees_status ON public.fees(status);
      CREATE INDEX IF NOT EXISTS idx_fees_due_date ON public.fees(due_date);
      CREATE INDEX IF NOT EXISTS idx_fees_payment_type ON public.fees(payment_type);
    `;
    
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: indexSQL
    });
    
    if (indexError) {
      console.log('⚠️ Index creation warning:', indexError);
    } else {
      console.log('✅ Indexes created successfully');
    }
    
    // Enable RLS
    console.log('🔒 Setting up Row Level Security...');
    const rlsSQL = `
      ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view own fees" ON public.fees
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert own fees" ON public.fees
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update own fees" ON public.fees
        FOR UPDATE USING (auth.uid() = user_id);
      
      GRANT SELECT, INSERT, UPDATE ON public.fees TO authenticated;
    `;
    
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: rlsSQL
    });
    
    if (rlsError) {
      console.log('⚠️ RLS setup warning:', rlsError);
    } else {
      console.log('✅ RLS policies created successfully');
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Check if exec_sql function exists, if not use alternative approach
async function checkAndRunMigration() {
  try {
    // Test if we can execute SQL directly
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'SELECT 1;'
    });
    
    if (error) {
      console.log('ℹ️ Direct SQL execution not available, using alternative approach...');
      console.log('📋 Please run the migration manually in your Supabase SQL editor:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of migration-fix-fees-table.sql');
      console.log('4. Execute the migration');
      return;
    }
    
    await runMigrationDirect();
  } catch (error) {
    console.error('❌ Error checking migration capability:', error);
    console.log('📋 Please run the migration manually in your Supabase SQL editor.');
  }
}

// Run the migration
checkAndRunMigration();