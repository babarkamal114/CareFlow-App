"use client";
// features/patients/components/patient-stats-cards.tsx
// 4 KPI cards: Total Patients, Active, New This Month, High Risk

import { motion } from "framer-motion";
import { Users, Activity, UserPlus, AlertTriangle } from "lucide-react";

// Decorative sparkline — rising trend
function Sparkline({ color = "#10b981" }: { color?: string }) {
  return (
    <svg width="72" height="28" viewBox="0 0 72 28" fill="none">
      <polyline
        points="0,22 14,18 24,20 36,12 48,14 60,6 72,8"
        stroke={color} strokeWidth="1.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.6"
      />
    </svg>
  );
}

// Decorative sparkline — declining trend (high risk)
function SparklineDown({ color = "#ef4444" }: { color?: string }) {
  return (
    <svg width="72" height="28" viewBox="0 0 72 28" fill="none">
      <polyline
        points="0,8 14,10 24,8 36,14 48,12 60,18 72,20"
        stroke={color} strokeWidth="1.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.6"
      />
    </svg>
  );
}

interface CardProps {
  index: number;
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: React.ReactNode;
  chart: React.ReactNode;
}

function StatCard({ index, iconBg, icon, label, value, sub, chart }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="flex-1 min-w-0 bg-white rounded-xl border border-[#E4E5EA] px-5 py-4
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="opacity-70">{chart}</div>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8B8FA8] mb-1">
        {label}
      </p>
      <p className="text-[28px] font-bold text-[#1A1D2E] leading-tight mb-1">{value}</p>
      <div className="text-[11px] text-[#8B8FA8]">{sub}</div>
    </motion.div>
  );
}

export function PatientStatsCards() {
  return (
    <div className="flex gap-4">
      <StatCard index={0} iconBg="bg-[#EBF9F3]"
        icon={<Users className="w-4 h-4 text-[#0EA472]" />}
        label="Total Patients" value={142}
        chart={<Sparkline />}
        sub={<span>this month <span className="text-[#0EA472] font-semibold">+6</span></span>}
      />
      <StatCard index={1} iconBg="bg-[#EEF4FF]"
        icon={<Activity className="w-4 h-4 text-[#3B82F6]" />}
        label="Active" value={126}
        chart={<Sparkline color="#3B82F6" />}
        sub={<span>10 on · 5 discharged</span>}
      />
      <StatCard index={2} iconBg="bg-[#F0FDF4]"
        icon={<UserPlus className="w-4 h-4 text-[#22C55E]" />}
        label="New This Month" value={6}
        chart={<Sparkline color="#22c55e" />}
        sub={<span><span className="text-amber-500 font-semibold">2 pending setup</span><br />4 fully onboarded</span>}
      />
      <StatCard index={3} iconBg="bg-[#FFF5F5]"
        icon={<AlertTriangle className="w-4 h-4 text-[#EF4444]" />}
        label="High Risk" value={8}
        chart={<SparklineDown />}
        sub={<span>2 at risk · 3 medication · 1 safeguarding</span>}
      />
    </div>
  );
}
