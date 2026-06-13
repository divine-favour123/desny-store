import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

// Server-side Supabase client that reads session from Authorization header or cookies
export async function createServerClient() {
  // Try Authorization header first (set by client fetch calls)
  const headerStore = await headers();
  const authHeader = headerStore.get('Authorization');
  
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  if (authHeader?.startsWith('Bearer ')) {
    const accessToken = authHeader.slice(7);
    // We need a refresh token too — try cookies as fallback
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('sb-refresh-token')?.value || '';
    
    if (refreshToken) {
      await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    } else {
      // Set just the access token via a workaround
      await client.auth.setSession({ access_token: accessToken, refresh_token: accessToken });
    }
  } else {
    // Fallback: try cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    if (accessToken && refreshToken) {
      await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    }
  }

  return client;
}

export async function getServerSession() {
  const client = await createServerClient();
  const { data: { session } } = await client.auth.getSession();
  return session;
}
