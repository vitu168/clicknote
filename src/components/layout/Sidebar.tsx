'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, Settings, FileText, LogOut,
  Users, BarChart2, Star, Archive, Bell, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const navGroupDefs = [
  {
    labelKey: 'group.workspace' as const,
    items: [
      { href: '/dashboard',     labelKey: 'nav.dashboard'     as const, icon: LayoutDashboard },
      { href: '/notes',         labelKey: 'nav.notes'         as const, icon: FileText },
      { href: '/favorites',     labelKey: 'nav.favorites'     as const, icon: Star },
      { href: '/archive',       labelKey: 'nav.archive'       as const, icon: Archive },
    ],
  },
  {
    labelKey: 'group.insights' as const,
    items: [
      { href: '/analytics',     labelKey: 'nav.analytics'     as const, icon: BarChart2 },
      { href: '/users',         labelKey: 'nav.members'       as const, icon: Users },
    ],
  },
  {
    labelKey: 'group.communication' as const,
    items: [
      { href: '/messenger',     labelKey: 'nav.messenger'     as const, icon: MessageSquare },
      { href: '/notifications', labelKey: 'nav.notifications' as const, icon: Bell },
    ],
  },
];

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

/* Single nav item — shared between expanded & collapsed */
function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center rounded-lg transition-colors duration-150',
        collapsed ? 'mx-auto h-8 w-8 justify-center' : 'h-8 gap-2.5 px-2',
        active
          ? 'bg-accent-50 dark:bg-accent-500/15'
          : 'hover:bg-slate-100 dark:hover:bg-white/6',
      )}
    >
      {/* Active left-bar — expanded only */}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.75 rounded-r-full bg-accent-500" />
      )}

      <Icon
        className={cn(
          'h-3.75 w-3.75 shrink-0 transition-colors',
          active
            ? 'text-accent-600 dark:text-accent-400'
            : 'text-slate-400 dark:text-white/35 group-hover:text-slate-600 dark:group-hover:text-white/70',
        )}
      />

      {/* Label — expanded only */}
      {!collapsed && (
        <span
          className={cn(
            'flex-1 truncate text-[13px] font-medium transition-colors',
            active
              ? 'text-accent-700 dark:text-accent-300'
              : 'text-slate-600 dark:text-white/55 group-hover:text-slate-900 dark:group-hover:text-white/90',
          )}
        >
          {label}
        </span>
      )}

      {/* Active dot — collapsed only */}
      {active && collapsed && (
        <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-accent-500 ring-2 ring-white dark:ring-[#13111C]" />
      )}
    </Link>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed]     = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, profile, signOut } = useSession();
  const { t } = useI18n();

  const displayName = profile?.name ?? user?.name ?? user?.email ?? 'Account';
  const email       = user?.email ?? '';

  async function handleSignOut() {
    await signOut();
    router.replace('/auth/welcome');
  }

  return (
    <>
      <aside
        className={cn(
          'relative flex h-full shrink-0 flex-col',
          'bg-white dark:bg-[#13111C]',
          'border-r border-slate-200 dark:border-white/6',
          'transition-[width] duration-300 ease-in-out overflow-hidden',
          collapsed ? 'w-15' : 'w-55',
        )}
      >

        {/* ── Brand ── */}
        <div className={cn(
          'flex h-14 shrink-0 items-center border-b border-slate-200 dark:border-white/6',
          collapsed ? 'justify-center px-0' : 'px-3 gap-2.5',
        )}>
          {/* Logo — click to expand when collapsed */}
          <button
            type="button"
            onClick={collapsed ? () => setCollapsed(false) : undefined}
            aria-label={collapsed ? 'Expand sidebar' : undefined}
            tabIndex={collapsed ? 0 : -1}
            className="h-6 w-6 shrink-0 rounded-md overflow-hidden focus:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover" />
          </button>

          {/* App name + collapse button — visible when expanded */}
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                Note
              </span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:text-slate-600 dark:hover:text-white/70 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </>
          )}

        </div>

        {/* ── Nav ── */}
        <nav className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden py-2',
          collapsed ? 'flex flex-col items-center gap-0.5 px-1.5' : 'px-2 space-y-3',
        )}>

          {/* Expand button — top of nav, only when collapsed */}
          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="mb-1 flex h-5 w-5 items-center justify-center rounded-md text-slate-300 dark:text-white/20 hover:text-accent-500 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-500/15 transition-colors"
            >
              <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                <path d="M1 1l3 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {navGroupDefs.map((group, gi) => (
            <div
              key={group.labelKey}
              className={cn(collapsed ? 'contents' : '')}
            >
              {/* Separator between groups — collapsed: thin line; expanded: section label */}
              {gi > 0 && (
                collapsed
                  ? <div className="my-1 h-px w-8 self-center bg-slate-200 dark:bg-white/10 rounded-full" />
                  : null
              )}

              {!collapsed && (
                <p className="mb-0.5 mt-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/25 select-none">
                  {t(group.labelKey)}
                </p>
              )}

              {/* Items */}
              <div className={cn(
                collapsed ? 'contents' : 'space-y-px',
              )}>
                {group.items.map(({ href, labelKey, icon }) => (
                  <NavItem
                    key={href}
                    href={href}
                    label={t(labelKey)}
                    icon={icon}
                    active={pathname === href || pathname.startsWith(`${href}/`)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Settings ── */}
        <div className={cn(
          'shrink-0 border-t border-slate-200 dark:border-white/6',
          collapsed ? 'flex justify-center py-2 px-1.5' : 'px-2 py-2',
        )}>
          <NavItem
            href="/settings"
            label={t('nav.settings')}
            icon={Settings}
            active={pathname === '/settings'}
            collapsed={collapsed}
          />
        </div>

        {/* ── User footer ── */}
        <div className={cn(
          'shrink-0 border-t border-slate-200 dark:border-white/6',
          collapsed ? 'flex flex-col items-center gap-1.5 py-3 px-1.5' : 'p-2',
        )}>
          {collapsed ? (
            <>
              <div
                title={displayName}
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-600 text-[11px] font-semibold text-white"
              >
                {profile?.avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                  : initials(displayName)}
              </div>
              <button
                type="button"
                title="Sign out"
                onClick={() => setSignOutOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 dark:text-white/25 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-600 text-[11px] font-semibold text-white">
                {profile?.avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                  : initials(displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold leading-none text-slate-800 dark:text-white/85">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-[10px] leading-none text-slate-400 dark:text-white/30">
                  {email}
                </p>
              </div>
              <button
                type="button"
                title="Sign out"
                onClick={() => setSignOutOpen(true)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 dark:text-white/25 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Sign-out confirm */}
      <ConfirmDialog
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleSignOut}
        title="Sign out"
        description="You'll need to sign in again to access your workspace."
        confirmLabel="Sign out"
        variant="danger"
      />
    </>
  );
}
