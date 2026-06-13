'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Listens to Supabase auth state and syncs access/refresh tokens
 * to cookies so that Next.js server-side route handlers can read the session.
 */
export function SupabaseAuthListener() {
  useEffect(() => {
    const setTokenCookies = (accessToken: string | undefined, refreshToken: string | undefined) => {
      if (accessToken && refreshToken) {
        const maxAge = 60 * 60 * 24 * 7; // 7 days
        document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
      } else {
        // Clear cookies on sign out
        document.cookie = 'sb-access-token=; path=/; max-age=0';
        document.cookie = 'sb-refresh-token=; path=/; max-age=0';
      }
    };

    // Sync current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setTokenCookies(session?.access_token, session?.refresh_token);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTokenCookies(session?.access_token, session?.refresh_token);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
