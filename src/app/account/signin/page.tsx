'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.session) {
      setError(signInError?.message ?? 'Sign in failed. Please check your email and password.');
      setLoading(false);
      return;
    }

    // Manually sync session to cookies for server-side routes
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;

    window.location.href = callbackUrl;
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-[16px]">
      <form
        onSubmit={(e) => { void onSubmit(e); }}
        className="flex w-full max-w-[400px] flex-col gap-[16px] rounded-[12px] bg-white p-[24px] shadow"
      >
        <h1 className="text-[24px] font-semibold">Sign in</h1>

        <label className="flex flex-col gap-[4px] text-[14px]">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[8px] border border-gray-300 p-[10px] text-[16px] outline-none focus:border-blue-500"
          />
        </label>

        <label className="flex flex-col gap-[4px] text-[14px]">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[8px] border border-gray-300 p-[10px] text-[16px] outline-none focus:border-blue-500"
          />
        </label>

        {error && (
          <div className="rounded-[8px] bg-red-50 p-[10px] text-[14px] text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-[8px] bg-black 600 p-[12px] text-[16px] font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <a
          href={`/account/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-center text-[14px] text-blue-600 hover:underline"
        >
          No account? Sign up
        </a>
      </form>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
