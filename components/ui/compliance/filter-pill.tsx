"use client";

import { Button } from "@/components/ui";
import { TONE_PILL_ACTIVE, type Tone } from "utils";

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: Tone;
}

/** Rounded filter chip. ghost + h-auto neutralises the shadcn button geometry. */
export function FilterPill({ label, active, onClick, tone = "success" }: FilterPillProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={`h-auto rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? `${TONE_PILL_ACTIVE[tone]} shadow-cf-xs`
          : "border-cf-border bg-cf-surface text-cf-ink-60 hover:border-brand-300 hover:bg-cf-surface-muted hover:text-cf-ink"
      }`}
    >
      {label}
    </Button>
  );
}
