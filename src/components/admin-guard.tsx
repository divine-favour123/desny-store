'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authorized' | 'denied'>('checking');

  useEffect(() => {
    const check = async () => {
      try {
        // Try localStorage session first (Supabase default)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setStatus('denied');
          router.replace('/admin/login');
          return;
        }

        // Check admins table
        const { data: adminRow, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (adminError || !adminRow) {
          setStatus('denied');
          router.replace('/admin/login');
          return;
        }

        setStatus('authorized');
      } catch (err) {
        console.error('AdminGuard error:', err);
        setStatus('denied');
        router.replace('/admin/login');
      }
    };

    void check();
  }, [router]);

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white text-sm">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') return null;

  return <>{children}</>;
}
