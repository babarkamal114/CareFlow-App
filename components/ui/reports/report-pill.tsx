"use client";

import { Button } from "@/components/ui";

interface ReportPillProps { label: string; active: boolean; onClick: () => void; count?: number }

export function ReportPill({ label, active, onClick, count }: ReportPillProps) {
  return (
    <Button
      variant="ghost" size="sm" onClick={onClick} aria-pressed={active}
      className={`h-auto rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active ? "border-success bg-success text-success-foreground shadow-cf-xs" : "border-cf-border bg-cf-surface text-cf-ink-60 hover:border-brand-300 hover:bg-cf-surface-muted hover:text-cf-ink"
      }`}
    >
      {label}{count !== undefined && <span className="ml-1 opacity-80">{count}</span>}
    </Button>
  );
}
