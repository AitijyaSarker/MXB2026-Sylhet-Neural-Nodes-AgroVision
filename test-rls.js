// Test RLS policy fix
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLS() {
  console.log('Testing RLS policy fix...');

  // Check if we can access specialists without authentication (should fail)
  const { data: unauthData, error: unauthError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'specialist');

  console.log('Unauthenticated access:', { data: unauthData, error: unauthError });

  // Now try to sign in with a test account
  // You'll need to provide actual credentials
  const testEmail = 'rupantamajumder041@gmail.com'; // Use one of your specialist emails
  const testPassword = 'your-password-here'; // You'll need to provide the actual password

  console.log(`Attempting to sign in with ${testEmail}...`);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInError) {
    console.log('Sign in failed. Please provide the correct password for the specialist account.');
    console.log('Error:', signInError);
    return;
  }

  console.log('✅ Signed in successfully!');
  console.log('User ID:', signInData.user?.id);

  // Now try to access specialists as authenticated user
  const { data: authData, error: authError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'specialist');

  console.log('Authenticated access to specialists:', { data: authData, error: authError });

  // Sign out
  await supabase.auth.signOut();
}

testRLS();