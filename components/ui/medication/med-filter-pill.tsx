"use client";

import { Button } from "@/components/ui";
import { MED_TONE_PILL_ACTIVE, type MedTone } from "utils";

interface MedFilterPillProps { label: string; active: boolean; onClick: () => void; tone?: MedTone; count?: number }

export function MedFilterPill({ label, active, onClick, tone = "success", count }: MedFilterPillProps) {
  return (
    <Button
      variant="ghost" size="sm" onClick={onClick} aria-pressed={active}
      className={`h-auto rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active ? `${MED_TONE_PILL_ACTIVE[tone]} shadow-cf-xs` : "border-cf-border bg-cf-surface text-cf-ink-60 hover:border-brand-300 hover:bg-cf-surface-muted hover:text-cf-ink"
      }`}
    >
      {label}{count !== undefined && <span className="ml-1 opacity-80">{count}</span>}
    </Button>
  );
}
