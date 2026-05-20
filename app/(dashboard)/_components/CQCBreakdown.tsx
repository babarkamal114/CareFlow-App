// app/(dashboard)/_components/CQCBreakdown.tsx
// CQC Breakdown — horizontal progress bars for the 5 CQC domains

// ── Data ──────────────────────────────────────────────────────────────────────
const domains = [
  { label: "Safe",        score: 80, color: "#00C48C" },
  { label: "Effective",   score: 85, color: "#00C48C" },
  { label: "Caring",      score: 92, color: "#00C48C" },
  { label: "Responsive",  score: 62, color: "#F59E0B" }, // amber — below threshold
  { label: "Well-led",    score: 88, color: "#00C48C" },
];

// ── Progress bar row ──────────────────────────────────────────────────────────
function DomainRow({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      {/* Label + score */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#5C5F6A]">{label}</span>
        <span className="text-xs font-semibold text-[#111318]">{score}</span>
      </div>

      {/* Track + fill */}
      <div className="h-2 w-full rounded-full bg-[#F0F1F5] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CQCBreakdown() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">CQC Breakdown</h2>
        <button className="text-xs font-semibold text-[#00C48C] hover:underline">
          Details
        </button>
      </div>

      {/* Domain rows */}
      <div className="space-y-3.5">
        {domains.map((d) => (
          <DomainRow key={d.label} {...d} />
        ))}
      </div>

      {/* Overall note */}
      <p className="text-[11px] text-[#A0A3B1] mt-auto">
        Overall CQC score: <span className="font-semibold text-[#111318]">87/100</span>
        &nbsp;· +4 this month
      </p>

    </div>
  );
}
