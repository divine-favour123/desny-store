import { getAdminSupabase } from '../admin-helper';

export async function GET() {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Get all users from the public users table
  const { data: users, error } = await client
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: 'Failed to fetch customers' }, { status: 500 });

  // Get order counts per user
  const { data: orderCounts } = await client
    .from('orders')
    .select('user_id');

  const countMap: Record<string, number> = {};
  orderCounts?.forEach((o) => {
    if (o.user_id) countMap[o.user_id] = (countMap[o.user_id] || 0) + 1;
  });

  const customers = users?.map((u) => ({
    ...u,
    total_orders: countMap[u.id] || 0,
  }));

  return Response.json(customers);
}
