'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Check, Trash2 } from 'lucide-react';
import {
  addNotification,
  clearAllNotifications,
  getNotifications,
  markAllRead,
  markRead,
  onNotificationsChange,
  removeNotification,
} from '@/lib/services/notificationStore';
import type { NotificationItem } from '@/lib/types';
import { cn } from '@/lib/utils';

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setItems(getNotifications());
    return onNotificationsChange(() => setItems(getNotifications()));
  }, []);

  const unread = items.filter((n) => !n.isRead).length;

  function handleDemoNotification() {
    addNotification({
      title: 'New activity',
      body: 'This is a sample notification — real events will appear here.',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {unread > 0 ? `${unread} unread` : 'All caught up'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDemoNotification}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            + Demo
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            <Check className="h-3 w-3" /> Mark all read
          </button>
          <button
            type="button"
            onClick={clearAllNotifications}
            disabled={items.length === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" /> Clear all
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-slate-800 py-16 text-center ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400">
            <BellOff className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No notifications yet.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">New activity will show up here as it happens.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn(
                'flex items-start gap-3 px-5 py-4 transition-colors',
                n.isRead ? 'bg-white dark:bg-slate-800' : 'bg-accent-50/30 dark:bg-accent-950/20',
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                  n.isRead ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : 'bg-accent-100 dark:bg-accent-950/50 text-accent-600 dark:text-accent-400',
                )}
              >
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                  {!n.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />}
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.body}</p>
                <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">{relativeTime(n.receivedAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    aria-label="Mark as read"
                    title="Mark as read"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeNotification(n.id)}
                  aria-label="Dismiss"
                  title="Dismiss"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
