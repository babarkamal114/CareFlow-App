// app/(dashboard)/live-monitoring/_components/LiveFeed.tsx
// Scrollable live activity stream with status icons and timestamps

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle, Play } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type FeedStatus = "completed" | "missed" | "late" | "checked-in" | "in-progress";

interface FeedItem {
  id: string;
  carer: string;
  action: string;
  patient: string;
  time: string;
  status: FeedStatus;
  note?: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEED_ITEMS: FeedItem[] = [
  { id:"f1", carer:"Thomas Jones",  action:"checked in at",    patient:"Helen Brown",     time:"09:54", status:"checked-in",  note:"On time · 12 Elm Drive" },
  { id:"f2", carer:"Lucy Chen",     action:"completed visit with", patient:"Arthur Wilson", time:"09:29", status:"completed",  note:"36 min · All tasks done · 3 meds given" },
  { id:"f3", carer:"Nadia Khan",    action:"completed visit with", patient:"William Davies",time:"19:15", status:"completed",  note:"32 min · 1 task delayed: Reason logged" },
  { id:"f4", carer:"Maria Rodriguez",action:"late for",         patient:"Edna Morris",    time:"08:45", status:"late",        note:"11 min late · Just checked in" },
  { id:"f5", carer:"Priya Patel",   action:"checked in at",    patient:"Robert Ahmed",   time:"08:00", status:"checked-in",  note:"On time · 42 Elm Street" },
  { id:"f6", carer:"James Okafor",  action:"missed visit with", patient:"Dorothy Chen",  time:"06:00", status:"missed",      note:"No check-in · Escalation triggered" },
  { id:"f7", carer:"Sarah Williams",action:"completed visit with",patient:"Margaret Johnson",time:"04:41",status:"completed", note:"32 min · All tasks done · 4 meds given · 1 refused" },
  { id:"f8", carer:"Sarah Williams",action:"checked in at",    patient:"Margaret Johnson",time:"03:00", status:"checked-in", note:"On time · 7 Rose Crescent" },
];

const STATUS_ICON: Record<FeedStatus, ReactNode> = {
  "completed":   <CheckCircle2 size={14} className="text-[#10B981]" />,
  "missed":      <XCircle      size={14} className="text-[#EF4444]" />,
  "late":        <AlertCircle  size={14} className="text-[#F59E0B]" />,
  "checked-in":  <Play         size={14} className="text-[#2563EB]" />,
  "in-progress": <Clock        size={14} className="text-[#6366F1]" />,
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function LiveFeed() {
  // Simulate a new item arriving after 5 seconds
  const [items, setItems] = useState(FEED_ITEMS);
  const [newId, setNewId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const id = `f${Date.now()}`;
      setItems((prev) => [
        { id, carer:"Emma Clarke", action:"checked in at", patient:"George Patel",
          time:"09:55", status:"checked-in", note:"On time" },
        ...prev,
      ]);
      setNewId(id);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-[#111318]">Live Feed</h2>
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
        </div>
        <button className="text-[11px] text-[#2563EB] font-medium hover:underline">
          All Visits
        </button>
      </div>

      {/* Feed list */}
      <div className="flex flex-col divide-y divide-[#F3F4F6] overflow-y-auto max-h-[340px] scrollbar-thin">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              flex items-start gap-2 py-2.5 hover:bg-[#FAFBFC] transition-colors
              ${item.id === newId ? "animate-highlight" : ""}
            `}
          >
            {/* Status icon */}
            <div className="mt-0.5 shrink-0">{STATUS_ICON[item.status]}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#111318] leading-tight">
                <span className="font-semibold">{item.carer}</span>{" "}
                {item.action}{" "}
                <span className="font-semibold">{item.patient}</span>
              </p>
              {item.note && (
                <p className={`text-[10px] mt-0.5 ${
                  item.status === "missed" ? "text-[#EF4444]" :
                  item.status === "late"   ? "text-[#F59E0B]" :
                  "text-[#A0A3B1]"
                }`}>
                  {item.note}
                </p>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-[#A0A3B1] shrink-0 mt-0.5">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
