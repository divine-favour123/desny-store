import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error || !data) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json(data);
}
