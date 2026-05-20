'use client';

import { useCallback, useEffect, useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';
import ViewToggle, { type ViewMode } from '@/components/ui/ViewToggle';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import UserCard, { UserListHeader } from '@/components/users/UserCard';
import { userProfileService } from '@/lib/services/userProfileService';
import type { UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';

export default function UsersPage() {
  const { user } = useSession();
  const userId = user?.userId ?? '';

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await userProfileService.getProfiles({
        search: search || undefined,
        page,
        pageSize,
      });
      const others = res.items.filter((p) => p.id !== userId);
      setProfiles(others);
      setTotalCount(Math.max(res.totalCount - 1, others.length));
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Failed to load members.');
    } finally {
      setLoading(false);
    }
  }, [userId, search, page, pageSize]);

  useEffect(() => {
    const timer = setTimeout(fetchProfiles, 300);
    return () => clearTimeout(timer);
  }, [fetchProfiles]);

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await userProfileService.deleteProfile(deleteId);
      setDeleteId(null);
      fetchProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member.');
      setDeleteId(null);
    }
  }

  const skeletonGrid = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      ))}
    </div>
  );

  const skeletonList = (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 last:border-0" />
      ))}
    </div>
  );

  return (
    <div className="h-full overflow-hidden flex flex-col gap-4">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search members…"
          className="w-56"
        />
        <div className="flex-1" />
        <ViewToggle view={view} onChange={setView} />
        <button
          type="button"
          onClick={fetchProfiles}
          aria-label="Refresh"
          title="Refresh"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="shrink-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-900/50">
          {error}
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && profiles.length === 0 ? (
          view === 'list' ? skeletonList : skeletonGrid
        ) : profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/30 text-accent-500 dark:text-accent-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {search ? 'No members match your search.' : 'No members found.'}
            </p>
          </div>
        ) : view === 'list' ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
            <UserListHeader />
            {profiles.map((profile) => (
              <UserCard
                key={profile.id}
                profile={profile}
                view="list"
                onDelete={setDeleteId}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-2">
            {profiles.map((profile) => (
              <UserCard
                key={profile.id}
                profile={profile}
                view="grid"
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 pt-4">
        {!loading && totalCount > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            pageSizeOptions={[12, 24, 48]}
          />
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete member"
        description="This member profile will be permanently deleted and cannot be recovered."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
