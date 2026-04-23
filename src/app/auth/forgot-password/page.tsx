'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, MailCheck } from 'lucide-react';
import { useSession } from '@/lib/session';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.replace(/^Exception:\s*/, '')
          : 'Failed to send reset email.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow shadow-indigo-200">
            {sent ? <MailCheck className="h-5 w-5 text-white" /> : <KeyRound className="h-5 w-5 text-white" />}
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            {sent ? 'Check your email' : 'Reset password'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {sent
              ? `If an account exists for ${email}, a reset link has been sent.`
              : "Enter your email and we'll send a reset link."}
          </p>
        </div>

        {sent ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
              Password reset email sent.
            </div>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Send to a different address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'mt-1 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm',
                'hover:bg-indigo-700 transition-colors',
                loading && 'opacity-60 cursor-not-allowed',
              )}
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
