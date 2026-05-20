'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Sun, Moon, Settings, User, Palette } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';
import { useSession } from '@/lib/session';
import { useTheme } from '@/lib/theme';
import { useAccent, ACCENT_OPTIONS } from '@/lib/accent';
import { useI18n } from '@/lib/i18n';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

type GreetKey = 'greeting.morning' | 'greeting.afternoon' | 'greeting.evening';

function greetingKey(now: Date): GreetKey {
  const h = now.getHours();
  if (h < 12) return 'greeting.morning';
  if (h < 18) return 'greeting.afternoon';
  return 'greeting.evening';
}

const KM_DIGITS = '០១២៣៤៥៦៧៨៩';
const KM_DAYS   = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const KM_MONTHS = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];

function toKhmerNum(n: number, pad = 0): string {
  return String(n).padStart(pad, '0').replace(/[0-9]/g, d => KM_DIGITS[+d]);
}

function formatDate(d: Date, lang: string): string {
  if (lang === 'km') {
    return `${KM_DAYS[d.getDay()]}, ${toKhmerNum(d.getDate())} ${KM_MONTHS[d.getMonth()]} ${toKhmerNum(d.getFullYear())}`;
  }
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(d: Date, lang: string): string {
  if (lang === 'km') {
    const h = d.getHours();
    const ampm = h < 12 ? 'ព្រឹក' : 'ល្ងាច';
    const h12 = h % 12 || 12;
    return `${toKhmerNum(h12, 2)}:${toKhmerNum(d.getMinutes(), 2)} ${ampm}`;
  }
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default function Header() {
  const router = useRouter();
  const { user, profile, signOut } = useSession();
  const { theme, toggle } = useTheme();
  const { accent, setAccent } = useAccent();
  const { t, lang } = useI18n();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const menuRef    = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const now = useNow();

  const displayName = profile?.name ?? user?.name ?? user?.email ?? 'there';
  const firstName   = displayName.split(' ')[0];
  const greetText   = `${t(greetingKey(now))}, ${firstName}! 👋`;
  const dateText = formatDate(now, lang);
  const timeText = formatTime(now, lang);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (menuRef.current    && !menuRef.current.contains(e.target as Node))    setMenuOpen(false);
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) setPaletteOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.replace('/auth/welcome');
  }

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/85 px-6 backdrop-blur dark:border-white/6 dark:bg-slate-900/90">

      {/* Greeting + datetime */}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold leading-none text-slate-900 dark:text-slate-100">
          {greetText}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
          {dateText} · {timeText}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5">
        {/* Search */}
        <div className="hidden sm:block mr-1 w-40">
          <SearchInput value="" onChange={() => {}} placeholder={t('action.search')} />
        </div>

        {/* Color picker */}
        <div className="relative" ref={paletteRef}>
          <button
            type="button"
            onClick={() => setPaletteOpen((v) => !v)}
            title={t('action.change_color')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-accent-200 hover:bg-accent-50 hover:text-accent-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
          >
            <Palette className="h-3.5 w-3.5" />
          </button>

          {paletteOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/6 dark:bg-slate-800 dark:ring-white/10 animate-pop-in">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {t('settings.accent_color')}
                </p>
              </div>
              <div className="p-2 grid grid-cols-3 gap-1">
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setAccent(opt.value); setPaletteOpen(false); }}
                    title={opt.label}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                      accent === opt.value
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/60',
                    )}
                  >
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: opt.hex }} />
                    {opt.label}
                    {accent === opt.value && <span className="ml-auto text-[10px] text-slate-400">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light toggle */}
        <button
          type="button"
          onClick={toggle}
          title={theme === 'dark' ? t('action.light_mode') : t('action.dark_mode')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-accent-200 hover:bg-accent-50 hover:text-accent-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          title={t('nav.notifications')}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-accent-200 hover:bg-accent-50 hover:text-accent-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500 ring-1 ring-white dark:ring-slate-900" />
        </Link>

        {/* Avatar */}
        <div className="relative ml-0.5" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            title={displayName}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-accent-500 to-accent-600 text-[11px] font-semibold text-white ring-2 ring-white transition hover:ring-accent-300 dark:ring-slate-900"
          >
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              initials(displayName)
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/6 dark:bg-slate-800 dark:ring-white/10 animate-pop-in">
              <div className="flex items-center gap-3 bg-linear-to-br from-slate-50 to-accent-50/60 px-4 py-3.5 dark:from-slate-800 dark:to-accent-950/30">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-accent-500 to-accent-600 text-xs font-bold text-white">
                  {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    initials(displayName)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">{displayName}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>

              <div className="p-1">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {t('action.your_profile')}
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  {t('action.settings')}
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 p-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t('action.sign_out')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
