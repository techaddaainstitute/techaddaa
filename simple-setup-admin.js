/**
 * Simple Admin User Setup Script
 * Creates a default admin user for TechAddaa Institute
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

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

async function createDefaultAdmin() {
  try {
    console.log('🚀 Creating default admin user...');
    
    const defaultAdmin = {
      email: 'admin@techaddaa.com',
      password: 'TechAddaa@2024',
      full_name: 'TechAddaa Administrator',
      role: 'super_admin'
    };

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(defaultAdmin.password, saltRounds);

    // Try to insert the admin user directly
    const { data, error } = await supabase
      .from('admin_user')
      .insert([
        {
          email: defaultAdmin.email,
          password_hash: passwordHash,
          full_name: defaultAdmin.full_name,
          role: defaultAdmin.role,
          is_active: true,
          password_changed_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        console.log('✅ Admin user already exists with email:', defaultAdmin.email);
        
        // Try to fetch existing admin
        const { data: existingAdmin, error: fetchError } = await supabase
          .from('admin_user')
          .select('id, email, full_name, role, is_active, created_at')
          .eq('email', defaultAdmin.email)
          .single();

        if (fetchError) {
          console.log('⚠️  Could not fetch existing admin details:', fetchError.message);
        } else {
          console.log('📋 Existing admin details:');
          console.log(`   Email: ${existingAdmin.email}`);
          console.log(`   Name: ${existingAdmin.full_name}`);
          console.log(`   Role: ${existingAdmin.role}`);
          console.log(`   Active: ${existingAdmin.is_active}`);
          console.log(`   Created: ${existingAdmin.created_at}`);
        }
      } else {
        console.error('❌ Error creating admin user:', error);
        console.log('💡 Make sure you have run the create-admin-user-table.sql script first');
        return;
      }
    } else {
      console.log('✅ Default admin user created successfully!');
      console.log('📋 Admin details:');
      console.log(`   Email: ${data[0].email}`);
      console.log(`   Name: ${data[0].full_name}`);
      console.log(`   Role: ${data[0].role}`);
      console.log(`   ID: ${data[0].id}`);
    }

    console.log('\n🔐 Default login credentials:');
    console.log(`   Email: ${defaultAdmin.email}`);
    console.log(`   Password: ${defaultAdmin.password}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    
    // Test password verification
    console.log('\n🧪 Testing password verification...');
    const isPasswordValid = await bcrypt.compare(defaultAdmin.password, passwordHash);
    console.log(`✅ Password verification test: ${isPasswordValid ? 'PASSED' : 'FAILED'}`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
if (require.main === module) {
  createDefaultAdmin();
}

module.exports = { createDefaultAdmin };