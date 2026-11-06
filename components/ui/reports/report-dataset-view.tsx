"use client";

import type { ReportDatasetViewProps } from "types";
import { ReportChart } from "./report-chart";
import { ReportTable } from "./report-table";

export function ReportDatasetView({ columns, rows, chart, mode }: ReportDatasetViewProps) {
  const showChart = chart.kind !== "table" && (mode === "chart" || mode === "both");
  const showTable = chart.kind === "table" || mode === "table" || mode === "both";
  return (
    <div className="space-y-3">
      {showChart && <ReportChart columns={columns} rows={rows} chart={chart} />}
      {showTable && <ReportTable columns={columns} rows={rows} />}
    </div>
  );
}
