'use client';

import { useState } from 'react';

interface NotifToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialToggles: NotifToggle[] = [
  { id: 'new_note', label: 'New Note Created', description: 'Get notified when a new note is added to the workspace', enabled: true },
  { id: 'note_mention', label: 'Note Mentions', description: 'Alert when someone mentions you in a note', enabled: true },
  { id: 'new_message', label: 'New Messages', description: 'Notify when you receive a new chat message', enabled: true },
  { id: 'note_favorite', label: 'Favorites Activity', description: 'When a note you favorited is updated or deleted', enabled: false },
  { id: 'new_user', label: 'New User Joined', description: 'Alert when a new user registers in the workspace', enabled: true },
  { id: 'note_deleted', label: 'Note Deleted', description: 'Notify when a note you created is deleted', enabled: false },
];

export default function NotificationSettings() {
  const [toggles, setToggles] = useState(initialToggles);

  function toggle(id: string) {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {toggles.map((item) => (
        <li key={item.id} className="flex items-center justify-between py-4">
          <div className="flex-1 pr-6">
            <p className="text-sm font-medium text-slate-900">{item.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
          </div>
          <label className="relative inline-flex h-6 w-11 cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              className="sr-only"
              checked={item.enabled}
              onChange={() => toggle(item.id)}
              aria-label={item.label}
            />
            <span
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                item.enabled ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            />
            <span
              className={`relative h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                item.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </label>
        </li>
      ))}
    </ul>
  );
}
