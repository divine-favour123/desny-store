import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

async function getSupabaseWithSession() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const authHeader = headerStore.get('Authorization');

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
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
  return { client, session };
}

export async function POST(request: Request) {
  const { client, session } = await getSupabaseWithSession();
  const body = await request.json();

  const {
    items, subtotal, delivery_fee, total, delivery_location,
    full_name, phone, email, address, city_state, landmark, paystack_reference,
  } = body;

  const { data, error } = await client.from('orders').insert({
    user_id: session?.user?.id || null,
    items,
    subtotal,
    delivery_fee,
    total,
    delivery_location,
    full_name,
    phone,
    email,
    address,
    city_state,
    landmark,
    payment_status: paystack_reference ? 'paid' : 'pending',
    order_status: 'Pending',
    paystack_reference: paystack_reference || null,
  }).select('id').single();

  if (error) {
    console.error('Error creating order:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }

  return Response.json({ id: data.id });
}

export async function GET() {
  const { client, session } = await getSupabaseWithSession();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }

  return Response.json(data);
}
