"use client";
// features/patients/components/ui/risk-badge.tsx
// Colored dot + label for Low / Medium / High risk levels

import { cn } from "@/lib/utils";
import type { RiskLevel } from "../../schemas/patient.schema";

const CONFIG: Record<RiskLevel, { dot: string; text: string }> = {
  Low:    { dot: "bg-emerald-500", text: "text-emerald-700" },
  Medium: { dot: "bg-amber-400",   text: "text-amber-700"   },
  High:   { dot: "bg-red-500",     text: "text-red-600"     },
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cfg = CONFIG[risk];
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
      <span className={cn("text-[12px] font-medium", cfg.text)}>{risk}</span>
    </span>
  );
}
