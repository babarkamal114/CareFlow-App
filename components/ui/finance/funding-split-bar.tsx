import type { FundingSource, RevenueByFunding } from "types";
import { formatCurrency, formatPercent, FUNDING_SOURCE_LABEL } from "utils";

// Segment colours come from the chart tokens in globals.css (--chart-1..3).
const SEGMENT_CLASS: Record<FundingSource, string> = {
  "local-authority": "bg-chart-1",
  "nhs-chc": "bg-chart-2",
  private: "bg-chart-3",
};

interface FundingSplitBarProps {
  data: RevenueByFunding[];
}

/** Stacked bar + legend showing how invoiced revenue splits across funders. */
export function FundingSplitBar({ data }: FundingSplitBarProps) {
  const total = data.reduce((sum, d) => sum + d.invoiced, 0);

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-cf-surface-muted" role="img" aria-label="Revenue split by funding source">
        {data.map((d) => (
          <div
            key={d.fundingSource}
            className={SEGMENT_CLASS[d.fundingSource]}
            style={{ width: `${total > 0 ? (d.invoiced / total) * 100 : 0}%` }}
          />
        ))}
      </div>

      <ul className="space-y-3">
        {data.map((d) => (
          <li key={d.fundingSource} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${SEGMENT_CLASS[d.fundingSource]}`} aria-hidden />
              <span className="text-sm font-medium text-cf-ink">{FUNDING_SOURCE_LABEL[d.fundingSource]}</span>
            </div>
            <div className="flex items-baseline gap-3 text-sm">
              <span className="tabular-nums text-cf-ink-60">{formatPercent(total > 0 ? (d.invoiced / total) * 100 : 0)}</span>
              <span className="w-24 text-right font-semibold tabular-nums text-cf-ink">{formatCurrency(d.invoiced, true)}</span>
              {d.overdue > 0 && (
                <span className="w-24 text-right text-xs font-semibold text-destructive">{formatCurrency(d.overdue, true)} overdue</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}