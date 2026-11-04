'use client'

import { getReportDataset } from "lib";
import { useState } from "react";
import type { LibraryReport, ReportDataset, ReportExportFormat, ReportRole } from "types";
import { canViewDataset } from "utils";
import { useReportExport } from "./use-report-export";
import { useLibraryReportsQuery, useReportDatasetsQuery } from "./use-reports-queries";

export interface UseReportLibraryReturn {
    reports: LibraryReport[];
    isLoading: boolean;
    runReport: LibraryReport | null;
    runDatasets: ReportDataset[];
    datasetsLoading: boolean;
    openRun: (report: LibraryReport) => void;
    closeRun: () => void;
    exportRun: (format: ReportExportFormat) => void;
    exportFromCard: (report: LibraryReport, format: ReportExportFormat) => Promise<void>;
}

export function useReportLibrary(role: ReportRole): UseReportLibraryReturn {
    const [runId, setRunId] = useState<string | null>(null)

    const { data, isLoading } = useLibraryReportsQuery()
    const { exportReport, logRun } = useReportExport()

    const reports = (data ?? []).filter((report) => report.roles.includes(role))
    const runReport = reports.find((report) => report.id === runId) ?? null

    const { datasets, isLoading: datasetsLoading } = useReportDatasetsQuery(runReport?.datasetIds ?? [])
    const runDatasets = datasets.filter((dataset) => canViewDataset(role, dataset))

    const openRun = (report: LibraryReport) => {
        setRunId(report.id)
        logRun(report.title)
    }

    const closeRun = () => {
        setRunId(null)
    }

    const exportRun = (format: ReportExportFormat) => {
        if (!runReport) return
        exportReport(format, runReport.title, runDatasets)
    }

    const exportFromCard = async (report: LibraryReport, format: ReportExportFormat) => {
        const all = await Promise.all(report.datasetIds.map((id) => getReportDataset(id)))
        const allowed = all.filter((dataset) => canViewDataset(role, dataset))
        exportReport(format, report.title, allowed)
    }

    return {
        reports,
        isLoading,
        runReport,
        runDatasets,
        datasetsLoading,
        openRun,
        closeRun,
        exportRun,
        exportFromCard
    }
}
