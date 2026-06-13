'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      window.location.href = '/';
    };
    void logout();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Signing out…</p>
    </main>
  );
}
