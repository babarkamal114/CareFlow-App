'use client'

import { toast } from "@/components/ui";
import { useLogReportActivityApi } from "lib";
import type { ReportDataset, ReportExportFormat, UseReportExportReturn } from "types";
import { exportReportDatasets } from "app-utils/reports-export";
import { REPORT_EXPORT_FORMAT_LABEL } from "config";

export function useReportExport(): UseReportExportReturn {
    const { mutate: logActivity } = useLogReportActivityApi()

    const exportReport = (format: ReportExportFormat, title: string, datasets: ReportDataset[]) => {
        if (datasets.length === 0) {
            toast.error("Nothing to export yet — the report has no data you can access.")
            return
        }

        const opened = exportReportDatasets(format, title, datasets)
        if (!opened) {
            toast.error("Your browser blocked the PDF window. Allow pop-ups and try again.")
            return
        }

        logActivity({ action: "export", target: title, detail: REPORT_EXPORT_FORMAT_LABEL[format] })
        toast.success(`${title} exported (${REPORT_EXPORT_FORMAT_LABEL[format]})`)
    }

    const logRun = (title: string) => {
        logActivity({ action: "run", target: title })
    }

    return {
        exportReport,
        logRun
    }
}
