'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useSession } from '@/lib/session';
import { FileText } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/welcome');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow shadow-indigo-200">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5FA]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          <div
            key={pathname}
            className="animate-page-in"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
