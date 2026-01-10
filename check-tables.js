// Check if tables exist and their status
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbbvirurpgtaahmjdpyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYnZpcnVycGd0YWFobWpkcHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDg5NDEsImV4cCI6MjA4Mjc4NDk0MX0.EOrjnZc65agNUxFYCYsYaga48Vn436atYu2Njs8YRZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Checking database tables...');

  // Try to access different tables
  const tables = ['profiles', 'messages', 'scans'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      console.log(`${table} table:`, error ? 'Error - ' + error.message : 'Accessible');
    } catch (err) {
      console.log(`${table} table: Exception - ${err.message}`);
    }
  }

  // Try raw SQL query (this might not work with anon key)
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'' });
    console.log('Tables list:', { data, error });
  } catch (err) {
    console.log('Raw SQL query failed (expected with anon key)');
  }
}

checkTables();