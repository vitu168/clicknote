'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, Settings, FileText, LogOut,
  Users, ChevronLeft, ChevronRight, BarChart2, Star, Archive, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
      { href: '/notes',         label: 'Notes',         icon: FileText },
      { href: '/favorites',     label: 'Favorites',     icon: Star },
      { href: '/archive',       label: 'Archive',       icon: Archive },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/analytics',     label: 'Analytics',     icon: BarChart2 },
      { href: '/users',         label: 'Members',       icon: Users },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/messenger',     label: 'Messenger',     icon: MessageSquare },
      { href: '/notifications', label: 'Notifications', icon: Bell },
    ],
  },
];

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, profile, signOut } = useSession();

  const displayName = profile?.name ?? user?.name ?? user?.email ?? 'Account';
  const email       = user?.email ?? '';

  async function handleSignOut() {
    await signOut();
    router.replace('/auth/welcome');
  }

  return (
    <aside className={cn(
      'relative flex h-full shrink-0 flex-col transition-all duration-300 ease-in-out overflow-hidden',
      'bg-white border-r border-slate-200 dark:bg-[#13111C] dark:border-white/[0.06]',
      collapsed ? 'w-14' : 'w-54',
    )}>

      {/* Brand */}
      <div className="flex h-14 items-center border-b border-slate-200 dark:border-white/[0.06] px-3">
        {collapsed ? (
          <button
            type="button" onClick={() => setCollapsed(false)} aria-label="Expand sidebar"
            className="flex w-full items-center justify-center"
          >
            <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover" />
            </div>
          </button>
        ) : (
          <>
            <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="ml-2.5 text-[13px] font-semibold text-slate-900 dark:text-white truncate flex-1">
              Note
            </span>
            <button
              type="button" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar"
              className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] dark:text-white/40 dark:hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30">
                {group.label}
              </p>
            )}
            <div className="space-y-px">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href} href={href} title={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors',
                      collapsed ? 'justify-center' : '',
                      active
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/50 dark:hover:bg-white/6 dark:hover:text-white/90',
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0',
                      active ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-white/40',
                    )} />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-2 py-2 border-t border-slate-200 dark:border-white/6">
        <Link
          href="/settings" title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors',
            collapsed ? 'justify-center' : '',
            pathname === '/settings'
              ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/50 dark:hover:bg-white/[0.06] dark:hover:text-white/90',
          )}
        >
          <Settings className={cn('h-4 w-4 shrink-0',
            pathname === '/settings' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-white/40',
          )} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* User footer */}
      <div className="px-2 pb-3 pt-2 border-t border-slate-200 dark:border-white/6">
        <div className={cn(
          'flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.06]',
          collapsed ? 'justify-center' : '',
        )}>
          <div
            title={collapsed ? displayName : undefined}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white overflow-hidden"
          >
            {profile?.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />  // eslint-disable-line @next/next/no-img-element
              : initials(displayName)}
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-800 dark:text-white/80 truncate leading-none">{displayName}</p>
                <p className="text-[10px] text-slate-400 dark:text-white/30 truncate mt-0.5">{email}</p>
              </div>
              <button
                type="button" onClick={handleSignOut} aria-label="Sign out" title="Sign out"
                className="shrink-0 p-1 rounded text-slate-400 hover:text-red-500 dark:text-white/30 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {collapsed && (
        <button
          type="button" onClick={() => setCollapsed(false)} aria-label="Expand"
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e1c2e] text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 shadow-sm transition-colors"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </aside>
  );
}
