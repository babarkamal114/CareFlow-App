"use client";

import { ReportWidget } from "@/components/ui";
import { useReportExport } from "hooks";
import { useReportDatasetsQuery } from "hooks";
import type { ReportDomain, ReportRole } from "types";
import { canViewDataset, REPORT_TAB_WIDGETS } from "utils";

export function ReportsDomainPanel({ domain, role }: { domain: ReportDomain; role: ReportRole }) {
  const widgets = REPORT_TAB_WIDGETS[domain];
  const { datasets, isLoading } = useReportDatasetsQuery(widgets.map((w) => w.datasetId));
  const { exportReport } = useReportExport();

  const visible = widgets.filter((w) => {
    const ds = datasets.find((d) => d.id === w.datasetId);
    return !ds || canViewDataset(role, ds);
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {visible.map((w) => (
        <div key={w.datasetId} className={w.span === 2 ? "lg:col-span-2" : undefined}>
          <ReportWidget dataset={datasets.find((d) => d.id === w.datasetId)} isLoading={isLoading && !datasets.find((d) => d.id === w.datasetId)} onExport={(format, ds) => exportReport(format, ds.title, [ds])} />
        </div>
      ))}
    </div>
  );
}
