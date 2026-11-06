import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { InteractionWarning } from "types";

export function InteractionWarnings({ warnings }: { warnings: InteractionWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <ul className="space-y-1.5" aria-label="Interaction and allergy warnings">
      {warnings.map((w, i) => {
        const major = w.severity === "major";
        const Icon = w.kind === "allergy" ? ShieldAlert : AlertTriangle;
        return (
          <li key={`${w.message}-${i}`} className={`flex items-start gap-2 rounded-lg border p-2.5 text-xs ${major ? "border-error/20 bg-error-muted" : "border-warning/20 bg-warning-muted"}`}>
            <Icon className={`mt-0.5 size-3.5 flex-shrink-0 ${major ? "text-error" : "text-warning"}`} />
            <span className="text-cf-ink">
              <strong className={major ? "text-error" : "text-warning"}>{w.kind === "allergy" ? "Allergy" : `${major ? "Major" : "Moderate"} interaction`}</strong>
              {w.with ? <> with <strong>{w.with}</strong></> : null} — {w.message}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
