'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/auth/complete-profile');
      } else {
        router.replace('/auth/login');
      }
    });
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
