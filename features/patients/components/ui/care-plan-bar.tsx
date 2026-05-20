"use client";
// features/patients/components/ui/care-plan-bar.tsx
// 4-segment progress bar showing care plan completion status

import { cn } from "@/lib/utils";
import type { CarePlanStatus } from "../../schemas/patient.schema";

const CONFIG: Record<CarePlanStatus, { filled: number; color: string }> = {
  Current:      { filled: 4, color: "bg-emerald-500" },
  "Review Due": { filled: 3, color: "bg-amber-400"   },
  Overdue:      { filled: 2, color: "bg-red-500"     },
  "In Setup":   { filled: 1, color: "bg-blue-400"    },
  Paused:       { filled: 2, color: "bg-gray-300"    },
};

const TOTAL = 4;

export function CarePlanBar({ status }: { status: CarePlanStatus }) {
  const cfg = CONFIG[status];
  return (
    <div className="flex flex-col gap-1 min-w-[72px]">
      {/* Segmented bar */}
      <div className="flex gap-0.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < cfg.filled ? cfg.color : "bg-[#E4E5EA]",
            )}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium text-[#8B8FA8]">{status}</span>
    </div>
  );
}
