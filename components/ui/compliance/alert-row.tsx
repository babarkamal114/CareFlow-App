import { Badge } from "@/components/ui";
import { Calendar, ChevronRight, User } from "lucide-react";
import type { ComplianceAlert } from "types";
import { ALERT_SEVERITY_CONFIG, ALERT_TYPE_ICON, TONE_PANEL, TONE_TEXT } from "utils";

interface AlertRowProps {
  alert: ComplianceAlert;
  onSelect: (alert: ComplianceAlert) => void;
}

export function AlertRow({ alert, onSelect }: AlertRowProps) {
  const cfg = ALERT_SEVERITY_CONFIG[alert.severity];
  const StatusIcon = cfg.icon;
  const TypeIcon = ALERT_TYPE_ICON[alert.type];

  return (
    <button
      type="button"
      onClick={() => onSelect(alert)}
      className={`w-full rounded-lg border p-3 text-left transition-all hover:shadow-cf-xs ${TONE_PANEL[cfg.tone]}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex-shrink-0 rounded-lg border p-1.5 ${TONE_PANEL[cfg.tone]}`}>
          <TypeIcon className={`h-3.5 w-3.5 ${TONE_TEXT[cfg.tone]}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-cf-ink">{alert.title}</p>
            <Badge variant={cfg.badge} shape="pill" badgeSize="sm"><StatusIcon className="mr-1 h-2.5 w-2.5" />{cfg.label}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-cf-ink-60">{alert.description}</p>
          {alert.assignedTo && (
            <div className="mt-1.5 flex items-center gap-2 text-xs text-cf-ink-60">
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{alert.assignedTo}</span>
              {alert.dueLabel && (
                <>
                  <span className="text-cf-ink-40">•</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{alert.dueLabel}</span>
                </>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-cf-ink-40" />
      </div>
    </button>
  );
}
