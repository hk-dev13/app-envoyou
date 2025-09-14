import { createClient } from '@supabase/supabase-js';
import { EXTERNAL_SERVICES } from '../config/index.js';
import logger from './logger';

let supabaseClient = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    if (!EXTERNAL_SERVICES.supabase.url || !EXTERNAL_SERVICES.supabase.anonKey) {
      // Log instead of throwing to avoid full app crash behind ErrorBoundary
      logger.error('Supabase env vars missing. Using stub client.', {
        url: EXTERNAL_SERVICES.supabase.url,
        hasAnon: !!EXTERNAL_SERVICES.supabase.anonKey
      });
      // Minimal stub with required shape for callers to not explode
      supabaseClient = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          signInWithOAuth: async () => ({ error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        }
      };
      return supabaseClient;
    }

    try {
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
    } catch (e) {
      logger.error('Failed to create Supabase client', { error: e.message });
      supabaseClient = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          signInWithOAuth: async () => ({ error: e }),
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        }
      };
    }
  }

  return supabaseClient;
};

export default getSupabaseClient;
