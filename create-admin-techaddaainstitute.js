/**
 * Create Admin User: techaddaainstitute@gmail.com
 * This script creates the admin user and handles RLS policy issues
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  console.log('Required: REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or REACT_APP_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('🚀 Creating Admin User: techaddaainstitute@gmail.com');
    console.log('====================================================');

    const adminEmail = 'techaddaainstitute@gmail.com';
    const adminPassword = 'Techaddaa@2024';
    const adminName = 'TechAddaa Institute Administrator';
    const adminRole = 'super_admin';

    // Step 1: Try using RPC function first
    console.log('\n1. Attempting to create admin user via RPC function...');
    
    try {
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('create_admin_user', {
          p_email: adminEmail,
          p_password: adminPassword,
          p_full_name: adminName,
          p_role: adminRole
        });

      if (rpcError) {
        if (rpcError.message.includes('already exists')) {
          console.log('ℹ️  Admin user already exists');
          
          // Test login for existing user
          console.log('\n2. Testing login for existing user...');
          const { data: loginResult, error: loginError } = await supabase
            .rpc('verify_admin_password', {
              p_email: adminEmail,
              p_password: adminPassword
            });

          if (loginError) {
            console.log('⚠️  Login failed, password might be different. Updating password...');
            
            // Try to update password using direct table access
            const passwordHash = await bcrypt.hash(adminPassword, 12);
            const { error: updateError } = await supabase
              .from('admin_user')
              .update({ password_hash: passwordHash })
              .eq('email', adminEmail);

            if (updateError) {
              console.error('❌ Failed to update password:', updateError.message);
              console.log('\n💡 Manual SQL needed. Please run this in Supabase SQL Editor:');
              console.log(`UPDATE public.admin_user SET password_hash = crypt('${adminPassword}', gen_salt('bf', 12)) WHERE email = '${adminEmail}';`);
            } else {
              console.log('✅ Password updated successfully');
            }
          } else {
            console.log('✅ Login test successful');
            console.log(`   Admin ID: ${loginResult[0]?.admin_id}`);
            console.log(`   Role: ${loginResult[0]?.role}`);
          }
        } else {
          console.error('❌ RPC function failed:', rpcError.message);
          
          if (rpcError.message.includes('infinite recursion')) {
            console.log('\n🔧 RLS policy issue detected. Applying fix...');
            await applyRLSFix(adminEmail, adminPassword, adminName, adminRole);
          } else {
            throw rpcError;
          }
        }
      } else {
        console.log('✅ Admin user created successfully via RPC');
        if (rpcResult && rpcResult.length > 0) {
          console.log(`   ID: ${rpcResult[0].admin_id}`);
          console.log(`   Email: ${rpcResult[0].email}`);
          console.log(`   Name: ${rpcResult[0].full_name}`);
          console.log(`   Role: ${rpcResult[0].role}`);
        }
      }
    } catch (error) {
      console.error('❌ RPC approach failed:', error.message);
      console.log('\n🔧 Trying alternative approach...');
      await applyRLSFix(adminEmail, adminPassword, adminName, adminRole);
    }

    // Final verification
    console.log('\n3. Final verification...');
    try {
      const { data: verifyResult, error: verifyError } = await supabase
        .rpc('verify_admin_password', {
          p_email: adminEmail,
          p_password: adminPassword
        });

      if (verifyError) {
        console.error('❌ Final verification failed:', verifyError.message);
      } else {
        console.log('✅ Final verification successful');
        console.log('🎉 Admin user is ready for login!');
      }
    } catch (error) {
      console.log('⚠️  Verification test failed, but user might still work');
    }

    console.log('\n🎯 Login Credentials:');
    console.log('====================================================');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\nYou can now try logging in to the admin panel!');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.log('\n💡 If issues persist, please run the SQL manually in Supabase:');
    console.log('1. Open Supabase SQL Editor');
    console.log('2. Run the contents of fix-admin-user-policies.sql');
    console.log('3. Then run create-admin-techaddaa.sql');
  }
}

async function applyRLSFix(email, password, fullName, role) {
  console.log('🔧 Applying RLS policy fix...');
  
  try {
    // Try direct insertion with bcrypt hash
    const passwordHash = await bcrypt.hash(password, 12);
    
    const { data: insertResult, error: insertError } = await supabase
      .from('admin_user')
      .insert([
        {
          email: email,
          password_hash: passwordHash,
          full_name: fullName,
          role: role,
          is_active: true
        }
      ])
      .select()
      .single();

    if (insertError) {
      if (insertError.message.includes('duplicate key')) {
        console.log('ℹ️  User already exists, updating password...');
        
        const { error: updateError } = await supabase
          .from('admin_user')
          .update({ password_hash: passwordHash })
          .eq('email', email);

        if (updateError) {
          console.error('❌ Update failed:', updateError.message);
        } else {
          console.log('✅ Password updated');
        }
      } else {
        console.error('❌ Direct insertion failed:', insertError.message);
        console.log('\n📋 Manual SQL Commands:');
        console.log('Run these commands in Supabase SQL Editor:');
        console.log('');
        console.log('-- Temporarily disable RLS');
        console.log('ALTER TABLE public.admin_user DISABLE ROW LEVEL SECURITY;');
        console.log('');
        console.log('-- Insert admin user');
        console.log(`INSERT INTO public.admin_user (email, password_hash, full_name, role, is_active, created_at, updated_at)`);
        console.log(`VALUES ('${email}', crypt('${password}', gen_salt('bf', 12)), '${fullName}', '${role}', true, NOW(), NOW())`);
        console.log(`ON CONFLICT (email) DO UPDATE SET password_hash = crypt('${password}', gen_salt('bf', 12));`);
        console.log('');
        console.log('-- Re-enable RLS with fixed policy');
        console.log('ALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY;');
        console.log('DROP POLICY IF EXISTS "Admin users can view profiles" ON public.admin_user;');
        console.log('CREATE POLICY "Allow authenticated access" ON public.admin_user FOR ALL USING (auth.role() = \'service_role\' OR auth.role() = \'authenticated\');');
      }
    } else {
      console.log('✅ Admin user created via direct insertion');
      console.log(`   ID: ${insertResult.id}`);
      console.log(`   Email: ${insertResult.email}`);
    }
  } catch (error) {
    console.error('❌ RLS fix failed:', error.message);
  }
}

// Run the script
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };