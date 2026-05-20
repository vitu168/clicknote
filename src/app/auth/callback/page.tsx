'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { customAuth } from '@/lib/customAuth';

export default function AuthCallback() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      // Exchange the PKCE code in the URL for a real session
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      let session = null;

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error || !data.session) {
          setErrorMsg('Could not complete sign-in. Please try again.');
          return;
        }
        session = data.session;
      } else {
        // Fallback: implicit flow or already exchanged
        const { data } = await supabase.auth.getSession();
        session = data.session;
      }

      if (!session) {
        router.replace('/auth/login');
        return;
      }

      const { user } = session;
      const email = user.email ?? '';
      const name =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        email.split('@')[0] ??
        '';
      const derivedPassword = `oauth_${user.id}`;

      try {
        await customAuth.signIn(email, derivedPassword);
      } catch {
        try {
          await customAuth.signUp(email, derivedPassword, name);
        } catch (err) {
          setErrorMsg(
            err instanceof Error
              ? err.message.replace(/^Exception:\s*/, '')
              : 'Account setup failed. Please try again.',
          );
          return;
        }
      }

      // Full page load so SessionProvider re-bootstraps from localStorage
      window.location.href = '/auth/complete-profile';
    }

    handleCallback();
  }, [router]);

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
          <p className="text-sm font-medium text-rose-600 mb-4">{errorMsg}</p>
          <button
            onClick={() => router.replace('/auth/login')}
            className="text-xs font-semibold text-violet-600 hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA]">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow shadow-violet-200">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <p className="text-xs">Signing you in…</p>
      </div>
    </div>
  );
}
