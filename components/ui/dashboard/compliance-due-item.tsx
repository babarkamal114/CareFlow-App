import Link from "next/link";
import { ChevronRight, ClipboardList, GraduationCap, ScrollText, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { cn } from "lib"; // NEW
import { Badge } from "@/components/ui";
import type { DashboardComplianceItem, DashboardComplianceKind } from "types";
import {
  DASHBOARD_DUE_URGENCY_BADGE,
  formatDashboardDueLabel,
  getDashboardDueUrgency,
} from "utils";

const KIND_ICONS: Record<DashboardComplianceKind, LucideIcon> = {
  dbs: ShieldCheck,
  training: GraduationCap,
  "care-plan-review": ClipboardList,
  supervision: Users,
  policy: ScrollText,
};

const DUE_HREFS: Record<DashboardComplianceKind, string> = {
  dbs: "/staff",
  training: "/staff",
  supervision: "/staff",
  "care-plan-review": "/care-plans",
  policy: "/compliance",
};

interface ComplianceDueItemProps {
  item: DashboardComplianceItem;
}

export function ComplianceDueItem({ item }: ComplianceDueItemProps) {
  const Icon = KIND_ICONS[item.kind];
  const urgency = getDashboardDueUrgency(item.dueInDays);
  const href = item.href ?? DUE_HREFS[item.kind];

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "-mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 transition-colors",
          "hover:bg-cf-surface-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-brand-500)]",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cf-surface-muted text-cf-ink-60">
          <Icon className="size-4" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-cf-ink">{item.title}</p>
          <p className="truncate text-xs text-cf-ink-60">{item.subject}</p>
        </div>

        <Badge variant={DASHBOARD_DUE_URGENCY_BADGE[urgency]} shape="pill">
          {formatDashboardDueLabel(item.dueInDays)}
        </Badge>

        <ChevronRight className="size-4 shrink-0 text-cf-ink-40" aria-hidden />
      </Link>
    </li>
  );
}