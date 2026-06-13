import { getAdminSupabase } from '../admin-helper';

export async function GET() {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [
    { count: total_products },
    { count: total_orders },
    { count: pending_orders },
    { data: revenueData },
    { data: recent_orders },
  ] = await Promise.all([
    client.from('products').select('*', { count: 'exact', head: true }),
    client.from('orders').select('*', { count: 'exact', head: true }),
    client.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'Pending'),
    client.from('orders').select('total').eq('payment_status', 'paid'),
    client.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  const total_revenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

  return Response.json({
    total_products: total_products || 0,
    total_orders: total_orders || 0,
    pending_orders: pending_orders || 0,
    total_revenue,
    recent_orders: recent_orders || [],
  });
}
