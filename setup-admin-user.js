/**
 * Setup script for admin_user table
 * This script creates the admin_user table and sets up a default admin user
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ REACT_APP_SUPABASE_URL is not set in .env file');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env file');
  console.log('💡 For production, you should use the service role key from your Supabase dashboard');
  console.log('💡 For testing, we\'ll try with the anon key (limited permissions)');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminUser() {
  try {
    console.log('🚀 Setting up admin_user table and default admin...');

    // Check if admin_user table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'admin_user');

    if (tableError) {
      console.error('❌ Error checking for admin_user table:', tableError);
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('⚠️ admin_user table not found. Please run the SQL schema first.');
      console.log('Execute the contents of create-admin-user-table.sql in your Supabase SQL editor.');
      return;
    }

    console.log('✅ admin_user table found');

    // Check if any admin users exist
    const { data: existingAdmins, error: adminError } = await supabase
      .from('admin_user')
      .select('admin_id, email')
      .limit(1);

    if (adminError) {
      console.error('❌ Error checking existing admins:', adminError);
      return;
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('✅ Admin users already exist:');
      existingAdmins.forEach(admin => {
        console.log(`   - ${admin.email} (ID: ${admin.admin_id})`);
      });
      return;
    }

    // Create default admin user
    console.log('📝 Creating default admin user...');
    
    const defaultEmail = 'admin@techaddaa.com';
    const defaultPassword = 'TechAddaa@2024';
    const defaultFullName = 'System Administrator';

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    // Insert the admin user
    const { data: newAdmin, error: insertError } = await supabase
      .from('admin_user')
      .insert({
        email: defaultEmail,
        password_hash: passwordHash,
        full_name: defaultFullName,
        role: 'super_admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError);
      return;
    }

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', defaultEmail);
    console.log('🔑 Password:', defaultPassword);
    console.log('👤 Full Name:', defaultFullName);
    console.log('🎭 Role: super_admin');
    console.log('🆔 Admin ID:', newAdmin.admin_id);
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the default password after first login!');
    console.log('');

    // Test the admin functions
    console.log('🧪 Testing admin functions...');

    // Test password verification
    const { data: verifyResult, error: verifyError } = await supabase
      .rpc('verify_admin_password', {
        p_email: defaultEmail,
        p_password: defaultPassword
      });

    if (verifyError) {
      console.error('❌ Password verification test failed:', verifyError);
    } else if (verifyResult && verifyResult.length > 0) {
      console.log('✅ Password verification test passed');
    } else {
      console.log('❌ Password verification test failed - no result');
    }

    // Test login tracking
    const { error: loginError } = await supabase
      .rpc('update_admin_last_login', { p_admin_id: newAdmin.admin_id });

    if (loginError) {
      console.error('❌ Login tracking test failed:', loginError);
    } else {
      console.log('✅ Login tracking test passed');
    }

    console.log('');
    console.log('🎉 Admin user setup completed successfully!');
    console.log('You can now login to the admin panel with the credentials above.');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
if (require.main === module) {
  setupAdminUser();
}

module.exports = { setupAdminUser };