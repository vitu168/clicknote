'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, LogOut, Sun, Moon, Settings, User } from 'lucide-react';
import { useSession } from '@/lib/session';
import { useTheme } from '@/lib/theme';
import { useEffect, useRef, useState } from 'react';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Overview of your workspace' },
  '/notes': { title: 'Notes', description: 'Capture ideas and tasks' },
  '/favorites': { title: 'Favorites', description: 'Your starred notes' },
  '/archive': { title: 'Archive', description: 'Notes you have archived' },
  '/users': { title: 'Users', description: 'People on the platform' },
  '/messenger': { title: 'Messenger', description: 'Stay connected' },
  '/notifications': { title: 'Notifications', description: 'Recent activity' },
  '/profile': { title: 'Profile', description: 'Your public profile' },
  '/settings': { title: 'Settings', description: 'Manage your preferences' },
};

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useSession();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const page =
    pageTitles[pathname] ??
    pageTitles[`/${pathname.split('/')[1] ?? ''}`] ??
    { title: '', description: '' };

  const displayName = profile?.name ?? user?.name ?? user?.email ?? 'Account';

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function handleSignOut() {
    await signOut();
    router.replace('/auth/welcome');
  }

  return (
    <header className="relative z-30 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/85 px-6 py-3 backdrop-blur shrink-0 dark:border-slate-700/60 dark:bg-slate-900/90">
      {/* Page title */}
      <div>
        <h1 className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">
          {page.title}
        </h1>
        <p className="mt-0.5 text-[11px] tracking-[0.02em] text-slate-500 dark:text-slate-400">
          {page.description}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="h-8 w-44 rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Dark / Light toggle */}
        <button
          type="button"
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          title="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-1 ring-white dark:ring-slate-900" />
        </Link>

        {/* Avatar — circle only, no name/email visible */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            title={displayName}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-[11px] font-semibold text-white shadow-sm shadow-indigo-200 ring-2 ring-white transition hover:ring-indigo-300 dark:ring-slate-900"
          >
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              initials(displayName)
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/6 dark:bg-slate-800 dark:ring-white/10">
              {/* User card — GitHub/Dribbble style */}
              <div className="flex items-center gap-3 bg-linear-to-br from-slate-50 to-indigo-50/60 px-4 py-4 dark:from-slate-800 dark:to-indigo-950/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/50">
                  {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    initials(displayName)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-none text-slate-900 dark:text-slate-100">{displayName}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>

              {/* Nav links */}
              <div className="p-1.5">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Your profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 p-1.5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
