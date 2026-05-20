// app/(dashboard)/_components/TodaysVisits.tsx
// Today's Visits — scrollable table with patient, carer, time, status, duration

import { ChevronRight, Filter } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const visits = [
  { initials:"MJ", color:"bg-[#6366F1]", patient:"Margaret Johnson", type:"Personal care",      carer:"Sarah W.", time:"08:00–08:30", status:"done",      duration:"32m" },
  { initials:"RA", color:"bg-[#3B82F6]", patient:"Robert Ahmed",     type:"Medication + meal",  carer:"Priya P.", time:"08:00–08:50", status:"active",    duration:"42m" },
  { initials:"DC", color:"bg-[#F97316]", patient:"Dorothy Chen",     type:"Personal care",      carer:"James O.", time:"08:30–09:00", status:"missed",    duration:"—"   },
  { initials:"BW", color:"bg-[#8B5CF6]", patient:"Barbara Williams", type:"Emotional support",  carer:"Fatima K.",time:"10:50–11:00", status:"scheduled", duration:"50m" },
  { initials:"HS", color:"bg-[#10B981]", patient:"Henry Smith",      type:"Evening medication", carer:"Lucy C.",  time:"11:00–11:30", status:"scheduled", duration:"30m" },
  { initials:"EM", color:"bg-[#EC4899]", patient:"Edna Morris",      type:"Continence care",    carer:"Sarah W.", time:"11:00–11:30", status:"done",      duration:"26m" },
];

// ── Status pill helper ─────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    done:      "bg-[#E6FAF4] text-[#00A86B]",
    active:    "bg-[#DBEAFE] text-[#2563EB]",
    missed:    "bg-[#FEE2E2] text-[#DC2626]",
    scheduled: "bg-[#F1F5F9] text-[#64748B]",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${map[status]}`}>
      • {status}
    </span>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TodaysVisits() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">

      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F1F5]">
        <h2 className="text-sm font-bold text-[#111318]">Today's Visits</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs text-[#8B8FA8] hover:text-[#111318] transition-colors">
            <Filter size={12} /> Filter
          </button>
          <button className="text-xs font-semibold text-[#00C48C] hover:underline">
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[#A0A3B1] uppercase tracking-widest text-[10px]">
              <th className="px-5 py-3 text-left font-semibold">Patient</th>
              <th className="px-4 py-3 text-left font-semibold">Carer</th>
              <th className="px-4 py-3 text-left font-semibold">Time</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Duration</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F6FA]">
            {visits.map((v) => (
              <tr key={v.patient} className="hover:bg-[#FAFBFC] transition-colors cursor-pointer">

                {/* Patient */}
                <td className="px-5 py-3 flex items-center gap-2.5 min-w-[160px]">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${v.color}`}>
                    {v.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-[#111318]">{v.patient}</p>
                    <p className="text-[#A0A3B1] text-[10px]">{v.type}</p>
                  </div>
                </td>

                {/* Carer */}
                <td className="px-4 py-3 text-[#5C5F6A]">{v.carer}</td>

                {/* Time */}
                <td className="px-4 py-3 text-[#5C5F6A] tabular-nums">{v.time}</td>

                {/* Status */}
                <td className="px-4 py-3"><StatusPill status={v.status} /></td>

                {/* Duration */}
                <td className="px-4 py-3 text-[#5C5F6A] tabular-nums">{v.duration}</td>

                {/* Chevron */}
                <td className="px-4 py-3 text-[#D1D5DB]">
                  <ChevronRight size={14} />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
