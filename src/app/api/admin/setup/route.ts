import { getAdminSupabase } from '../admin-helper';

export async function GET() {
  const cookieStore = (await import('next/headers')).cookies;
  const { createClient } = await import('@supabase/supabase-js');
  const store = await cookieStore();
  const accessToken = store.get('sb-access-token')?.value;
  const refreshToken = store.get('sb-refresh-token')?.value;

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (accessToken && refreshToken) {
    await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }

  const { data: { session } } = await client.auth.getSession();
  if (!session) return Response.json({ error: 'Please sign in first' }, { status: 401 });

  // Check if any admin exists
  const { data: existingAdmins } = await client.from('admins').select('id').limit(1);

  if (existingAdmins && existingAdmins.length > 0) {
    return Response.json(
      { error: 'Admin already exists. Only existing admins can create more admins via the database.' },
      { status: 403 }
    );
  }

  // Make current user admin
  const { error } = await client.from('admins').insert({
    id: session.user.id,
    email: session.user.email,
  });

  if (error) return Response.json({ error: 'Failed to setup admin' }, { status: 500 });
  return Response.json({ success: true, message: 'You are now an admin!' });
}
