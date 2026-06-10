'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface NotifToggle {
  id: string;
  label: string;
  description: string;
}

const INITIAL_ENABLED: Record<string, boolean> = {
  new_note:     true,
  note_mention: true,
  new_message:  true,
  note_favorite:false,
  new_user:     true,
  note_deleted: false,
};

export default function NotificationSettings() {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(INITIAL_ENABLED);

  const toggles_config: NotifToggle[] = [
    { id: 'new_note',     label: t('notif.new_note_label'),  description: t('notif.new_note_desc') },
    { id: 'note_mention', label: t('notif.mention_label'),   description: t('notif.mention_desc') },
    { id: 'new_message',  label: t('notif.message_label'),   description: t('notif.message_desc') },
    { id: 'note_favorite',label: t('notif.favorite_label'),  description: t('notif.favorite_desc') },
    { id: 'new_user',     label: t('notif.new_user_label'),  description: t('notif.new_user_desc') },
    { id: 'note_deleted', label: t('notif.deleted_label'),   description: t('notif.deleted_desc') },
  ];

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-700">
      {toggles_config.map((item) => (
        <li key={item.id} className="flex items-center justify-between py-4">
          <div className="flex-1 pr-6">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
          </div>
          <label className="relative inline-flex h-6 w-11 cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              className="sr-only"
              checked={enabled[item.id] ?? false}
              onChange={() => toggle(item.id)}
              aria-label={item.label}
            />
            <span
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                enabled[item.id] ? 'bg-accent-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
            <span
              className={`relative h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                enabled[item.id] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </label>
        </li>
      ))}
    </ul>
  );
}
