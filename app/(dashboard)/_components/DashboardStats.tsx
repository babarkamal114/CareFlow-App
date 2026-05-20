// app/(dashboard)/_components/DashboardStats.tsx
// Four top-level KPI cards: Visits Today, Active Carers, Alerts, CQC Readings

import { CheckCircle2, Users, AlertTriangle, Activity } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  badge?: { text: string; color: string };     // e.g. "▲ 96%"  or "2 critical"
  sub?: string;                                 // secondary note below value
  accent?: string;                             // right-side accent text
  accentColor?: string;
}

// ── Small reusable card ────────────────────────────────────────────────────────
function StatCard({
  icon, iconBg, label, value, badge, sub, accent, accentColor,
}: StatCardProps) {
  return (
    <div className="
      bg-white rounded-xl border border-[#E4E5EA]
      shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3
    ">
      {/* Top row: icon + label + optional trend sparkline placeholder */}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {/* Tiny trend line (SVG placeholder matching design) */}
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none" className="opacity-40">
          <polyline
            points="0,20 16,14 32,16 48,8 64,4"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            className="text-[#00C48C]"
          />
        </svg>
      </div>

      {/* Label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8B8FA8]">
        {label}
      </p>

      {/* Big number */}
      <div className="flex items-end gap-2">
        <span className="text-[32px] font-extrabold leading-none text-[#111318]">
          {value}
        </span>
        {badge && (
          <span className={`text-xs font-semibold mb-1 ${badge.color}`}>
            {badge.text}
          </span>
        )}
        {accent && (
          <span className={`text-xs font-medium mb-1 ${accentColor}`}>
            {accent}
          </span>
        )}
      </div>

      {/* Sub note */}
      {sub && (
        <p className="text-[11px] text-[#A0A3B1] -mt-1">{sub}</p>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

      {/* Visits Today */}
      <StatCard
        icon={<CheckCircle2 size={18} className="text-[#00C48C]" />}
        iconBg="bg-[#E6FAF4]"
        label="Visits Today"
        value={127}
        badge={{ text: "▲ 96%", color: "text-[#00C48C]" }}
        sub="90 completed · 28 in progress"
      />

      {/* Active Carers */}
      <StatCard
        icon={<Users size={18} className="text-[#3B82F6]" />}
        iconBg="bg-[#EFF6FF]"
        label="Active Carers"
        value={23}
        accent="• Live"
        accentColor="text-[#3B82F6]"
        sub="+17 off total · 6 on leave"
      />

      {/* Alerts */}
      <StatCard
        icon={<AlertTriangle size={18} className="text-[#F97316]" />}
        iconBg="bg-[#FFF4EC]"
        label="Alerts"
        value={7}
        badge={{ text: "2 critical", color: "text-[#EF4444]" }}
        sub="Timed out · 1 Safeguarding"
      />

      {/* CQC Readings */}
      <StatCard
        icon={<Activity size={18} className="text-[#00C48C]" />}
        iconBg="bg-[#E6FAF4]"
        label="CQC Readings"
        value="87/100"
        badge={{ text: "+4 this month", color: "text-[#00C48C]" }}
      />

    </div>
  );
}
