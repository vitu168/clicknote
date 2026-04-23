'use client';

import { useState } from 'react';
import { Search, UserPlus, MoreHorizontal, Mail, MapPin } from 'lucide-react';
import type { User } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const roles = ['All', 'Admin', 'Developer', 'Editor', 'Viewer'];

  const filtered = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 px-6 py-5 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Role filter */}
          <div className="flex gap-1.5">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  roleFilter === role
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden xl:table-cell">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} colorClass={user.avatarColor} size="md" />
                      <div>
                        <p className="font-medium text-slate-900 leading-none">{user.name}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <Badge variant={user.role.toLowerCase() as 'admin' | 'editor' | 'developer' | 'viewer'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={user.status} showDot>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 hidden xl:table-cell">
                    {formatDate(user.joined)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button title="More options" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Showing <span className="font-medium text-slate-700">{filtered.length}</span> of{' '}
          <span className="font-medium text-slate-700">{users.length}</span> users
        </p>
      </div>
    </div>
  );
}
