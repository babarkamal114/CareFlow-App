import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Badge, Card, RevenueSnapshotBars } from "@/components/ui";
import type { BadgeProps } from "@/components/ui";
import type { DashboardRevenueSnapshot } from "types";
import {
  formatCurrency,
  pluralize,
  type DashboardRevenueBar,
  type DashboardRevenueChange,
  type DashboardTrendDirection,
} from "utils";

const CHANGE_ICON = { up: ArrowUp, down: ArrowDown, neutral: Minus } as const;

const CHANGE_BADGE: Record<DashboardTrendDirection, NonNullable<BadgeProps["variant"]>> = {
  up: "softSuccess",
  down: "softDanger",
  neutral: "softMuted",
};

interface DashboardRevenueSectionProps {
  snapshot: DashboardRevenueSnapshot;
  change: DashboardRevenueChange;
  bars: DashboardRevenueBar[];
}

/** This month's invoiced revenue against last month, plus what is still outstanding. */
export function DashboardRevenueSection({ snapshot, change, bars }: DashboardRevenueSectionProps) {
  const ChangeIcon = CHANGE_ICON[change.direction];

  return (
    <Card variant="elevated" className="h-full gap-0 py-0">
      <div className="border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-cf-ink">Revenue Snapshot</h2>
        <p className="text-xs text-cf-ink-60">Invoiced this month vs last month</p>
      </div>

      <div className="space-y-5 p-4">
        <div className="flex items-end gap-2">
          <p className="font-heading text-3xl font-bold leading-none text-cf-ink">
            {formatCurrency(snapshot.thisMonth)}
          </p>
          <Badge variant={CHANGE_BADGE[change.direction]} shape="pill" badgeSize="md">
            <ChangeIcon className="size-3.5" aria-hidden />
            {change.direction === "neutral" ? "No change" : `${change.percent}%`}
          </Badge>
        </div>

        <RevenueSnapshotBars bars={bars} />

        <dl className="space-y-2 border-t border-cf-border-light pt-4 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-cf-ink-80">
              Outstanding
              <span className="ml-1.5 text-xs text-cf-ink-60">
                {snapshot.outstandingInvoiceCount} {pluralize(snapshot.outstandingInvoiceCount, "invoice")}
              </span>
            </dt>
            <dd className="font-semibold tabular-nums text-cf-ink">{formatCurrency(snapshot.outstanding)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-cf-ink-80">
              Overdue
              <span className="ml-1.5 text-xs text-cf-ink-60">
                {snapshot.overdueInvoiceCount} {pluralize(snapshot.overdueInvoiceCount, "invoice")}
              </span>
            </dt>
            <dd
              className={
                snapshot.overdue > 0
                  ? "font-semibold tabular-nums text-destructive"
                  : "font-semibold tabular-nums text-cf-ink"
              }
            >
              {formatCurrency(snapshot.overdue)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}