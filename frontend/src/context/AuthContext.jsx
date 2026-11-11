import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  // Start loading=true so ProtectedRoute waits for getSession() instead of flashing /login on refresh
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Skip network session restore when env keys are missing so the UI never hangs on a spinner
    if (!isSupabaseConfigured) {
      setSession(null);
      setLoading(false);
      return undefined;
    }

    const finish = (nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setLoading(false);
    };

    // Safety timeout so a stalled storage/network call never blocks the app forever
    const timeoutId = window.setTimeout(() => finish(null), 8000);

    // 1. Restore an existing session on page load / refresh from browser storage
    supabase.auth
      .getSession()
      .then(({ data }) => {
        window.clearTimeout(timeoutId);
        finish(data?.session ?? null);
      })
      .catch(() => {
        window.clearTimeout(timeoutId);
        finish(null);
      });

    // 2. Keep React state in sync whenever the user logs in, logs out, or refreshes tokens
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) setSession(newSession);
    });

    // 3. Unsubscribe when the provider unmounts to prevent duplicate listeners
    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut: () => supabase.auth.signOut(),
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
