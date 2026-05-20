// app/(dashboard)/_components/ComplianceDue.tsx
// Compliance Due — upcoming compliance tasks with urgency indicators

import { ShieldAlert, BadgeCheck, FileText, ClipboardList } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const items = [
  {
    icon: <ShieldAlert size={14} />,
    iconBg: "bg-[#FEE2E2] text-[#EF4444]",
    title: "Safeguarding training",
    sub:   "Mark Child · Updated 28 ago",
    urgency: "overdue",
    label: "Overdue",
  },
  {
    icon: <BadgeCheck size={14} />,
    iconBg: "bg-[#FFF4EC] text-[#F97316]",
    title: "DBS renewal",
    sub:   "Lucy Chen · 14 days",
    urgency: "soon",
    label: "14 days",
  },
  {
    icon: <FileText size={14} />,
    iconBg: "bg-[#EFF6FF] text-[#3B82F6]",
    title: "Care plan reviews",
    sub:   "3 patients · Due by 10 Apr",
    urgency: "due",
    label: "Due",
  },
  {
    icon: <ClipboardList size={14} />,
    iconBg: "bg-[#F5F3FF] text-[#7C3AED]",
    title: "Supervisions due",
    sub:   "5 staff · By 15 April",
    urgency: "due",
    label: "Due",
  },
];

// Urgency badge colours
const urgencyMap: Record<string, string> = {
  overdue: "bg-[#FEE2E2] text-[#EF4444]",
  soon:    "bg-[#FFF4EC] text-[#F97316]",
  due:     "bg-[#EFF6FF] text-[#2563EB]",
};

// ── Main export ───────────────────────────────────────────────────────────────
export default function ComplianceDue() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Compliance Due</h2>
        <span className="text-[10px] text-[#A0A3B1]">Next 14 days</span>
      </div>

      {/* Item list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 p-3 rounded-lg bg-[#FAFBFC] hover:bg-[#F5F6FA] transition-colors cursor-pointer"
          >
            {/* Icon bubble */}
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
              {item.icon}
            </span>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111318] truncate">{item.title}</p>
              <p className="text-[11px] text-[#A0A3B1] truncate">{item.sub}</p>
            </div>

            {/* Urgency badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${urgencyMap[item.urgency]}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
