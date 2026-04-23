'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import { FileText } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? '/dashboard' : '/auth/welcome');
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA]">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow shadow-indigo-200">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <p className="text-xs">Loading…</p>
      </div>
    </div>
  );
}
