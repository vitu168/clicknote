'use client';

import { useState } from 'react';
import { User, Bell, Palette, Languages, Shield, Sun, Moon, Check } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { useAccent, ACCENT_OPTIONS } from '@/lib/accent';
import { useI18n, type Language } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const LANGUAGE_OPTIONS: { value: Language; nativeLabel: string; englishLabel: string; flag: string }[] = [
  { value: 'en', nativeLabel: 'English',    englishLabel: 'English', flag: '🇬🇧' },
  { value: 'km', nativeLabel: 'ភាសាខ្មែរ', englishLabel: 'Khmer',  flag: '🇰🇭' },
];

type TabId = 'account' | 'notifications' | 'appearance' | 'language' | 'security';

/* shared input style */
const inp = 'w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-accent-400 dark:focus:border-accent-500 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/40 transition-all';

export default function SettingsPage() {
  const [active, setActive] = useState<TabId>('account');
  const { accent, setAccent } = useAccent();
  const { lang, setLang, t } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();

  const nav = [
    { id: 'account'       as TabId, label: t('settings.my_account'),    icon: User,      group: t('settings.personal_group')  },
    { id: 'notifications' as TabId, label: t('settings.notifications'),  icon: Bell,      group: t('settings.personal_group')  },
    { id: 'appearance'    as TabId, label: t('settings.appearance'),     icon: Palette,   group: t('settings.workspace_group') },
    { id: 'language'      as TabId, label: t('settings.language'),       icon: Languages, group: t('settings.workspace_group') },
    { id: 'security'      as TabId, label: t('settings.security'),       icon: Shield,    group: t('settings.personal_group')  },
  ];

  const groups = [t('settings.personal_group'), t('settings.workspace_group')];

  return (
    <div className="h-full overflow-hidden flex gap-0 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">

      {/* ── Left sidebar nav ── */}
      <aside className="w-52 shrink-0 flex flex-col border-r border-slate-100 dark:border-slate-700/80 overflow-y-auto py-4">
        {groups.map((group) => (
          <div key={group} className="mb-4 px-3">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {group}
            </p>
            <div className="space-y-0.5">
              {nav.filter((n) => n.group === group).map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100',
                      isActive
                        ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100',
                    )}
                  >
                    <item.icon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-accent-500' : 'text-slate-400 dark:text-slate-500')} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </aside>

      {/* ── Right content ── */}
      <div className="flex-1 min-w-0 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/40">
        <div className="max-w-xl px-8 py-7 space-y-6">

          {/* Page heading */}
          <div className="pb-1">
            {(() => {
              const item = nav.find((n) => n.id === active)!;
              return (
                <>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.label}</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {active === 'account'       && t('settings.account_desc')}
                    {active === 'notifications' && t('settings.notif_desc')}
                    {active === 'appearance'    && t('settings.appearance_desc2')}
                    {active === 'language'      && t('settings.language_desc2')}
                    {active === 'security'      && t('settings.security_desc')}
                  </p>
                </>
              );
            })()}
          </div>

          {/* ── Account ── */}
          {active === 'account' && (
            <Section>
              <ProfileSettings />
            </Section>
          )}

          {/* ── Notifications ── */}
          {active === 'notifications' && (
            <Section>
              <NotificationSettings />
            </Section>
          )}

          {/* ── Appearance ── */}
          {active === 'appearance' && (
            <>
              {/* Theme */}
              <Section label={t('settings.theme_label')} hint={t('settings.theme_hint')}>
                <div className="flex gap-3">
                  {([
                    { value: 'light', label: t('settings.light'), icon: Sun  },
                    { value: 'dark',  label: t('settings.dark'),  icon: Moon },
                  ] as const).map((opt) => {
                    const on = theme === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { if (!on) toggleTheme(); }}
                        className={cn(
                          'relative flex flex-1 flex-col items-center gap-3 rounded-xl border-2 py-5 transition-all duration-150',
                          on
                            ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600',
                        )}
                      >
                        {/* mini mockup */}
                        <div className={cn('h-10 w-20 rounded-md border overflow-hidden', opt.value === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700')}>
                          <div className={cn('h-2 w-full', opt.value === 'light' ? 'bg-slate-100' : 'bg-slate-800')} />
                          <div className="flex gap-1 p-1.5">
                            <div className={cn('h-4 w-5 rounded-sm', opt.value === 'light' ? 'bg-slate-200' : 'bg-slate-700')} />
                            <div className={cn('flex-1 h-1.5 mt-0.5 rounded-sm', opt.value === 'light' ? 'bg-slate-100' : 'bg-slate-800')} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <opt.icon className={cn('h-3.5 w-3.5', on ? 'text-accent-600 dark:text-accent-400' : 'text-slate-400')} />
                          <span className={cn('text-xs font-semibold', on ? 'text-accent-700 dark:text-accent-300' : 'text-slate-600 dark:text-slate-400')}>
                            {opt.label}
                          </span>
                        </div>
                        {on && (
                          <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Accent color */}
              <Section label={t('settings.accent_color')} hint={t('settings.accent_hint')}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ACCENT_OPTIONS.map((opt) => {
                    const on = accent === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAccent(opt.value)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-all duration-150',
                          on
                            ? 'border-accent-400 dark:border-accent-600 bg-accent-50 dark:bg-accent-950/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                        )}
                      >
                        <span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: opt.hex }} />
                        <span className={cn('flex-1 text-xs font-medium text-left truncate', on ? 'text-accent-700 dark:text-accent-300' : 'text-slate-600 dark:text-slate-400')}>
                          {opt.label}
                        </span>
                        {on && <Check className="h-3 w-3 shrink-0 text-accent-500" />}
                      </button>
                    );
                  })}
                </div>
              </Section>
            </>
          )}

          {/* ── Language ── */}
          {active === 'language' && (
            <Section label={t('settings.display_lang')} hint={t('settings.lang_hint')}>
              <div className="space-y-2">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const on = lang === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLang(opt.value)}
                      className={cn(
                        'flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150',
                        on
                          ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600',
                      )}
                    >
                      <span className="text-2xl leading-none">{opt.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-semibold', on ? 'text-accent-700 dark:text-accent-300' : 'text-slate-800 dark:text-slate-100')}>
                          {opt.nativeLabel}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{opt.englishLabel}</p>
                      </div>
                      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all', on ? 'bg-accent-500' : 'border-2 border-slate-300 dark:border-slate-600')}>
                        {on && <Check className="h-3 w-3 text-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Security ── */}
          {active === 'security' && (
            <>
              <Section label={t('settings.change_password')} hint={t('settings.password_hint')}>
                <div className="space-y-4">
                  <Field label={t('settings.current_password')}>
                    <input type="password" placeholder="••••••••" className={inp} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t('settings.new_password')}>
                      <input type="password" placeholder="••••••••" className={inp} />
                    </Field>
                    <Field label={t('settings.confirm_password')}>
                      <input type="password" placeholder="••••••••" className={inp} />
                    </Field>
                  </div>
                  <button type="button" className="rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 transition-colors shadow-sm">
                    {t('settings.update_password')}
                  </button>
                </div>
              </Section>

              <Section label={t('settings.active_sessions')} hint={t('settings.sessions_hint')}>
                <div className="space-y-2">
                  {[
                    { device: 'MacBook Pro', browser: 'Chrome 124', location: 'Phnom Penh, KH', time: 'Active now',  current: true  },
                    { device: 'iPhone 15',   browser: 'Safari 17',  location: 'Phnom Penh, KH', time: '2 hours ago', current: false },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center gap-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-base">
                        {s.device.includes('Mac') ? '💻' : '📱'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{s.device} · {s.browser}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{s.location} · {s.time}</p>
                      </div>
                      {s.current
                        ? <span className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/40">{t('settings.current_session')}</span>
                        : <button type="button" className="shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">{t('settings.revoke')}</button>
                      }
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ label, hint, children }: { label?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {label && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
          {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{hint}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
