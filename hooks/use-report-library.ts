"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getReportDataset } from "lib";
import { useMemo, useState } from "react";
import type { LibraryReport, ReportExportFormat, ReportRole } from "types";
import { canViewDataset } from "utils";
import { useReportExport } from "./use-report-export";
import { reportKeys, useLibraryReportsQuery, useReportDatasetsQuery } from "./use-reports-queries";

export function useReportLibrary(role: ReportRole) {
  const qc = useQueryClient();
  const libraryQ = useLibraryReportsQuery();
  const { exportReport, logRun } = useReportExport();
  const [runId, setRunId] = useState<string | null>(null);

  const reports = useMemo(() => (libraryQ.data ?? []).filter((r) => r.roles.includes(role)), [libraryQ.data, role]);
  const runReport = reports.find((r) => r.id === runId) ?? null;
  const { datasets, isLoading: datasetsLoading } = useReportDatasetsQuery(runReport?.datasetIds ?? []);
  const runDatasets = useMemo(() => datasets.filter((d) => canViewDataset(role, d)), [datasets, role]);

  /** Export without opening the report: fetch (or reuse cached) datasets, then export. */
  const exportFromCard = async (report: LibraryReport, format: ReportExportFormat) => {
    const all = await Promise.all(report.datasetIds.map((id) => qc.fetchQuery({ queryKey: reportKeys.dataset(id), queryFn: () => getReportDataset(id), staleTime: Infinity })));
    exportReport(format, report.title, all.filter((d) => canViewDataset(role, d)));
  };

  return {
    reports, isLoading: libraryQ.isLoading, runReport, runDatasets, datasetsLoading,
    openRun: (r: LibraryReport) => { setRunId(r.id); logRun(r.title); },
    closeRun: () => setRunId(null),
    exportRun: (format: ReportExportFormat) => runReport && exportReport(format, runReport.title, runDatasets),
    exportFromCard,
  };
}
