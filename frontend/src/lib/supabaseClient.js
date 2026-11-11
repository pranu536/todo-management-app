import { createClient } from '@supabase/supabase-js';

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
// Support VITE_SUPABASE_ANON_KEY (build guide) and VITE_SUPABASE_PUBLISHABLE_KEY (new Supabase dashboard)
const supabaseKey = String(
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
).trim();

const looksLikePlaceholder =
  !supabaseUrl ||
  !supabaseKey ||
  supabaseUrl.includes('your-project-id') ||
  supabaseKey === 'your-anon-key';

export const isSupabaseConfigured = !looksLikePlaceholder;

if (!isSupabaseConfigured) {
  console.error(
    'Missing Supabase environment variables. Put your real Project URL and anon key in frontend/.env, then restart npm run dev.'
  );
}

// Always pass valid non-empty strings so createClient never throws before the UI can warn.
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.placeholder';

// Talk directly to Supabase (browser → supabase.co). Avoid local Vite proxy DNS failures.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : FALLBACK_URL,
  isSupabaseConfigured ? supabaseKey : FALLBACK_KEY
);
