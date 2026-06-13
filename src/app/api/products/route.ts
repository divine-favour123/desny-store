import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const size = searchParams.get('size');
  const sort = searchParams.get('sort');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

  let query = supabase.from('products').select('*').eq('in_stock', true).limit(limit);

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (size && size !== 'All') {
    query = query.contains('sizes', [size]);
  }

  if (sort === 'price-low') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-high') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  return Response.json(data);
}
