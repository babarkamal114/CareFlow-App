// app/(dashboard)/_components/RevenuePanel.tsx
// Revenue — April financials: invoiced, collected, outstanding, payroll

import { ArrowUpRight } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  {
    label:    "INVOICED",
    value:    "£42,380",
    change:   "+8.2% vs March",
    changeOk: true,
    bg:       "bg-white",
  },
  {
    label:    "COLLECTED",
    value:    "£34,150",
    change:   "80.6% collection rate",
    changeOk: true,
    bg:       "bg-[#F0FDF8]",
  },
  {
    label:    "OUTSTANDING",
    value:    "£8,230",
    change:   "3 invoices overdue",
    changeOk: false,
    bg:       "bg-[#FFF4EC]",
  },
  {
    label:    "PAYROLL DUE",
    value:    "£28,400",
    change:   "Next run: 15 April",
    changeOk: null,   // neutral
    bg:       "bg-[#F5F3FF]",
  },
];

// ── Stat tile ─────────────────────────────────────────────────────────────────
function RevStat({ label, value, change, changeOk, bg }: {
  label: string; value: string; change: string; changeOk: boolean | null; bg: string;
}) {
  const changeColor =
    changeOk === true  ? "text-[#00A86B]" :
    changeOk === false ? "text-[#EF4444]" :
                         "text-[#8B8FA8]";

  return (
    <div className={`rounded-xl p-4 flex flex-col gap-1 ${bg} border border-[#E4E5EA]`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A0A3B1]">
        {label}
      </p>
      <p className="text-xl font-extrabold text-[#111318]">{value}</p>
      <p className={`text-[11px] font-medium ${changeColor}`}>{change}</p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function RevenuePanel() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Revenue — April</h2>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#00C48C] hover:underline">
          View Finance <ArrowUpRight size={12} />
        </button>
      </div>

      {/* 2×2 grid of stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <RevStat key={s.label} {...s} />
        ))}
      </div>

    </div>
  );
}
