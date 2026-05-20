'use client';

import { useState } from 'react';
import { User, Bell, Palette, Languages, Shield } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { useAccent, ACCENT_OPTIONS } from '@/lib/accent';
import { useI18n, type Language } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const LANGUAGE_OPTIONS: { value: Language; nativeLabel: string; flag: string }[] = [
  { value: 'en', nativeLabel: 'English',    flag: '🇬🇧' },
  { value: 'km', nativeLabel: 'ភាសាខ្មែរ', flag: '🇰🇭' },
];

const TABS = [
  { id: 'account',       label: 'Account',      icon: User      },
  { id: 'notifications', label: 'Notifications', icon: Bell      },
  { id: 'appearance',    label: 'Appearance',    icon: Palette   },
  { id: 'language',      label: 'Language',      icon: Languages },
  { id: 'security',      label: 'Security',      icon: Shield    },
] as const;

type TabId = typeof TABS[number]['id'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('account');
  const { accent, setAccent } = useAccent();
  const { lang, setLang } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <div className="h-full overflow-hidden flex flex-col gap-0">

      {/* Tab bar */}
      <div className="shrink-0 flex items-end gap-1 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl px-4">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                active
                  ? 'border-accent-600 text-accent-700 dark:text-accent-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600',
              )}
            >
              <tab.icon className="h-3.5 w-3.5 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 rounded-b-2xl">
        <div className="max-w-2xl py-6 px-1 space-y-5">

          {/* ── Account ── */}
          {activeTab === 'account' && (
            <>
              <SettingCard
                title="Profile Information"
                description="Update your display name, avatar and public details."
              >
                <ProfileSettings />
              </SettingCard>
            </>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <SettingCard
              title="Notification Preferences"
              description="Choose what activity you want to be alerted about."
            >
              <NotificationSettings />
            </SettingCard>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'appearance' && (
            <>
              <SettingCard
                title="Accent Color"
                description="Pick a color that reflects your style across the workspace."
              >
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {ACCENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAccent(opt.value)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all',
                        accent === opt.value
                          ? 'border-accent-300 dark:border-accent-700 bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300 ring-1 ring-accent-300 dark:ring-accent-700'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700/50',
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: opt.hex }}
                      />
                      <span className="truncate">{opt.label}</span>
                      {accent === opt.value && (
                        <span className="ml-auto text-[10px] text-accent-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </SettingCard>

              <SettingCard
                title="Theme"
                description="Switch between light and dark mode."
              >
                <div className="flex gap-3">
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { if (theme !== t) toggleTheme(); }}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border px-6 py-4 text-sm font-medium transition-all',
                        theme === t
                          ? 'border-accent-300 dark:border-accent-700 bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300 ring-1 ring-accent-300 dark:ring-accent-700'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700/50',
                      )}
                    >
                      <span className="text-xl">{t === 'light' ? '☀️' : '🌙'}</span>
                      <span className="capitalize">{t}</span>
                      {theme === t && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[9px] text-white font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </SettingCard>
            </>
          )}

          {/* ── Language ── */}
          {activeTab === 'language' && (
            <SettingCard
              title="Display Language"
              description="Choose the language used throughout the interface."
            >
              <div className="flex gap-3">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLang(opt.value)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-medium transition-all',
                      lang === opt.value
                        ? 'border-accent-300 dark:border-accent-700 bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300 ring-1 ring-accent-300 dark:ring-accent-700'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700/50',
                    )}
                  >
                    <span className="text-xl leading-none">{opt.flag}</span>
                    <span>{opt.nativeLabel}</span>
                    {lang === opt.value && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[9px] text-white font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </SettingCard>
          )}

          {/* ── Security ── */}
          {activeTab === 'security' && (
            <>
              <SettingCard
                title="Password"
                description="Manage your account password and authentication method."
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-700 transition-colors shadow-sm"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Sessions"
                description="Manage where you're currently signed in."
              >
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro · Chrome', location: 'Current session', time: 'Active now', current: true },
                    { device: 'iPhone · Safari',       location: 'Phnom Penh, KH',  time: '2 hours ago',  current: false },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{s.device}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{s.location} · {s.time}</p>
                      </div>
                      {s.current ? (
                        <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          Current
                        </span>
                      ) : (
                        <button type="button" className="text-[11px] font-medium text-rose-500 hover:text-rose-600 transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </SettingCard>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function SettingCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
