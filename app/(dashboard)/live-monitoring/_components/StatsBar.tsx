// app/(dashboard)/live-monitoring/_components/StatsBar.tsx
// Top metrics row: Total Today, Completed, In Progress, Late, Missed, Upcoming, On-Time

"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stat {
  label: string;
  value: string | number;
  color?: string;           // tailwind text colour class
  pulse?: boolean;          // animated dot for "live" values
}

// ── Static data ───────────────────────────────────────────────────────────────
const STATS: Stat[] = [
  { label: "TOTAL TODAY",  value: 127 },
  { label: "COMPLETED",    value: 98,    color: "text-[#111318]" },
  { label: "IN PROGRESS",  value: 14,    color: "text-[#2563EB]", pulse: true },
  { label: "LATE",         value: 2,     color: "text-[#F59E0B]" },
  { label: "MISSED",       value: 1,     color: "text-[#EF4444]" },
  { label: "UPCOMING",     value: 12 },
  { label: "ON-TIME",      value: "96.1%", color: "text-[#10B981]" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function StatsBar() {
  // Animate values counting up on mount
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div
      className={`
        grid grid-cols-7 border-b border-[#E4E5EA] bg-white
        transition-all duration-500
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`
            flex flex-col items-center justify-center py-4 px-3
            ${i !== STATS.length - 1 ? "border-r border-[#E4E5EA]" : ""}
            hover:bg-[#FAFBFC] transition-colors cursor-default
          `}
        >
          <span className="text-[10px] font-semibold text-[#A0A3B1] tracking-wider mb-1">
            {stat.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-2xl font-bold ${stat.color ?? "text-[#111318]"}`}>
              {stat.value}
            </span>
            {/* Pulsing dot for live "in progress" */}
            {stat.pulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
