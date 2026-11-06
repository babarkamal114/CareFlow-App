import { Card, CqcBreakdownBars, CqcReadinessGauge } from "@/components/ui";
import type { DashboardCqcDomain } from "types";
import type { DashboardCqcTrend } from "utils";

interface DashboardCqcSectionProps {
  score: number;
  trend: DashboardCqcTrend;
  domains: DashboardCqcDomain[];
}

/** CQC readiness gauge with a trend, plus the score for each of the five key questions. */
export function DashboardCqcSection({ score, trend, domains }: DashboardCqcSectionProps) {
  return (
    <Card variant="elevated" className="h-full w-full gap-0 py-0">
      <div className="border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-cf-ink">CQC Readiness</h2>
        <p className="text-xs text-cf-ink-60">Overall compliance across the five key questions</p>
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