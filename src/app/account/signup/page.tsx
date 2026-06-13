'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split('@')[0],
          phone: phone || '',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Save to public users table regardless of email confirmation
    if (data.user?.id) {
      await supabase.from('users').upsert({
        id: data.user.id,
        full_name: name || email.split('@')[0],
        email,
        phone,
      });
    }

    // If session exists (email confirmation OFF) → log them in directly
    if (data.session) {
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      window.location.href = callbackUrl;
    } else {
      // Email confirmation ON → show success message, redirect to signin
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-[400px] bg-white rounded-[12px] p-[24px] shadow text-center space-y-4">
          <div className="text-4xl">📧</div>
          <h2 className="text-xl font-bold">Check your email!</h2>
          <p className="text-gray-600 text-sm">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <a
            href={`/account/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="block w-full rounded-[8px] bg-blue-600 p-[12px] text-[16px] font-medium text-white text-center"
          >
            Go to Sign In
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-[16px]">
      <form
        onSubmit={(e) => { void onSubmit(e); }}
        className="flex w-full max-w-[400px] flex-col gap-[16px] rounded-[12px] bg-white p-[24px] shadow"
      >
        <h1 className="text-[24px] font-semibold">Create account</h1>

        <label className="flex flex-col gap-[4px] text-[14px]">
          Full Name
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="rounded-[8px] border border-gray-300 p-[10px] text-[16px] outline-none focus:border-blue-500" />
        </label>

        <label className="flex flex-col gap-[4px] text-[14px]">
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="rounded-[8px] border border-gray-300 p-[10px] text-[16px] outline-none focus:border-blue-500" />
        </label>

        <label className="flex flex-col gap-[4px] text-[14px]">
          Phone Number
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="rounded-[8px] border border-gray-300 p-[10px] text-[16px] outline-none focus:border-blue-500" />
        </label>

        <label className="flex flex-col gap-[4px] text-[14px]">
          Password
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="rounded-[8px] border border-gray-300 p-[10px] text-[16px] outline-none focus:border-blue-500" />
        </label>

        {error && (
          <div className="rounded-[8px] bg-red-50 p-[10px] text-[14px] text-red-600">{error}</div>
        )}

        <button type="submit" disabled={loading}
          className="rounded-[8px] bg-black p-[12px] text-[16px] font-medium text-white disabled:opacity-50">
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>

        <a href={`/account/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-center text-[14px] text-blue-600 hover:underline">
          Already have an account? Sign in
        </a>
      </form>
    </main>
  );
}

export default function SignUpPage() {
  return <Suspense><SignUpForm /></Suspense>;
}
