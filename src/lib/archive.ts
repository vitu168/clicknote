const STORAGE_KEY = 'yby-notes-archived';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readRaw(): number[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === 'number') : [];
  } catch {
    return [];
  }
}

function writeRaw(ids: number[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('yby-archive-change'));
}

export function getArchivedIds(): Set<number> {
  return new Set(readRaw());
}

export function archiveNote(id: number): void {
  const current = new Set(readRaw());
  current.add(id);
  writeRaw(Array.from(current));
}

export function unarchiveNote(id: number): void {
  const current = new Set(readRaw());
  current.delete(id);
  writeRaw(Array.from(current));
}

export function onArchiveChange(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => listener();
  window.addEventListener('yby-archive-change', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('yby-archive-change', handler);
    window.removeEventListener('storage', handler);
  };
}
