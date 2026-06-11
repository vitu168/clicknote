'use client';

import type { ReactNode } from 'react';
import { FileText, Star, Clock, Eye, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import DataTable, { type Column, type RowAction } from '@/components/ui/DataTable';
import Pill from '@/components/ui/Pill';
import type { NoteInfo } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface NotesTableProps {
  notes: NoteInfo[];
  onOpen?: (note: NoteInfo) => void;
  onToggleFavorite?: (note: NoteInfo) => void;
  onArchive?: (note: NoteInfo) => void;
  onUnarchive?: (note: NoteInfo) => void;
  onDelete?: (id: number) => void;
  emptyMessage?: ReactNode;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotesTable({
  notes, onOpen, onToggleFavorite, onArchive, onUnarchive, onDelete, emptyMessage,
}: NotesTableProps) {
  const { t } = useI18n();

  const columns: Column<NoteInfo>[] = [
    {
      key: 'name',
      header: t('table.name'),
      width: '30%',
      sortable: true,
      sortAccessor: (n) => (n.name ?? '').toLowerCase(),
      render: (n) => (
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-950/30 dark:text-accent-400">
            <FileText className="h-3.5 w-3.5" />
          </span>
          <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{n.name ?? t('badge.untitled')}</span>
        </span>
      ),
    },
    {
      key: 'description',
      header: t('table.description'),
      render: (n) => <span className="text-slate-500 dark:text-slate-400">{n.description || '—'}</span>,
    },
    {
      key: 'updated',
      header: t('table.updated'),
      width: '150px',
      sortable: true,
      sortAccessor: (n) => new Date(n.updatedAt ?? n.createdAt ?? 0).getTime(),
      render: (n) => (
        <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Clock className="h-3 w-3 shrink-0" />
          {formatDate(n.updatedAt ?? n.createdAt)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('table.status'),
      width: '130px',
      render: (n) => n.isFavorites
        ? <Pill tone="amber" variant="soft" icon={Star}>{t('badge.favorite')}</Pill>
        : <Pill tone="slate" variant="soft">{t('badge.note')}</Pill>,
    },
  ];

  const rowActions = (n: NoteInfo): RowAction<NoteInfo>[] => {
    const actions: RowAction<NoteInfo>[] = [];
    if (onOpen) actions.push({ label: t('note.open'), icon: Eye, onClick: onOpen });
    if (onToggleFavorite) actions.push({
      label: n.isFavorites ? t('note.unfavorite_title') : t('note.favorite_title'),
      icon: Star, onClick: onToggleFavorite,
    });
    if (onArchive) actions.push({ label: t('note.archive_title'), icon: Archive, onClick: onArchive });
    if (onUnarchive) actions.push({ label: t('note.restore_title'), icon: ArchiveRestore, onClick: onUnarchive });
    if (onDelete) actions.push({ label: t('note.delete_title'), icon: Trash2, danger: true, onClick: (note) => onDelete(note.id) });
    return actions;
  };

  return (
    <DataTable
      columns={columns}
      rows={notes}
      rowKey={(n) => String(n.id)}
      rowActions={rowActions}
      onRowClick={onOpen}
      monospace={false}
      initialSort={{ key: 'updated', dir: 'desc' }}
      emptyMessage={emptyMessage}
    />
  );
}
