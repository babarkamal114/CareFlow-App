"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import { useState } from "react";
import type { ReportDataset, ReportExportFormat } from "types";
import { ReportDatasetView } from "./report-dataset-view";
import { ReportExportMenu } from "./report-export-menu";

interface ReportWidgetProps { dataset: ReportDataset | undefined; isLoading: boolean; onExport: (format: ReportExportFormat, dataset: ReportDataset) => void }

/** One dashboard card: title, source, chart / table toggle and a per-widget export. */
export function ReportWidget({ dataset, isLoading, onExport }: ReportWidgetProps) {
  const [mode, setMode] = useState<"chart" | "table">("chart");
  if (isLoading || !dataset) return <Skeleton className="h-80 rounded-2xl" />;
  const hasChart = dataset.chart.kind !== "table";

  return (
    <Card className="h-full rounded-2xl border-cf-border-light shadow-cf-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="font-bold text-cf-ink">{dataset.title}</CardTitle>
            <p className="mt-0.5 text-xs text-cf-ink-60">{dataset.description}</p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            {hasChart && (
              <div className="flex rounded-lg border border-cf-border p-0.5" role="group" aria-label="View">
                {(["chart", "table"] as const).map((m) => (
                  <Button key={m} variant={mode === m ? "default" : "ghost"} size="xs" aria-pressed={mode === m} onClick={() => setMode(m)} className="capitalize">{m}</Button>
                ))}
              </div>
            )}
            <ReportExportMenu compact onSelect={(f) => onExport(f, dataset)} />
          </div>
        </div>
        <Badge variant="pastel-neutral" shape="pill" badgeSize="sm" className="mt-1 w-fit">{dataset.source}</Badge>
      </CardHeader>
      <CardContent>
        <ReportDatasetView columns={dataset.columns} rows={dataset.rows} chart={dataset.chart} mode={mode} />
      </CardContent>
    </Card>
  );
}
