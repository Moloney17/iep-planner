'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.smartiep.co/auth/reset-password',
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
  };

  if (sent) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-500 mt-2 leading-relaxed">
          We sent a password reset link to <strong>{email}</strong>.<br />
          Click the link in that email to set a new password.
        </p>
        <p className="text-sm text-gray-400 mt-4">Didn't get it? Check your spam folder.</p>
        <Link href="/auth/login" className="mt-6 inline-block text-blue-600 font-medium hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
<div className="flex justify-center mb-6"><Logo size="md" href="/landing" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-1">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@school.edu" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
