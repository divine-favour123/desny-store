import { getAdminSupabase } from '../admin-helper';

export async function GET() {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await client
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  return Response.json(data);
}

export async function PATCH(request: Request) {
  const { client, isAdmin } = await getAdminSupabase();
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, is_read } = await request.json();

  const { data, error } = await client
    .from('messages')
    .update({ is_read })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: 'Failed to update message' }, { status: 500 });
  return Response.json(data);
}
