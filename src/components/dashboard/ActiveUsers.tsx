import type { UserProfile } from '@/lib/types';

function initials(name: string | null, email: string | null): string {
  const src = name || email || '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

const avatarColors = [
  'from-indigo-500 to-violet-600',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-blue-500',
  'from-fuchsia-400 to-purple-500',
];

export default function ActiveUsers({ users }: { users: UserProfile[] }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Active Users</p>
        <p className="text-xs text-slate-400 mt-0.5">Users registered in the workspace</p>
      </div>
      {users.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-slate-400">No users yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50 px-3 py-2">
          {users.map((user, i) => (
            <li key={user.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${avatarColors[i % avatarColors.length]} text-[11px] font-bold text-white overflow-hidden`}
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(user.name, user.email)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name || 'Unknown'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              {user.isNote && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Note
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
