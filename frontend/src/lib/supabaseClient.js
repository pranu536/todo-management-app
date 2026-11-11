import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Support VITE_SUPABASE_ANON_KEY (build guide) and VITE_SUPABASE_PUBLISHABLE_KEY (new Supabase dashboard)
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.error(
    'Missing Supabase environment variables. Create frontend/.env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see backend/.env.example).'
  );
}

// Single shared Supabase instance used across AuthContext and taskService.
// Placeholder strings keep createClient from throwing when .env is not set yet.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'public-anon-key'
);
