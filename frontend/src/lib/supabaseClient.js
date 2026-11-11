import { createClient } from '@supabase/supabase-js';

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
// Support classic anon JWT and newer publishable keys from the Supabase dashboard
const supabaseKey = String(
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
).trim();

const looksLikePlaceholder =
  !supabaseUrl ||
  !supabaseKey ||
  supabaseUrl.includes('your-project-id') ||
  supabaseKey === 'your-anon-key' ||
  supabaseUrl.includes('placeholder.supabase.co');

export const isSupabaseConfigured = !looksLikePlaceholder;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in frontend/.env.'
  );
}

// Safe placeholders keep createClient from throwing when env is missing during local setup.
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.placeholder';

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : FALLBACK_URL,
  isSupabaseConfigured ? supabaseKey : FALLBACK_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);
