'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { customAuth } from '@/lib/customAuth';

export default function SsoCallbackPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handle() {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setErrorMsg('Missing auth tokens. Please try signing in again.');
        return;
      }

      try {
        await customAuth.signInWithSupabaseTokens(accessToken, refreshToken);
        window.location.href = '/dashboard';
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message.replace(/^Exception:\s*/, '')
            : 'Sign-in failed. Please try again.',
        );
      }
    }

    handle();
  }, []);

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
          <p className="text-sm font-medium text-rose-600 mb-4">{errorMsg}</p>
          <a
            href="/auth/login"
            className="text-xs font-semibold text-accent-600 hover:underline"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA]">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 shadow shadow-accent-200">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <p className="text-xs">Completing sign-in…</p>
      </div>
    </div>
  );
}
