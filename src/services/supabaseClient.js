import { createClient } from '@supabase/supabase-js';
import { EXTERNAL_SERVICES } from '../config';

let supabaseClient = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    if (!EXTERNAL_SERVICES.supabase.url || !EXTERNAL_SERVICES.supabase.anonKey) {
      throw new Error('Supabase configuration is missing. Please check your environment variables.');
    }

    supabaseClient = createClient(
      EXTERNAL_SERVICES.supabase.url,
      EXTERNAL_SERVICES.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  return supabaseClient;
};

export default getSupabaseClient;
