'use client';

import { useState } from 'react';

export interface BarItem {
  label: string;
  value: number;
  color: string;      // e.g. '#6366f1'
  colorLight: string; // e.g. '#eef2ff'
}

export default function BarChart({
  data,
  title,
  subtitle,
}: {
  data: BarItem[];
  title: string;
  subtitle?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const BAR_H = 120;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex flex-1 flex-col justify-between px-6 py-5">
        {/* Bars */}
        <div className="flex items-end gap-3" style={{ height: BAR_H }}>
          {data.map((item, i) => {
            const pct = (item.value / max) * 100;
            const isHov = hovered === i;
            return (
              <div
                key={item.label}
                className="flex flex-1 cursor-default flex-col items-center gap-1"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Value tooltip above */}
                <span
                  className="min-w-6 rounded-md px-1.5 py-0.5 text-center text-[11px] font-bold transition-all duration-150"
                  style={{
                    color: isHov ? item.color : '#64748b',
                    background: isHov ? item.colorLight : 'transparent',
                  }}
                >
                  {item.value}
                </span>
                {/* Track */}
                <div
                  className="relative w-full overflow-hidden rounded-xl"
                  style={{ height: BAR_H - 24, background: item.colorLight }}
                >
                  {/* Fill */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-xl transition-all duration-700"
                    style={{
                      height: `${pct}%`,
                      background: item.color,
                      opacity: isHov ? 1 : 0.8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X labels */}
        <div className="mt-2 flex gap-3">
          {data.map((item, i) => (
            <p
              key={item.label}
              className="flex-1 text-center text-[10px] font-medium leading-tight transition-colors"
              style={{ color: hovered === i ? item.color : '#94a3b8' }}
            >
              {item.label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
