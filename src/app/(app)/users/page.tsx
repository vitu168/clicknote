'use client';

import { useEffect, useState } from 'react';
import { userProfileService } from '@/lib/services/userProfileService';
import UserProfilesTable from '@/components/users/UserProfilesTable';
import { Users, FileText } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { useSession } from '@/lib/session';

export default function UsersPage() {
  const { user } = useSession();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await userProfileService.getProfiles({ pageSize: 100 });
        if (!cancelled) {
          // Exclude the currently logged-in user from the list
          const others = res.items.filter((p) => p.id !== user?.userId);
          setProfiles(others);
          setTotalCount(others.length);
        }
      } catch {
        if (!cancelled) setProfiles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.userId]);

  const noteUsers = profiles.filter((p) => p.isNote).length;

  const summaryCards = [
    { label: 'Total Users', value: totalCount, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Active (isNote)', value: noteUsers, icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
              <p className="text-[11px] text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <UserProfilesTable profiles={profiles} />
      )}
    </div>
  );
}
