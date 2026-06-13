'use client';

import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

// Drop-in replacement for better-auth's authClient
// Keeps the same API shape used across the app

export const authClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },
  },
  signUp: {
    email: async ({
      email,
      password,
      name,
      phone,
    }: {
      email: string;
      password: string;
      name?: string;
      phone?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
            phone: phone || '',
          },
        },
      });
      return { data, error };
    },
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  useSession: () => {
    const [session, setSession] = useState<Session | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        setIsPending(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setIsPending(false);
      });

      return () => listener.subscription.unsubscribe();
    }, []);

    const user = session?.user;
    const sessionData = user
      ? {
          user: {
            id: user.id,
            email: user.email ?? '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            image: user.user_metadata?.avatar_url || null,
            phone: user.user_metadata?.phone || '',
          },
        }
      : null;

    return { data: sessionData, isPending };
  },
};

export const { signIn, signUp, signOut, useSession } = {
  signIn: authClient.signIn,
  signUp: authClient.signUp,
  signOut: authClient.signOut,
  useSession: authClient.useSession,
};
