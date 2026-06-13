import { getAdminSupabase } from '../admin-helper';

export async function GET(request: Request) {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = client.from('orders').select('*').order('created_at', { ascending: false });

  if (status && status !== 'All') {
    query = query.eq('order_status', status);
  }

  const { data, error } = await query;
  if (error) return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  return Response.json(data);
}

export async function PATCH(request: Request) {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, order_status } = body;

  const { data, error } = await client
    .from('orders')
    .update({ order_status })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: 'Failed to update order status' }, { status: 500 });
  return Response.json(data);
}
