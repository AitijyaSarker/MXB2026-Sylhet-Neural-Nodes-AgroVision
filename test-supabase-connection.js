// Test Supabase connection and profile creation
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');

  // Test basic connection
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  if (error) {
    console.error('Connection test failed:', error);
  } else {
    console.log('✅ Supabase connection successful');
  }

  // Test auth status
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user ? user.email : 'No user logged in');
}

testConnection();