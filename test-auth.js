// Test authentication and profile access
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthAndProfiles() {
  console.log('Testing authentication and profile access...');

  // Try to sign in with the specialist email (you'll need to provide the password)
  const email = 'rupantamajumder041@gmail.com';
  const password = 'testpassword123'; // You'll need to set this to the actual password

  console.log(`Attempting to sign in with ${email}...`);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error('Sign in failed:', signInError);
    return;
  }

  console.log('✅ Signed in successfully!');
  console.log('User:', signInData.user?.email);
  console.log('User ID:', signInData.user?.id);

  // Now try to get specialists
  const { data: specialists, error: specError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'specialist');

  console.log('Specialists query result:', { data: specialists, error: specError });

  // Try to get own profile
  const { data: ownProfile, error: ownError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', signInData.user?.id);

  console.log('Own profile:', { data: ownProfile, error: ownError });

  // Sign out
  await supabase.auth.signOut();
  console.log('Signed out');
}

// Note: This script needs the actual password for the specialist account
// For now, let's just check if we can see profiles when authenticated with a test account

testAuthAndProfiles();