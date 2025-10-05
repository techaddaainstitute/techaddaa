const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://xambfjdpmqksypzqygza.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWJmamRwbXFrc3lwenF5Z3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDQ4ODYsImV4cCI6MjA3NDgyMDg4Nn0.-DafXBeH5egm_ku-XZM7Goesw5t19HzEjL5iRiEwbmI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailRegistration() {
  console.log('Testing email registration with different email formats...\n');

  const testEmails = [
    // Previously tested
    'abc@gmail.com',
    'test@example.com', 
    'user@test.com',
    'valid.email@domain.com', // This one worked
    'simple@email.co',
    
    // New tests with different patterns
    'user.name@domain.com',
    'firstname.lastname@company.org',
    'test123@business.net',
    'admin@website.info',
    'contact@service.biz',
    'hello@world.dev',
    'support@help.center',
    
    // Test with numbers and special chars
    'user123@domain123.com',
    'test_user@my-domain.com',
    'email+tag@domain.com',
    
    // Test common domains
    'testuser@yahoo.com',
    'newuser@hotmail.com',
    'person@outlook.com'
  ];

  const successfulEmails = [];
  const failedEmails = [];

  for (const email of testEmails) {
    console.log(`Testing email: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'testpassword123',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        console.log(`❌ Error: ${error.message}`);
        failedEmails.push(email);
      } else {
        console.log(`✅ Success: ${data.user ? 'User created' : 'No user data'}`);
        successfulEmails.push(email);
      }
    } catch (err) {
      console.log(`❌ Exception: ${err.message}`);
      failedEmails.push(email);
    }
    
    console.log('---');
  }

  console.log('\n=== SUMMARY ===');
  console.log(`✅ Successful emails (${successfulEmails.length}):`);
  successfulEmails.forEach(email => console.log(`  - ${email}`));
  
  console.log(`\n❌ Failed emails (${failedEmails.length}):`);
  failedEmails.forEach(email => console.log(`  - ${email}`));
  
  // Analyze patterns
  console.log('\n=== PATTERN ANALYSIS ===');
  if (successfulEmails.length > 0) {
    console.log('Successful email patterns:');
    successfulEmails.forEach(email => {
      const parts = email.split('@');
      const domain = parts[1];
      const tld = domain.split('.').pop();
      console.log(`  - Domain: ${domain}, TLD: ${tld}`);
    });
  }
}

testEmailRegistration().catch(console.error);