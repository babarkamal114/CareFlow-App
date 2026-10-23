"use client";

import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REPORTS_MOCK_NOW, deleteReportSchedule, saveReportSchedule, setReportScheduleStatus } from "lib";
import { useState } from "react";
import type { ReportSchedule, ReportScheduleFormData } from "types";
import { reportKeys, useLibraryReportsQuery, useReportSchedulesQuery } from "./use-reports-queries";

interface DialogState { open: boolean; reportId: string | null; schedule: ReportSchedule | null }
const CLOSED: DialogState = { open: false, reportId: null, schedule: null };

export function useScheduledReports() {
  const qc = useQueryClient();
  const schedulesQ = useReportSchedulesQuery();
  const libraryQ = useLibraryReportsQuery();
  const [dialog, setDialog] = useState<DialogState>(CLOSED);
  const [deleteTarget, setDeleteTarget] = useState<ReportSchedule | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: reportKeys.schedules });
    qc.invalidateQueries({ queryKey: reportKeys.activity });
  };

  const save = useMutation({
    mutationFn: saveReportSchedule,
    onSuccess: (_s, vars) => { refresh(); setDialog(CLOSED); toast.success(vars.id ? "Schedule updated" : "Report scheduled"); },
    onError: () => toast.error("Could not save the schedule."),
  });
  const setStatus = useMutation({
    mutationFn: setReportScheduleStatus,
    onSuccess: (_d, vars) => { refresh(); toast.success(vars.status === "paused" ? "Schedule paused" : "Schedule resumed"); },
  });
  const remove = useMutation({
    mutationFn: deleteReportSchedule,
    onSuccess: () => { refresh(); setDeleteTarget(null); toast.success("Schedule deleted"); },
    onError: () => toast.error("Could not delete the schedule."),
  });

  const reports = libraryQ.data ?? [];
  return {
    schedules: schedulesQ.data ?? [], reports, now: REPORTS_MOCK_NOW, isLoading: schedulesQ.isLoading || libraryQ.isLoading,
    reportTitle: (id: string) => reports.find((r) => r.id === id)?.title ?? id,
    dialog, openCreate: (reportId?: string) => setDialog({ open: true, reportId: reportId ?? null, schedule: null }),
    openEdit: (schedule: ReportSchedule) => setDialog({ open: true, reportId: schedule.reportId, schedule }), closeDialog: () => setDialog(CLOSED),
    submit: (data: ReportScheduleFormData) => save.mutate({ id: dialog.schedule?.id, data }), isSaving: save.isPending,
    toggleStatus: (s: ReportSchedule) => setStatus.mutate({ id: s.id, status: s.status === "active" ? "paused" : "active" }),
    deleteTarget, askDelete: setDeleteTarget, confirmDelete: () => deleteTarget && remove.mutate(deleteTarget.id), isDeleting: remove.isPending,
  };
}
