import { FileText, Star } from 'lucide-react';
import type { NoteInfo } from '@/lib/types';

function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentNotes({ notes }: { notes: NoteInfo[] }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Recent Notes</p>
        <p className="text-xs text-slate-400 mt-0.5">Latest activity across all notes</p>
      </div>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <FileText className="h-8 w-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No notes yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50">
          {notes.map((note) => (
            <li key={note.id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-slate-900 truncate">{note.name || 'Untitled'}</p>
                  {note.isFavorites && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{note.description || 'No description'}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">{timeAgo(note.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
