'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle2, Save, Camera } from 'lucide-react';
import { useSession } from '@/lib/session';
import { userProfileService } from '@/lib/services/userProfileService';
import { customAuth } from '@/lib/customAuth';
import { cn } from '@/lib/utils';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useSession();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/welcome');
      return;
    }
    if (profile) {
      setName(profile.name ?? user?.name ?? '');
      setAvatarUrl(profile.avatarUrl ?? '');
    } else if (user) {
      setName(user.name ?? '');
    }
  }, [user, profile, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await userProfileService.updateProfile(user.userId, {
        name: name.trim(),
        avatarUrl: avatarUrl.trim(),
        email: user.email,
        isNote: true,
      });
      customAuth.setName(name.trim());
      await refreshProfile();
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Could not save profile.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) return null;

  const initials = (name || user.email).slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5FA] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow shadow-indigo-200">
            <UserCircle2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Complete your profile</h1>
          <p className="mt-1 text-xs text-slate-500">
            Add a photo and confirm your display name.
          </p>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ring-slate-200 text-slate-600">
              <Camera className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user.email}</p>
            <p className="text-[11px] text-slate-400">Signed-in account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              required
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="avatar" className="text-xs font-semibold text-slate-700">
              Avatar URL
            </label>
            <input
              id="avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => router.replace('/dashboard')}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm',
                'hover:bg-indigo-700 transition-colors',
                submitting && 'opacity-60 cursor-not-allowed',
              )}
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
