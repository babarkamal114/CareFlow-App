// app/(dashboard)/live-monitoring/_components/CarersOnShift.tsx
// Bottom panel: list of active carers with visit progress bars and status

"use client";

// ── Types ─────────────────────────────────────────────────────────────────────
type CarerStatus = "active" | "late" | "completed";

interface Carer {
  id: string;
  initials: string;
  color: string;        // avatar bg
  name: string;
  patient: string;
  done: number;         // visits done
  total: number;        // total visits today
  status: CarerStatus;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CARERS: Carer[] = [
  { id:"c1", initials:"PP", color:"bg-[#6366F1]", name:"Priya Patel",      patient:"Robert Ahmed",   done:42, total:60, status:"active" },
  { id:"c2", initials:"AK", color:"bg-[#10B981]", name:"Amara Kofi",       patient:"George Turner",  done:16, total:60, status:"active" },
  { id:"c3", initials:"MR", color:"bg-[#F59E0B]", name:"Maria Rodriguez",  patient:"Edna Morris",    done:10, total:60, status:"late"   },
  { id:"c4", initials:"JO", color:"bg-[#EF4444]", name:"James Okafor",     patient:"Dorothy Chen",   done:0,  total:60, status:"late"   },
  { id:"c5", initials:"SW", color:"bg-[#2563EB]", name:"Sarah Williams",   patient:"Margaret Johnson",done:32, total:60, status:"active" },
];

const STATUS_STYLE: Record<CarerStatus, string> = {
  active:    "text-[#10B981] bg-[#ECFDF5]",
  late:      "text-[#F59E0B] bg-[#FFFBEB]",
  completed: "text-[#6B7280] bg-[#F9FAFB]",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CarersOnShift() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-sm p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Carers on Shift</h2>
        <span className="text-[10px] font-semibold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
          {CARERS.length} active
        </span>
      </div>

      {/* Carer list */}
      <div className="flex flex-col gap-2">
        {CARERS.map((c) => {
          const pct = Math.round((c.done / c.total) * 100);
          return (
            <div key={c.id} className="flex items-center gap-3 hover:bg-[#FAFBFC] rounded-lg px-1 py-1 transition-colors cursor-pointer">
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${c.color}`}>
                {c.initials}
              </div>

              {/* Name + patient */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#111318] truncate">{c.name}</p>
                <p className="text-[10px] text-[#A0A3B1] truncate">{c.patient}</p>
              </div>

              {/* Progress bar */}
              <div className="w-20 flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-[#6B7280]">{c.done}m / {c.total}m</span>
                <div className="w-full h-1 bg-[#E4E5EA] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      c.status === "late" ? "bg-[#F59E0B]" : "bg-[#2563EB]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[c.status]}`}>
                {c.status === "active" ? "Active" : c.status === "late" ? "Late" : "Done"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
