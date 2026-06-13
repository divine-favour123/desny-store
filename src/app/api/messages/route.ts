import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  const { error } = await supabase.from('messages').insert({ name, email, subject, message });

  if (error) {
    console.error('Error saving message:', error);
    return Response.json({ error: 'Failed to save message' }, { status: 500 });
  }

  return Response.json({ success: true });
}
