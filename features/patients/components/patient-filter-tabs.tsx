"use client";
// features/patients/components/patient-filter-tabs.tsx
// Pill tabs: All / Active / On Hold / High Risk / Review Due / New
// + More Filters / Sort / Export on the right

import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterTab = "All" | "Active" | "On Hold" | "High Risk" | "Review Due" | "New";

const TABS: { label: FilterTab; count: number }[] = [
  { label: "All",        count: 142 },
  { label: "Active",     count: 126 },
  { label: "On Hold",    count: 10  },
  { label: "High Risk",  count: 8   },
  { label: "Review Due", count: 11  },
  { label: "New",        count: 6   },
];

interface PatientFilterTabsProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

export function PatientFilterTabs({ active, onChange }: PatientFilterTabsProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-lg p-1">
        {TABS.map((tab) => {
          const isActive = active === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => onChange(tab.label)}
              className={cn(
                "relative px-3 py-1.5 rounded-md text-[12px] font-medium",
                "flex items-center gap-1.5 transition-colors duration-150",
                isActive ? "text-[#1A1D2E]" : "text-[#8B8FA8] hover:text-[#1A1D2E]",
              )}
            >
              {/* Sliding background */}
              {isActive && (
                <motion.div
                  layoutId="patient-tab-bg"
                  className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.label}
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                isActive ? "bg-[#F4F5F7] text-[#8B8FA8]" : "text-[#C0C3D3]",
              )}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {[
          { icon: SlidersHorizontal, label: "More Filters" },
          { icon: ArrowUpDown,       label: "Sort"         },
          { icon: Download,          label: "Export"       },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                       border-[#E4E5EA] text-[12px] font-medium text-[#4A4D63]
                       hover:bg-[#F4F5F7] transition-colors duration-150"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
