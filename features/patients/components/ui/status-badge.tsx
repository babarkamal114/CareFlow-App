"use client";
// features/patients/components/ui/status-badge.tsx
// Pill badge for Active / On Hold / New / Discharged

import { cn } from "@/lib/utils";
import type { PatientStatus } from "../../schemas/patient.schema";

const CONFIG: Record<PatientStatus, { dot: string; text: string; bg: string }> = {
  Active:     { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  "On Hold":  { dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50"   },
  New:        { dot: "bg-blue-400",    text: "text-blue-700",    bg: "bg-blue-50"    },
  Discharged: { dot: "bg-gray-400",    text: "text-gray-600",    bg: "bg-gray-50"    },
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full",
        "text-[11px] font-semibold",
        cfg.bg, cfg.text,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {status}
    </span>
  );
}