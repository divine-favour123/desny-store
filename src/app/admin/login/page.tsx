'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Step 1: Sign in with Supabase
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      // Give clearer error messages
      if (signInError.message.includes('Invalid login')) {
        setError('Wrong email or password. Make sure you created this account in Supabase Auth first.');
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Please confirm your email first, or disable email confirmation in Supabase Auth settings.');
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError('Login failed — no session returned. Try again.');
      setLoading(false);
      return;
    }

    // Step 2: Check if user is in admins table
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('id', data.session.user.id)
      .single();

    if (!adminRow) {
      await supabase.auth.signOut();
      setError(
        `Access denied. Your account (${email}) is not in the admins table. ` +
        `Go to Supabase SQL Editor and run:\n` +
        `INSERT INTO public.admins (id, email) VALUES ('${data.session.user.id}', '${email}');`
      );
      setLoading(false);
      return;
    }

    // Step 3: Sync tokens to cookies for server-side API routes
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;

    window.location.href = '/admin/dashboard';
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">DESNY STORE</h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Admin Panel</p>
        </div>

        <form
          onSubmit={(e) => { void onSubmit(e); }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-white">Admin Sign In</h2>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/40 border border-red-800 p-3 text-sm text-red-300 whitespace-pre-wrap break-all">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-white text-black py-3 font-bold text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Restricted to authorized administrators only.
        </p>
      </div>
    </main>
  );
}
