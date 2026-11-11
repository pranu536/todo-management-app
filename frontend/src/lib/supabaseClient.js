import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Support VITE_SUPABASE_ANON_KEY (build guide) and VITE_SUPABASE_PUBLISHABLE_KEY (new Supabase dashboard)
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in frontend/.env.'
  );
}

// Single shared Supabase instance used across AuthContext and taskService
export const supabase = createClient(supabaseUrl, supabaseKey);
