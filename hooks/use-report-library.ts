'use client'

import { toast } from "@/components/ui";
import { getReportDataset } from "lib";
import { useState } from "react";
import type {
  LibraryReport,
  ReportExportFormat,
  ReportRole,
  UseReportLibraryReturn,
} from "types";
import { canViewDataset } from "app-utils/reports";
import { useReportExport } from "./use-report-export";
import { useLibraryReportsQuery, useReportDatasetsQuery } from "./use-reports-queries";

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
        try {
            const all = await Promise.all(report.datasetIds.map((id) => getReportDataset(id)))
            const allowed = all.filter((dataset) => canViewDataset(role, dataset))
            exportReport(format, report.title, allowed)
        } catch {
            toast.error("Could not load the report data. Try again.")
        }
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
