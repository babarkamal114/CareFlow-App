import { Badge } from "@/components/ui";
import { ChevronRight } from "lucide-react";
import type { Regulation } from "types";
import { CATEGORY_STYLE, REG_STATUS_CONFIG, TONE_TEXT } from "utils";
import { StatusProgressBar } from "./status-progress-bar";

interface RegulationRowProps {
  reg: Regulation;
  onSelect: (reg: Regulation) => void;
  /** "key" = dashboard card (title + description), "full" = the View-all list (adds reg code + category). */
  variant?: "key" | "full";
}

export function RegulationRow({ reg, onSelect, variant = "key" }: RegulationRowProps) {
  const cfg = REG_STATUS_CONFIG[reg.status];

  return (
    <button
      type="button"
      onClick={() => onSelect(reg)}
      className={`group w-full rounded-xl border border-cf-border bg-cf-surface p-4 text-left transition-colors hover:bg-cf-surface-muted ${cfg.border}`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {variant === "full" && <span className="flex-shrink-0 text-xs font-bold text-cf-ink-40">{reg.reg}</span>}
        <span className="min-w-0 flex-1 text-sm font-semibold text-cf-ink transition-colors group-hover:text-brand-500">{reg.title}</span>
        {variant === "full" && (
          <span className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${CATEGORY_STYLE[reg.category]}`}>{reg.category}</span>
        )}
        <Badge variant={cfg.badge} badgeSize="sm" shape="pill" className="flex-shrink-0">{reg.status}</Badge>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-cf-ink-40 transition-colors group-hover:text-cf-ink" />
      </div>
      <p className="mb-2 text-xs text-cf-ink-60">{reg.description}</p>
      <div className="flex items-center gap-2">
        <StatusProgressBar value={reg.progress} tone={cfg.tone} />
        <span className={`flex-shrink-0 text-[11px] font-bold ${TONE_TEXT[cfg.tone]}`}>{reg.progress}%</span>
      </div>
    </button>
  );
}
