
import { createClient } from '@supabase/supabase-js';

// These environment variables should be provided in the project settings
// In Vite, client-side env vars must be prefixed with VITE_
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Supabase environment variables are missing');
}
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
  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
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
  },
  getSpecialists: async () => {
    console.log('🔍 Executing getSpecialists query...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'specialist');

    console.log('📊 getSpecialists result:', { data, error, count: data?.length || 0 });
    return { data, error };
  },
  getMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return { data, error };
  },
  getConversationsForFarmer: async (farmerId: string) => {
    // Get all messages where conversation_id starts with farmerId-
    const { data, error } = await supabase
      .from('messages')
      .select(`
        conversation_id,
        text,
        created_at,
        sender_id
      `)
      .filter('conversation_id', 'like', `${farmerId}-%`)
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    // Group by conversation_id and get latest message
    const conversationsMap = new Map();
    
    for (const msg of data) {
      const convId = msg.conversation_id;
      const specialistId = convId.split('-')[1];
      
      if (!conversationsMap.has(convId)) {
        // Get specialist profile
        const { data: specialistProfile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', specialistId)
          .single();
          
        conversationsMap.set(convId, {
          id: convId,
          farmerName: 'You', // Since it's the farmer viewing
          farmerImage: 'https://picsum.photos/100/100?q=' + farmerId,
          lastMessage: msg.text,
          timestamp: new Date(msg.created_at),
          unreadCount: 0, // TODO: implement unread logic
          messages: [],
          specialistId: specialistId,
          specialistName: specialistProfile?.name || 'Specialist'
        });
      }
    }
    
    return { data: Array.from(conversationsMap.values()), error: null };
  },
  getConversationsForSpecialist: async (specialistId: string) => {
    // Get all messages where conversation_id ends with specialistId
    const { data, error } = await supabase
      .from('messages')
      .select(`
        conversation_id,
        text,
        created_at,
        sender_id
      `)
      .filter('conversation_id', 'like', `%-${specialistId}`)
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    // Group by conversation_id and get latest message
    const conversationsMap = new Map();
    
    for (const msg of data) {
      const convId = msg.conversation_id;
      const farmerId = convId.split('-')[0];
      
      if (!conversationsMap.has(convId)) {
        // Get farmer profile
        const { data: farmerProfile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', farmerId)
          .single();
          
        conversationsMap.set(convId, {
          id: convId,
          farmerName: farmerProfile?.name || 'Farmer',
          farmerImage: 'https://picsum.photos/100/100?q=' + farmerId,
          lastMessage: msg.text,
          timestamp: new Date(msg.created_at),
          unreadCount: 0, // TODO: implement unread logic
          messages: [],
          farmerId: farmerId
        });
      }
    }
    
    return { data: Array.from(conversationsMap.values()), error: null };
  },
  getAllProfiles: async () => {
    console.log('🔍 Executing getAllProfiles query...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    console.log('📊 getAllProfiles result:', { data, error, count: data?.length || 0 });
    return { data, error };
  },
};
