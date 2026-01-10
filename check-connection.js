// Check if table exists and basic connectivity
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('Testing basic Supabase connection...');

  try {
    // Test basic connection with a simple query that doesn't require auth
    const { data, error } = await supabase.from('messages').select('count').limit(1);
    console.log('Messages table test:', { data, error });
  } catch (err) {
    console.log('Connection error:', err.message);
  }

  // Check if we can access the auth system
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user ? 'Logged in' : 'Not logged in');

  // Try to get table info (this might work)
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    console.log('REST API response status:', response.status);
  } catch (err) {
    console.log('REST API error:', err.message);
  }
}

checkConnection();