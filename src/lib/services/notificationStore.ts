import type { NotificationItem } from '@/lib/types';

const STORAGE_KEY = 'yby-notifications';
const EVENT = 'yby-notifications-change';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function read(): NotificationItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NotificationItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: NotificationItem[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Newest first. */
export function getNotifications(): NotificationItem[] {
  return [...read()].sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1));
}

export function getUnreadCount(): number {
  return read().filter((n) => !n.isRead).length;
}

export function addNotification(input: { title: string; body: string; senderId?: string | null }): NotificationItem {
  const items = read();
  const next: NotificationItem = {
    id: items.reduce((m, n) => Math.max(m, n.id), 0) + 1,
    title: input.title,
    body: input.body,
    senderId: input.senderId ?? null,
    receivedAt: new Date().toISOString(),
    isRead: false,
  };
  items.push(next);
  write(items);
  return next;
}

export function markRead(id: number): void {
  const items = read();
  const idx = items.findIndex((n) => n.id === id);
  if (idx >= 0 && !items[idx].isRead) {
    items[idx] = { ...items[idx], isRead: true };
    write(items);
  }
}

export function markAllRead(): void {
  const items = read().map((n) => (n.isRead ? n : { ...n, isRead: true }));
  write(items);
}

export function removeNotification(id: number): void {
  write(read().filter((n) => n.id !== id));
}

export function clearAllNotifications(): void {
  write([]);
}

export function onNotificationsChange(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => listener();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
