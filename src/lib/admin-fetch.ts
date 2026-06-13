'use client';

import { supabase } from './supabase';

/**
 * Fetch wrapper that automatically attaches the current user's
 * Supabase access token as a Bearer header.
 * Use this for all /api/admin/* calls from client components.
 */
export async function adminFetch(input: string, init?: RequestInit): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(input, { ...init, headers });
}
