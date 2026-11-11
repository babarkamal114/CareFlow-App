import Link from "next/link";
import { Eye } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { CqcBreakdownBars } from "ui/dashboard/cqc-breakdown-bars";
import { CqcReadinessGauge } from "ui/dashboard/cqc-readiness-gauge";
import type { DashboardCqcDomain } from "types";
import type { DashboardCqcTrend } from "utils";

interface DashboardCqcSectionProps {
  score: number;
  trend: DashboardCqcTrend;
  domains: DashboardCqcDomain[];
}

export function DashboardCqcSection({ score, trend, domains }: DashboardCqcSectionProps) {
  return (
    <Card variant="elevated" className="h-full w-full gap-0 py-0">
      <div className="flex items-start justify-between gap-3 border-b border-cf-border-light px-4 py-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-cf-ink">CQC Readiness</h2>
          <p className="text-xs text-cf-ink-60">Overall compliance across the five key questions</p>
        </div>
        {/* NEW */}
        <Button variant="ghost" size="sm" className="shrink-0" nativeButton={false} render={<Link href="/compliance" />}>
          <Eye />
          View compliance
        </Button>
      </div>
      <div className="flex flex-col items-center gap-6 p-4">
        <CqcReadinessGauge score={score} trend={trend} />
        <div className="w-full">
          <CqcBreakdownBars domains={domains} />
        </div>
      </div>
    </Card>
  );
}