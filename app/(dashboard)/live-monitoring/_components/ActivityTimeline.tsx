// app/(dashboard)/live-monitoring/_components/ActivityTimeline.tsx
// Bottom-left activity log showing last 2 hours of events

"use client";

import { CheckCircle2, XCircle, Play } from "lucide-react";
import type { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ActivityType = "escalated" | "completed" | "started";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  time: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    type: "escalated",
    title: "Missed visit escalated",
    detail: "Dorothy Chen · James O. · Coordinator notified",
    time: "09:00 AM",
  },
  {
    id: "a2",
    type: "completed",
    title: "Visit completed",
    detail: "Lucy Chen checked out from Arthur Wilson",
    time: "09:29 AM",
  },
  {
    id: "a3",
    type: "started",
    title: "Visit started",
    detail: "Thomas Jones checked in at Helen Brown",
    time: "09:54 AM",
  },
];

// Use ReactNode instead of JSX.Element to avoid the namespace error
const TYPE_ICON: Record<ActivityType, ReactNode> = {
  escalated: <XCircle      size={14} className="text-[#EF4444]" />,
  completed: <CheckCircle2 size={14} className="text-[#10B981]" />,
  started:   <Play         size={14} className="text-[#2563EB]" />,
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ActivityTimeline() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-sm p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Activity Timeline</h2>
        <span className="text-[10px] text-[#A0A3B1]">Last 2 hours</span>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col gap-0">
        {/* Vertical line */}
        <div className="absolute left-[6px] top-2 bottom-2 w-px bg-[#E4E5EA]" />

        {ACTIVITIES.map((act) => (
          <div key={act.id} className="flex items-start gap-3 pl-1 py-2 hover:bg-[#FAFBFC] rounded-lg transition-colors">
            {/* Icon (sits on the line) */}
            <div className="relative z-10 bg-white shrink-0">{TYPE_ICON[act.type]}</div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#111318] leading-tight">{act.title}</p>
              <p className="text-[10px] text-[#A0A3B1] truncate">{act.detail}</p>
              <p className="text-[10px] text-[#2563EB] font-medium mt-0.5">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
