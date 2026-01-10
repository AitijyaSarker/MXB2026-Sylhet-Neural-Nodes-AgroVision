// Check profiles in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfiles() {
  console.log('Checking profiles in database...');

  // Try to get all profiles (this will fail due to RLS)
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('✅ Profiles found:', data);
    const specialists = data.filter(p => p.role === 'specialist');
    console.log('Specialists:', specialists);
  }
}

checkProfiles();