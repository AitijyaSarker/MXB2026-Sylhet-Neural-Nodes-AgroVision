// Test specialist fetching with authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSpecialistFetching() {
  console.log('Testing specialist fetching...');

  // First, try to sign in with a test account (you'll need to provide credentials)
  // For now, let's check if we can see all profiles when authenticated

  console.log('Checking if specialists exist in database...');

  // Try to get all profiles (this will fail due to RLS)
  const { data: allProfiles, error: allError } = await supabase.from('profiles').select('*');
  console.log('All profiles query:', { data: allProfiles, error: allError });

  // Try to get specialists specifically
  const { data: specialists, error: specError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'specialist');

  console.log('Specialists query:', { data: specialists, error: specError });

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user ? user.email : 'No user logged in');

  if (user) {
    console.log('User metadata:', user.user_metadata);
    console.log('User raw metadata:', user.raw_user_meta_data);
  }
}

testSpecialistFetching();