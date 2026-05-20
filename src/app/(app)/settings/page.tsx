'use client';

import { User, Bell, Palette, Languages } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { useAccent, ACCENT_OPTIONS } from '@/lib/accent';
import { useI18n, type Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LANGUAGE_OPTIONS: { value: Language; nativeLabel: string; flag: string }[] = [
  { value: 'en', nativeLabel: 'English',    flag: '🇬🇧' },
  { value: 'km', nativeLabel: 'ភាសាខ្មែរ', flag: '🇰🇭' },
];

export default function SettingsPage() {
  const { accent, setAccent } = useAccent();
  const { lang, setLang, t } = useI18n();

  const sections = [
    { id: 'appearance',    label: t('settings.appearance'),    icon: Palette   },
    { id: 'language',      label: t('settings.language'),      icon: Languages },
    { id: 'profile',       label: t('settings.profile'),       icon: User      },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell      },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">

      {/* Sticky side nav */}
      <nav className="lg:col-span-1">
        <div className="sticky top-4 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="px-3 pt-3 pb-1">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Settings
            </p>
          </div>
          <ul className="pb-2 px-2 space-y-0.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-accent-50 hover:text-accent-700 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <section.icon className="h-3.5 w-3.5" />
                  </div>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Content */}
      <div className="lg:col-span-3 space-y-5">

        {/* Appearance */}
        <section id="appearance" className="rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('settings.appearance')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('settings.appearance_desc')}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              {t('settings.accent_color')}
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
              {ACCENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccent(opt.value)}
                  title={opt.label}
                  className={cn(
                    'group flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all',
                    accent === opt.value
                      ? 'border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-700 dark:bg-accent-950/40 dark:text-accent-300 ring-1 ring-accent-300 dark:ring-accent-700'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  )}
                >
                  <span
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/10 transition-transform',
                      accent === opt.value && 'scale-110',
                    )}
                    style={{ backgroundColor: opt.hex }}
                  />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Language */}
        <section id="language" className="rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('settings.language')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('settings.language_desc')}</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex gap-3">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLang(opt.value)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all',
                    lang === opt.value
                      ? 'border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-700 dark:bg-accent-950/40 dark:text-accent-300 ring-1 ring-accent-300 dark:ring-accent-700 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  )}
                >
                  <span className="text-lg leading-none">{opt.flag}</span>
                  <span>{opt.nativeLabel}</span>
                  {lang === opt.value && (
                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[9px] text-white font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Profile */}
        <section id="profile" className="rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('settings.profile')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('settings.profile_desc')}</p>
          </div>
          <div className="px-5 py-5">
            <ProfileSettings />
          </div>
        </section>

        {/* Notifications */}
        <section id="notifications" className="rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('settings.notifications')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('settings.notifications_desc')}</p>
          </div>
          <div className="px-5 py-1">
            <NotificationSettings />
          </div>
        </section>

      </div>
    </div>
  );
}
