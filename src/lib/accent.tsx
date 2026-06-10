'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor =
  | 'blue' | 'violet' | 'indigo' | 'sky' | 'cyan' | 'teal'
  | 'emerald' | 'orange' | 'rose' | 'pink' | 'fuchsia' | 'amber';

export interface AccentOption {
  value: AccentColor;
  label: string;
  hex: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { value: 'blue',    label: 'Blue',    hex: '#2563eb' },
  { value: 'violet',  label: 'Violet',  hex: '#7c3aed' },
  { value: 'indigo',  label: 'Indigo',  hex: '#4f46e5' },
  { value: 'sky',     label: 'Sky',     hex: '#0284c7' },
  { value: 'cyan',    label: 'Cyan',    hex: '#0891b2' },
  { value: 'teal',    label: 'Teal',    hex: '#0d9488' },
  { value: 'emerald', label: 'Emerald', hex: '#059669' },
  { value: 'orange',  label: 'Orange',  hex: '#ea580c' },
  { value: 'rose',    label: 'Rose',    hex: '#e11d48' },
  { value: 'pink',    label: 'Pink',    hex: '#db2777' },
  { value: 'fuchsia', label: 'Fuchsia', hex: '#c026d3' },
  { value: 'amber',   label: 'Amber',   hex: '#d97706' },
];

interface AccentContextValue {
  accent: AccentColor;
  setAccent: (c: AccentColor) => void;
}

const AccentContext = createContext<AccentContextValue>({
  accent: 'blue',
  setAccent: () => {},
});

export function useAccent() {
  return useContext(AccentContext);
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = typeof window !== 'undefined'
      ? (localStorage.getItem('accent-color') as AccentColor | null)
      : null;
    return (saved && ACCENT_OPTIONS.some((o) => o.value === saved)) ? saved : 'blue';
  });

  useEffect(() => {
    apply(accent);
  }, [accent]);

  function setAccent(color: AccentColor) {
    setAccentState(color);
    localStorage.setItem('accent-color', color);
  }

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

function apply(color: AccentColor) {
  document.documentElement.setAttribute('data-accent', color);
}
