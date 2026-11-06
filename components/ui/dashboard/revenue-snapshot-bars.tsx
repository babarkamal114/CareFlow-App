import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import { formatCurrency, type DashboardRevenueBar } from "utils";

const BAR_CLASSES: Record<DashboardRevenueBar["key"], string> = {
  thisMonth: "bg-brand-500",
  lastMonth: "bg-cf-ink-20",
};

interface RevenueSnapshotBarsProps {
  bars: DashboardRevenueBar[];
}

/** This month vs last month, each bar sized against the larger month. */
export function RevenueSnapshotBars({ bars }: RevenueSnapshotBarsProps) {
  return (
    <ul className="space-y-3">
      {bars.map((bar) => (
        <li key={bar.key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-cf-ink-80">{bar.label}</span>
            <span className="font-semibold tabular-nums text-cf-ink">{formatCurrency(bar.value)}</span>
          </div>
          <Progress value={bar.widthPercent} aria-label={`${bar.label} revenue`} className="gap-0">
            <ProgressTrack>
              <ProgressIndicator className={BAR_CLASSES[bar.key]} />
            </ProgressTrack>
          </Progress>
        </li>
      ))}
    </ul>
  );
}