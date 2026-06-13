import { getAdminSupabase } from '../admin-helper';

export async function GET() {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, description, price, sizes, images, in_stock } = body;

  const { data, error } = await client
    .from('products')
    .insert({ name, description, price: parseFloat(price), sizes, images, in_stock })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
  return Response.json(data);
}

export async function PUT(request: Request) {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, name, description, price, sizes, images, in_stock } = body;

  const { data, error } = await client
    .from('products')
    .update({ name, description, price: parseFloat(price), sizes, images, in_stock })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: 'Failed to update product' }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(request: Request) {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing ID' }, { status: 400 });

  const { error } = await client.from('products').delete().eq('id', id);
  if (error) return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  return Response.json({ success: true });
}
