'use client';

import { useEffect, useState } from 'react';
import { Camera, Save, Check } from 'lucide-react';
import { useSession } from '@/lib/session';
import { userProfileService } from '@/lib/services/userProfileService';
import { customAuth } from '@/lib/customAuth';
import { useI18n } from '@/lib/i18n';

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

const inputCls = 'w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-accent-400 dark:focus:border-accent-500 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/40 transition-all';

export default function ProfileSettings() {
  const { t } = useI18n();
  const { user, profile, refreshProfile } = useSession();

  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    if (user) setEmail(user.email);
    if (profile) {
      setName(profile.name ?? user?.name ?? '');
      setAvatarUrl(profile.avatarUrl ?? '');
    } else if (user) {
      setName(user.name ?? '');
    }
  }, [user, profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await userProfileService.updateProfile(user.userId, {
        name: name.trim(),
        avatarUrl: avatarUrl.trim(),
        email: user.email,
        isNote: profile?.isNote ?? true,
      });
      customAuth.setName(name.trim());
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Avatar row */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-accent-500 to-accent-600 text-lg font-bold text-white ring-2 ring-white dark:ring-slate-700 shadow-md">
            {avatarUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              : initials(name || email)}
          </div>
          <button
            type="button"
            title="Change photo"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-600 ring-2 ring-white dark:ring-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors shadow-sm"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name || t('ps.your_name')}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{email}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('ps.photo_hint')}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ps-name" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
            {t('ps.full_name')}
          </label>
          <input
            id="ps-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('ps.full_name_placeholder')}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="ps-email" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
            {t('ps.email')}
          </label>
          <input
            id="ps-email"
            type="email"
            value={email}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-400 dark:text-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-900/40">
          {error}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving || !user}
          className="flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 active:bg-accent-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? t('ps.saving') : t('ps.save')}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" /> {t('ps.saved')}
          </span>
        )}
      </div>
    </form>
  );
}
