---
name: clicknote-ui
description: 'Build UI for the clicknote Next.js project. Use when: adding a new page, new route, new component, new service, new dashboard widget, or any feature that must follow the project conventions (auth guard, Tailwind color palette, dark mode, lucide icons, service pattern, session hook).'
---

# clicknote-ui Skill

Guides implementation of any UI feature in this Next.js + TypeScript + Tailwind project while enforcing all established conventions.

---

## Project Conventions at a Glance

### Auth & Session
- Every authenticated page imports `useSession` from `@/lib/session`
- Always guard with `if (loading || !user) return null;` — redirect to `/auth/welcome` in a `useEffect`
- Use `user.userId`, `user.email`, `user.name` from `AuthUser`
- Use `profile.name`, `profile.avatarUrl` from `UserProfile` (may be `null`)

### File Locations
| What | Where |
|------|-------|
| Authenticated pages | `src/app/(app)/<route>/page.tsx` |
| Auth pages | `src/app/auth/<route>/page.tsx` |
| Feature components | `src/components/<feature>/ComponentName.tsx` |
| Services | `src/lib/services/<name>Service.ts` |
| Shared types | `src/lib/types.ts` |

### Page Template (authenticated)
```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [data, setData] = useState<MyType | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/welcome');
  }, [user, loading, router]);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    // call service here
  }, [user?.userId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !user) return null;

  return (
    <div>
      {/* page content */}
    </div>
  );
}
```

### Service Template
```ts
import { api } from '@/lib/api';
import type { MyType, MyListResponse } from '@/lib/types';

export interface GetMyItemsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const myService = {
  async getItems(params: GetMyItemsParams = {}): Promise<MyListResponse> {
    const { page = 1, pageSize = 20, search } = params;
    return api.get<MyListResponse>('/api/MyEndpoint', { Page: page, PageSize: pageSize, Search: search });
  },
  async getById(id: number): Promise<MyType> {
    return api.get<MyType>(`/api/MyEndpoint/${id}`);
  },
  async create(payload: Partial<MyType>): Promise<MyType> {
    return api.post<MyType>('/api/MyEndpoint', payload);
  },
  async update(id: number, payload: Partial<MyType>): Promise<void> {
    return api.put<void>(`/api/MyEndpoint/${id}`, payload);
  },
  async delete(id: number): Promise<void> {
    return api.delete(`/api/MyEndpoint/${id}`);
  },
};
```

---

## Tailwind Design System

### Color Palette
| Token | Usage |
|-------|-------|
| `indigo` | Primary actions, branding, dashboard |
| `emerald` | Notes feature |
| `fuchsia` | Users feature |
| `sky` | Messenger feature |
| `amber` | Warnings |
| `rose` | Errors, destructive actions |
| `slate` | Neutral text, borders, backgrounds |
| `violet` | Accent / stats |

### Shape & Elevation
- Cards: `rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700/60`
- Inputs: `rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition`
- Primary button: `inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors`
- Icon badges: `flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow shadow-indigo-200`
- Stats card icon: `flex h-9 w-9 items-center justify-center rounded-xl bg-<color>-50 text-<color>-600`

### Dark Mode
Always add `dark:` counterparts for bg, border, and text:
- `bg-white dark:bg-slate-900`
- `border-slate-200 dark:border-slate-700/60`
- `text-slate-900 dark:text-slate-100`
- `text-slate-500 dark:text-slate-400`

### Utilities
- `import { cn } from '@/lib/utils';` — use `cn()` for conditional class merging
- `import { useTheme } from '@/lib/theme';` — access `theme` and `toggle`
- Icons: always from `lucide-react`

---

## Adding a New Route

1. Create `src/app/(app)/<route>/page.tsx` using the **Page Template** above
2. Add the route to the `pageTitles` map in `src/components/layout/Header.tsx`
3. Add a nav item to `navItems` in `src/components/layout/Sidebar.tsx` with matching color classes

## Adding a New Service

1. Create `src/lib/services/<name>Service.ts` using the **Service Template** above
2. Add types to `src/lib/types.ts`
3. Import in the page via `import { myService } from '@/lib/services/myService';`

## Adding a Dashboard Widget

Follow the `StatsCard` color constraint — `color` must be one of:
`'indigo' | 'emerald' | 'amber' | 'rose' | 'violet'`

Use `Promise.allSettled` for parallel data fetching and derive counts locally from the result arrays.

---

## Checklist Before Writing Any File

- [ ] `'use client';` at top for interactive components/pages
- [ ] Auth guard (`if (loading || !user) return null;`) in every `(app)` page
- [ ] Services use `api.get/post/put/delete` — never `fetch` directly
- [ ] Types defined or imported from `@/lib/types`
- [ ] Dark mode variants on all background/border/text classes
- [ ] `cn()` used for conditional Tailwind classes
- [ ] Icons from `lucide-react` only
- [ ] No inline styles — Tailwind only
