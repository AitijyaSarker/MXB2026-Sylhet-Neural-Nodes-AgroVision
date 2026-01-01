
import { createClient } from '@supabase/supabase-js';

// These environment variables should be provided in the project settings
// In Vite, client-side env vars must be prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  signUp: async (email: string, pass: string, metadata: any) => {
    return await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: metadata }
    });
  },
  signIn: async (email: string, pass: string) => {
    return await supabase.auth.signInWithPassword({ email, password: pass });
  },
  signOut: async () => {
    return await supabase.auth.signOut();
  }
};

export const dbService = {
  createProfile: async (userId: string, name: string, email: string, role: string) => {
    return await supabase.from('profiles').upsert({
      id: userId,
      name,
      email,
      role
    });
  },
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },
  saveScan: async (userId: string, result: any, imageUrl: string) => {
    return await supabase.from('scans').insert({
      user_id: userId,
      crop_name: result.cropName,
      disease_name: result.diseaseName,
      confidence: result.confidence,
      result_json: result,
      image_url: imageUrl
    });
  },
  getScanHistory: async (userId: string) => {
    return await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  sendMessage: async (convId: string, senderId: string, text: string) => {
    return await supabase.from('messages').insert({
      conversation_id: convId,
      sender_id: senderId,
      text: text
    });
  },
  subscribeToMessages: (convId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`messages:${convId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${convId}`
      }, callback)
      .subscribe();
  }
};
