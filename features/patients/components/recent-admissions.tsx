"use client";
// features/patients/components/recent-admissions.tsx
// Bottom-center panel: list of recently admitted patients

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PatientAvatar } from "./ui/patient-avatar";

const ADMISSIONS = [
  { id: "ra1", initials: "RP", name: "Ruth Parkinson",  meta: "Today, 10 Apr · Private fee",    badge: "Setup"  },
  { id: "ra2", initials: "JL", name: "Joan Lewis",      meta: "Yesterday, 9 Apr · 1.4 funded",  badge: "Setup"  },
  { id: "ra3", initials: "PC", name: "Peter Crawford",  meta: "8 Apr · CHC funded",             badge: "Active" },
  { id: "ra4", initials: "MS", name: "Mary Stephens",   meta: "7 Apr · 14-hour pay",            badge: "Active" },
] as const;

export function RecentAdmissions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-white rounded-xl border border-[#E4E5EA] p-4 flex-1"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold text-[#1A1D2E]">Recent Admissions</h3>
        <button className="text-[11px] font-medium text-[#0EA472] hover:underline">View All</button>
      </div>

      <div>
        {ADMISSIONS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="flex items-center gap-3 py-2.5 border-b border-[#F0F1F5] last:border-0
                       hover:bg-[#F8F9FB] rounded-lg px-1 transition-colors cursor-pointer"
          >
            <PatientAvatar initials={item.initials} displayName={item.name} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#1A1D2E] truncate">{item.name}</p>
              <p className="text-[10px] text-[#B0B3C3] truncate">{item.meta}</p>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0",
              item.badge === "Setup"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200",
            )}>
              {item.badge}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
