"use client";

import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logReportActivity } from "lib";
import type { ReportDataset, ReportExportFormat } from "types";
import { REPORT_EXPORT_FORMAT_LABEL, exportReportDatasets } from "utils";
import { reportKeys } from "./use-reports-queries";

export function useReportExport() {
  const qc = useQueryClient();
  const log = useMutation({ mutationFn: logReportActivity, onSuccess: () => qc.invalidateQueries({ queryKey: reportKeys.activity }) });

  const exportReport = (format: ReportExportFormat, title: string, datasets: ReportDataset[]) => {
    if (datasets.length === 0) {
      toast.error("Nothing to export yet — the report has no data you can access.");
      return;
    }
    if (!exportReportDatasets(format, title, datasets)) {
      toast.error("Your browser blocked the PDF window. Allow pop-ups and try again.");
      return;
    }
    log.mutate({ action: "export", target: title, detail: REPORT_EXPORT_FORMAT_LABEL[format] });
    toast.success(`${title} exported (${REPORT_EXPORT_FORMAT_LABEL[format]})`);
  };

  return { exportReport, logRun: (title: string) => log.mutate({ action: "run", target: title }) };
}
