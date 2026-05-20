// app/(dashboard)/live-monitoring/_components/MapView.tsx
// Grid map with colour-coded carer pins and zoom controls

"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Pin {
  id: string;
  initials: string;
  top: string;   // % position
  left: string;
  status: "completed" | "in-progress" | "late" | "missed";
}

// ── Data ──────────────────────────────────────────────────────────────────────
const PINS: Pin[] = [
  { id: "sw", initials: "SW", top: "30%", left: "22%", status: "completed" },
  { id: "nk", initials: "NK", top: "25%", left: "58%", status: "completed" },
  { id: "jo", initials: "JO", top: "42%", left: "32%", status: "missed"    },
  { id: "pp", initials: "PP", top: "45%", left: "48%", status: "in-progress"},
  { id: "lc", initials: "LC", top: "48%", left: "72%", status: "completed" },
  { id: "mr", initials: "MR", top: "55%", left: "28%", status: "late"      },
  { id: "ak", initials: "AK", top: "60%", left: "60%", status: "in-progress"},
  { id: "tj", initials: "TJ", top: "65%", left: "42%", status: "in-progress"},
  { id: "dm", initials: "DM", top: "72%", left: "52%", status: "late"      },
];

const STATUS_COLORS: Record<string, string> = {
  "completed":   "bg-[#10B981] text-white",
  "in-progress": "bg-[#2563EB] text-white",
  "late":        "bg-[#F59E0B] text-white",
  "missed":      "bg-[#EF4444] text-white",
};

const LEGEND = [
  { label: "Completed",   color: "bg-[#10B981]" },
  { label: "In Progress", color: "bg-[#2563EB]" },
  { label: "Late",        color: "bg-[#F59E0B]" },
  { label: "Missed",      color: "bg-[#EF4444]" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function MapView() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative flex-1 bg-[#EEF2F7] overflow-hidden min-h-[400px]">
      {/* Fake map grid */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#94A3B8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Blobs simulating city blocks */}
        <div className="absolute top-[15%] left-[10%] w-32 h-20 bg-[#CBD5E1] rounded-lg opacity-40" />
        <div className="absolute top-[20%] left-[35%] w-48 h-14 bg-[#CBD5E1] rounded-lg opacity-40" />
        <div className="absolute top-[35%] left-[55%] w-24 h-28 bg-[#CBD5E1] rounded-lg opacity-40" />
        <div className="absolute top-[50%] left-[15%] w-40 h-16 bg-[#CBD5E1] rounded-lg opacity-40" />
        <div className="absolute top-[60%] left-[62%] w-36 h-20 bg-[#CBD5E1] rounded-lg opacity-40" />
        {/* Coverage circles */}
        <div className="absolute top-[5%] left-[5%] w-64 h-64 rounded-full bg-[#10B981] opacity-[0.07]" />
        <div className="absolute top-[40%] left-[40%] w-72 h-72 rounded-full bg-[#2563EB] opacity-[0.06]" />

        {/* Carer pins */}
        {PINS.map((pin) => (
          <div
            key={pin.id}
            className="absolute flex flex-col items-center group"
            style={{ top: pin.top, left: pin.left, transform: "translate(-50%, -100%)" }}
          >
            {/* Tooltip */}
            <div className="
              absolute bottom-full mb-1 px-2 py-1 bg-[#111318] text-white text-[10px]
              rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
              transition-opacity z-10
            ">
              {pin.initials} · {pin.status}
            </div>

            {/* Pin head */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold
              shadow-lg cursor-pointer hover:scale-110 transition-transform
              ${STATUS_COLORS[pin.status]}
              ${pin.status === "late" || pin.status === "missed" ? "animate-bounce-subtle" : ""}
            `}>
              {pin.initials}
            </div>
            {/* Pin tail */}
            <div className={`w-0.5 h-2 ${
              pin.status === "completed"   ? "bg-[#10B981]" :
              pin.status === "in-progress" ? "bg-[#2563EB]" :
              pin.status === "late"        ? "bg-[#F59E0B]" :
                                             "bg-[#EF4444]"
            }`} />
          </div>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="w-7 h-7 bg-white border border-[#E4E5EA] rounded flex items-center justify-center text-[#111318] hover:bg-[#F5F6FA] shadow-sm"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
          className="w-7 h-7 bg-white border border-[#E4E5EA] rounded flex items-center justify-center text-[#111318] hover:bg-[#F5F6FA] shadow-sm"
        >
          <Minus size={14} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#E4E5EA] shadow-sm z-10">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[10px] text-[#6B7280]">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
