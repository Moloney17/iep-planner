'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreedToTerms) { setError('Please agree to the Terms of Service and Privacy Policy to continue.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    // Notify admin of new signup
    fetch('/api/notify-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    }).catch(() => {});
    setSuccess(true);
    setTimeout(() => router.push('/auth/login'), 3000);
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-500 mt-2">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.</p>
        <Link href="/auth/login" className="mt-6 inline-block text-blue-600 font-medium hover:underline">Go to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
<div className="flex justify-center mb-6"><Logo size="md" href="/landing" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start planning IEPs with AI assistance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First Last" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@school.edu" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min. 8 characters" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" id="terms" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link href="/legal/terms" target="_blank" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/legal/privacy" target="_blank" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                {' '}I understand that all AI-generated IEP content must be reviewed by qualified professionals before use.
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="text-center mt-6 flex justify-center gap-4 text-xs text-gray-400">
          <Link href="/legal/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-gray-600">Terms of Service</Link>
          <Link href="/legal/ferpa" className="hover:text-gray-600">FERPA Notice</Link>
        </div>
      </div>
    </div>
  );
}
