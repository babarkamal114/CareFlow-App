// app/(dashboard)/live-monitoring/page.tsx
// Live Monitoring page — assembles header, stats bar, map, right panel, and bottom bar

"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Phone, SlidersHorizontal } from "lucide-react";

import StatsBar          from "./_components/StatsBar";
import MapView           from "./_components/MapView";
import ActiveEscalations from "./_components/ActiveEscalations";
import LiveFeed          from "./_components/LiveFeed";
import ActivityTimeline  from "./_components/ActivityTimeline";
import CarersOnShift     from "./_components/CarersOnShift";

// ── Live clock ────────────────────────────────────────────────────────────────
function useLiveClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LiveMonitoringPage() {
  const clock = useLiveClock();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* ── Top header bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E4E5EA] shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-[#111318]">Live Monitoring</h1>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 bg-[#ECFDF5] px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="text-[11px] font-semibold text-[#10B981]">Live · {clock}</span>
          </div>
          <span className="text-[11px] text-[#A0A3B1]">Wednesday, 7 April 2026</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280] px-3 py-1.5 border border-[#E4E5EA] rounded-lg hover:bg-[#F5F6FA] transition-colors">
            <SlidersHorizontal size={13} /> Filter Area
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280] px-3 py-1.5 border border-[#E4E5EA] rounded-lg hover:bg-[#F5F6FA] transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3 py-1.5 bg-[#10B981] rounded-lg hover:bg-[#059669] transition-colors">
            <Phone size={13} /> Contact Carer
          </button>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <StatsBar />

      {/* ── Main content area ──────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left/centre: Map */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Map takes most vertical space */}
          <MapView />

          {/* Bottom strip: Activity Timeline + Carers on Shift */}
          <div className="grid grid-cols-2 gap-3 p-3 border-t border-[#E4E5EA] shrink-0">
            <ActivityTimeline />
            <CarersOnShift />
          </div>
        </div>

        {/* Right panel: Escalations + Live Feed */}
        <div className="w-[300px] shrink-0 border-l border-[#E4E5EA] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 scrollbar-thin">
            <ActiveEscalations />
            <div className="border-t border-[#E4E5EA]" />
            <LiveFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
