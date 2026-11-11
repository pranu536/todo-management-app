import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  // Start loading=true so ProtectedRoute waits for getSession() instead of flashing /login on refresh
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Restore an existing session on page load / refresh from browser storage
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) {
          setSession(data?.session ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        // Ensure loading never gets stuck if storage access is restricted (e.g., iOS private mode)
        if (mounted) {
          setSession(null);
          setLoading(false);
        }
      });

    // 2. Keep React state in sync whenever the user logs in, logs out, or refreshes tokens
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    // 3. Unsubscribe when the provider unmounts to prevent duplicate listeners
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
