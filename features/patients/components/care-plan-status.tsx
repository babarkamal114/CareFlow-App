"use client";
// features/patients/components/care-plan-status.tsx
// Bottom-right panel: animated horizontal bars per care plan status

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Current",    count: 111, color: "bg-emerald-500", max: 111 },
  { label: "Review Due", count: 12,  color: "bg-amber-400",   max: 111 },
  { label: "Overdue",    count: 7,   color: "bg-red-500",     max: 111 },
  { label: "In Setup",   count: 8,   color: "bg-blue-400",    max: 111 },
  { label: "Paused",     count: 6,   color: "bg-gray-400",    max: 111 },
] as const;

export function CarePlanStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl border border-[#E4E5EA] p-4 flex-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-[#1A1D2E]">Care Plan Status</h3>
        <button className="text-[11px] font-medium text-[#0EA472] hover:underline">Manage</button>
      </div>

      <div className="flex flex-col gap-3">
        {ITEMS.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-[12px] text-[#4A4D63] w-20 flex-shrink-0">{item.label}</span>
            <div className="flex-1 h-2 bg-[#F0F1F5] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / item.max) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                className={cn("h-full rounded-full", item.color)}
              />
            </div>
            <span className="text-[12px] font-semibold text-[#1A1D2E] w-8 text-right flex-shrink-0">
              {item.count}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#B0B3C3] mt-4">
        Next review cycle: 10 April{" "}
        <span className="text-amber-500 font-semibold">· 12 due soon</span>
      </p>
    </motion.div>
  );
}
