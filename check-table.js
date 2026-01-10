// Check table structure and RLS status
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableInfo() {
  console.log('Checking table information...');

  // Try to get table info (this might not work with anon key)
  try {
    // Let's try a different approach - check if we can access the auth.users table or something
    const { data, error } = await supabase.rpc('get_profiles_count'); // This won't work

    console.log('RPC result:', { data, error });
  } catch (err) {
    console.log('RPC failed as expected');
  }

  // Check if we can access the messages table (which might have different policies)
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('count')
    .limit(1);

  console.log('Messages table access:', { data: messages, error: msgError });

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user ? user.email : 'No user logged in');
}

checkTableInfo();