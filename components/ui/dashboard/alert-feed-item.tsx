import Link from "next/link"; // NEW
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

const PRIORITY_LABELS: Record<DashboardAlertPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

const ALERT_HREFS: Record<DashboardAlertType, string> = {
  "missed-visit": "/scheduling?status=missed",
  "late-carer": "/live-monitoring",
  safeguarding: "/incidents",
  "care-plan-overdue": "/care-plans?status=overdue",
  "unsigned-document": "/compliance",
  "dbs-expiring": "/staff",
};

interface AlertFeedItemProps {
  alert: DashboardAlert;
}

export function AlertFeedItem({ alert }: AlertFeedItemProps) {
  const Icon = ALERT_ICONS[alert.type];
  const href = alert.href ?? ALERT_HREFS[alert.type];

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "-mx-2 flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 transition-colors",
          "hover:bg-cf-surface-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-brand-500)]",
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            PRIORITY_TILE_CLASSES[alert.priority],
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-cf-ink">
            <span className="sr-only">{PRIORITY_LABELS[alert.priority]}: </span>
            {alert.title}
          </p>
          <p className="text-xs text-cf-ink-80">{alert.subject}</p>
          <p className="text-xs text-cf-ink-60">{alert.detail}</p>
        </div>

        <span className="shrink-0 text-xs tabular-nums text-cf-ink-60">
          {formatDashboardTimeAgo(alert.minutesAgo)}
          <span className="sr-only"> ago</span>
        </span>
      </Link>
    </li>
  );
}