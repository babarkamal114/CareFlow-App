'use client'

import { toast } from "@/components/ui";
import { REPORTS_MOCK_NOW, useDeleteReportScheduleApi, useSaveReportScheduleApi, useSetReportScheduleStatusApi } from "lib";
import { useState } from "react";
import type {
  ReportSchedule,
  ReportScheduleFormData,
  ScheduleDialogState,
  UseScheduledReportsReturn,
} from "types";
import { useLibraryReportsQuery, useReportSchedulesQuery } from "./use-reports-queries";

export function useScheduledReports(): UseScheduledReportsReturn {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogReportId, setDialogReportId] = useState<string | null>(null)
    const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<ReportSchedule | null>(null)

    const schedulesQ = useReportSchedulesQuery()
    const libraryQ = useLibraryReportsQuery()

    const { mutate: saveSchedule, isPending: isSaving } = useSaveReportScheduleApi({
        onSuccess: (_response, variables) => {
            closeDialog()
            toast.success(variables.id ? "Schedule updated" : "Report scheduled")
        },
        onError: () => toast.error("Could not save the schedule.")
    })

    const { mutate: setStatus } = useSetReportScheduleStatusApi({
        onSuccess: (_response, variables) => {
            toast.success(variables.status === "paused" ? "Schedule paused" : "Schedule resumed")
        },
        onError: () => toast.error("Could not update the schedule.")
    })

    const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteReportScheduleApi({
        onSuccess: () => {
            setDeleteTarget(null)
            toast.success("Schedule deleted")
        },
        onError: () => toast.error("Could not delete the schedule.")
    })

    const reports = libraryQ.data ?? []
    const schedules = schedulesQ.data ?? []
    const dialog: ScheduleDialogState = { open: dialogOpen, reportId: dialogReportId, schedule: editingSchedule }

    const reportTitle = (id: string) => {
        return reports.find((report) => report.id === id)?.title ?? id
    }

    const openCreate = (reportId?: string) => {
        setDialogReportId(reportId ?? null)
        setEditingSchedule(null)
        setDialogOpen(true)
    }

    const openEdit = (schedule: ReportSchedule) => {
        setDialogReportId(schedule.reportId)
        setEditingSchedule(schedule)
        setDialogOpen(true)
    }

    function closeDialog() {
        setDialogOpen(false)
        setDialogReportId(null)
        setEditingSchedule(null)
    }

    const submit = (data: ReportScheduleFormData) => {
        saveSchedule({ id: editingSchedule?.id, data })
    }

    const toggleStatus = (schedule: ReportSchedule) => {
        const nextStatus = schedule.status === "active" ? "paused" : "active"
        setStatus({ id: schedule.id, status: nextStatus })
    }

    const confirmDelete = () => {
        if (!deleteTarget) return
        deleteSchedule(deleteTarget.id)
    }

    return {
        schedules,
        reports,
        now: REPORTS_MOCK_NOW,
        isLoading: schedulesQ.isLoading || libraryQ.isLoading,
        reportTitle,

        dialog,
        openCreate,
        openEdit,
        closeDialog,
        submit,
        isSaving,
        toggleStatus,

        deleteTarget,
        askDelete: setDeleteTarget,
        confirmDelete,
        isDeleting
    }
}
