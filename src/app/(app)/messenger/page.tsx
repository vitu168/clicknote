'use client';

import { useEffect, useState } from 'react';
import { userProfileService } from '@/lib/services/userProfileService';
import MessengerClient from '@/components/messenger/MessengerClient';
import { useSession } from '@/lib/session';
import type { UserProfile } from '@/lib/types';
import { MessageSquare } from 'lucide-react';

export default function MessengerPage() {
  const { user, profile } = useSession();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await userProfileService.getProfiles({ pageSize: 100 });
        if (!cancelled) setUsers(res.items);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <MessageSquare className="h-8 w-8 animate-pulse" />
          <p className="text-xs">Loading contacts…</p>
        </div>
      </div>
    );
  }

  return (
    <MessengerClient
      users={users}
      currentUserId={user.userId}
      currentUserName={profile?.name ?? user.name ?? user.email}
    />
  );
}
