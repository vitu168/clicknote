'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  FileText,
  LogOut,
  Users,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    activeClass: 'bg-indigo-50 text-indigo-700',
    iconClass: 'bg-indigo-100 text-indigo-600',
    dot: 'bg-indigo-500',
  },
  {
    href: '/notes',
    label: 'Notes',
    icon: FileText,
    activeClass: 'bg-emerald-50 text-emerald-700',
    iconClass: 'bg-emerald-100 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  {
    href: '/users',
    label: 'Users',
    icon: Users,
    activeClass: 'bg-fuchsia-50 text-fuchsia-700',
    iconClass: 'bg-fuchsia-100 text-fuchsia-600',
    dot: 'bg-fuchsia-500',
  },
  {
    href: '/messenger',
    label: 'Messenger',
    icon: MessageSquare,
    activeClass: 'bg-sky-50 text-sky-700',
    iconClass: 'bg-sky-100 text-sky-600',
    dot: 'bg-sky-500',
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    activeClass: 'bg-slate-100 text-slate-800',
    iconClass: 'bg-slate-200 text-slate-600',
    dot: 'bg-slate-400',
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
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useSession();

  const displayName = profile?.name ?? user?.name ?? user?.email ?? 'Account';
  const email = user?.email ?? '';

  async function handleSignOut() {
    await signOut();
    router.replace('/auth/welcome');
  }

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 flex-col bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-700/60 transition-all duration-300 ease-in-out overflow-hidden',
        collapsed ? 'w-17' : 'w-56',
      )}
    >
      {/* Brand header — collapsed = click-to-expand, expanded = logo+title+collapse btn */}
      <div className="border-b border-slate-100 dark:border-slate-700/60">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="flex w-full flex-col items-center gap-1.5 py-3.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 transition-colors group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow shadow-indigo-200/60">
              <StickyNote className="h-4 w-4 text-white" />
            </div>
            <ChevronRight className="h-3 w-3" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow shadow-indigo-200/60">
              <StickyNote className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none truncate">
                Yby Notes
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                Personal Workspace
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {/* Section label — hidden when collapsed */}
        <p
          className={cn(
            'px-2 mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-all duration-200 overflow-hidden whitespace-nowrap',
            collapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100 h-4',
          )}
        >
          Menu
        </p>

        {navItems.map(({ href, label, icon: Icon, activeClass, iconClass, dot }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-xl px-2 py-2 text-sm font-medium transition-all duration-150',
                collapsed ? 'justify-center gap-0' : 'gap-2.5',
                active
                  ? activeClass
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                  active ? iconClass : 'bg-slate-100 dark:bg-slate-800 text-slate-400',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300',
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
                )}
              >
                {label}
              </span>

              {!collapsed && active && (
                <span className={cn('ml-auto h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-2.5 pb-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
        <div
          className={cn(
            'group flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800',
            collapsed ? 'justify-center' : '',
          )}
        >
          <div
            title={collapsed ? displayName : undefined}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white overflow-hidden"
          >
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(displayName)
            )}
          </div>

          <div
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 overflow-hidden transition-all duration-300',
              collapsed ? 'w-0 opacity-0' : 'opacity-100',
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="shrink-0 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
