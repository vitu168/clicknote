'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { customAuth } from '@/lib/customAuth';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession();

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
      // Stable derived password — ties the OAuth identity to the custom backend
      const derivedPassword = `oauth_${user.id}`;

      try {
        // Returning user — sign in to get a fresh custom token
        await customAuth.signIn(email, derivedPassword);
      } catch {
        try {
          // First-time OAuth user — create a custom backend account
          await customAuth.signUp(email, derivedPassword, name);
        } catch {
          // Neither worked — send back to login
          router.replace('/auth/login');
          return;
        }
      }

      router.replace('/auth/complete-profile');
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA]">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow shadow-indigo-200">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <p className="text-xs">Signing you in…</p>
      </div>
    </div>
  );
}
