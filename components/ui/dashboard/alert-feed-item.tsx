import {
  CalendarClock,
  Clock,
  FileSignature,
  FileText,
  ShieldAlert,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { cn } from "lib";
import type { DashboardAlert, DashboardAlertPriority, DashboardAlertType } from "types";
import { formatDashboardTimeAgo } from "utils";

const ALERT_ICONS: Record<DashboardAlertType, LucideIcon> = {
  "missed-visit": Clock,
  "late-carer": UserX,
  safeguarding: ShieldAlert,
  "care-plan-overdue": FileText,
  "unsigned-document": FileSignature,
  "dbs-expiring": CalendarClock,
};

const PRIORITY_TILE_CLASSES: Record<DashboardAlertPriority, string> = {
  high: "bg-cf-red-50 text-destructive",
  medium: "bg-cf-amber-50 text-cf-amber-500",
  low: "bg-cf-surface-muted text-cf-ink-60",
};

interface AlertFeedItemProps {
  alert: DashboardAlert;
}

/** One row in the "Needs attention" feed. Render inside a <ul>. */
export function AlertFeedItem({ alert }: AlertFeedItemProps) {
  const Icon = ALERT_ICONS[alert.type];

  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          PRIORITY_TILE_CLASSES[alert.priority],
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-cf-ink">{alert.title}</p>
        <p className="text-xs text-cf-ink-80">{alert.subject}</p>
        <p className="text-xs text-cf-ink-60">{alert.detail}</p>
      </div>

      <span className="shrink-0 text-xs tabular-nums text-cf-ink-60">
        {formatDashboardTimeAgo(alert.minutesAgo)}
        <span className="sr-only"> ago</span>
      </span>
    </li>
  );
}