import type { Metadata } from 'next';
import { User, Bell } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

export const metadata: Metadata = { title: 'Settings' };

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Sidebar nav */}
      <nav className="lg:col-span-1">
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
          <ul>
            {sections.map((section, i) => (
              <li key={section.id} className={i < sections.length - 1 ? 'border-b border-slate-100' : ''}>
                <a
                  href={`#${section.id}`}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all hover:bg-indigo-50/50 hover:text-indigo-700 ${
                    i === 0 ? 'text-indigo-600 bg-indigo-50/40' : 'text-slate-600'
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${i === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <section.icon className="h-3.5 w-3.5" />
                  </div>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Profile */}
        <section id="profile" className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Profile Information</p>
            <p className="text-xs text-slate-400 mt-0.5">Update your personal details</p>
          </div>
          <div className="px-6 py-6">
            <ProfileSettings />
          </div>
        </section>

        {/* Notifications */}
        <section id="notifications" className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Notification Preferences</p>
            <p className="text-xs text-slate-400 mt-0.5">Choose what you want to be notified about</p>
          </div>
          <div className="px-6 py-2">
            <NotificationSettings />
          </div>
        </section>
      </div>
    </div>
  );
}
