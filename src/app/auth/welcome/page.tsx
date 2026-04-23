'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useSession } from '@/lib/session';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5FA]">
      <header className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow shadow-indigo-200">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <p className="text-sm font-bold text-slate-900">Yby Notes</p>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-12">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-100">
              <Sparkles className="h-3 w-3" /> Now on the web
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Capture ideas, organize notes, and chat with your team.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              The same notes app you love on mobile, now in your browser.
              Create notes, mark favorites, archive what you&apos;re done with,
              and keep the conversation flowing.
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={FileText} title="Smart notes" body="Create, search, and favorite." tint="bg-emerald-50 text-emerald-600" />
            <FeatureCard icon={MessageSquare} title="Messaging" body="Chat with your team in real time." tint="bg-sky-50 text-sky-600" />
            <FeatureCard icon={Sparkles} title="Favorites" body="Pin the notes that matter most." tint="bg-amber-50 text-amber-600" />
            <FeatureCard icon={FileText} title="Archive" body="Keep your workspace tidy." tint="bg-violet-50 text-violet-600" />
          </div>
        </div>
      </main>

      <footer className="px-6 pb-6 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} Yby Notes
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
      <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{body}</p>
    </div>
  );
}
