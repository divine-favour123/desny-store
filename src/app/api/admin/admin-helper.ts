import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

export async function getAdminSupabase() {
  const headerStore = await headers();
  const authHeader = headerStore.get('Authorization');
  const cookieStore = await cookies();

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

  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.slice(7);
    refreshToken = cookieStore.get('sb-refresh-token')?.value || accessToken;
  } else {
    accessToken = cookieStore.get('sb-access-token')?.value;
    refreshToken = cookieStore.get('sb-refresh-token')?.value;
  }

  if (accessToken && refreshToken) {
    await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }

  const { data: { session } } = await client.auth.getSession();

  if (!session) return { client, session: null, isAdmin: false };

  const { data: adminRow } = await client
    .from('admins')
    .select('id')
    .eq('id', session.user.id)
    .single();

  return { client, session, isAdmin: !!adminRow };
}
