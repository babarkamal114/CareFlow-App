"use client";

import { ReportConfirmDialog, ReportScheduleDialog } from "@/components/ui";
import { useReportsAccess } from "hooks";
import { useScheduledReports } from "hooks";
import { useMemo } from "react";
import { ReportsActivitySection } from "./ReportsActivitySection";
import { ReportsBuilderSection } from "./ReportsBuilderSection";
import { ReportsDashboardSection } from "./ReportsDashboardSection";
import { ReportsHeaderSection } from "./ReportsHeaderSection";
import { ReportsKpiSection } from "./ReportsKpiSection";
import { ReportsLibrarySection } from "./ReportsLibrarySection";
import { ReportsScheduledSection } from "./ReportsScheduledSection";

export function ReportsWorkspaceSection() {
  const access = useReportsAccess();
  const scheduled = useScheduledReports();

  const reports = useMemo(() => scheduled.reports.filter((r) => access.can(r.roles)), [scheduled.reports, access]);
  const schedules = useMemo(() => scheduled.schedules.filter((s) => reports.some((r) => r.id === s.reportId)), [scheduled.schedules, reports]);

  return (
    <>
      <ReportsHeaderSection role={access.role} onRoleChange={access.setRole} onSchedule={() => scheduled.openCreate()} />
      <ReportsKpiSection />
      <ReportsDashboardSection role={access.role} tabs={access.tabs} />
      <ReportsLibrarySection role={access.role} onSchedule={scheduled.openCreate} />
      <ReportsBuilderSection role={access.role} />
      <ReportsScheduledSection scheduled={scheduled} schedules={schedules} />
      <ReportsActivitySection />

      <ReportScheduleDialog
        open={scheduled.dialog.open} onOpenChange={(open) => !open && scheduled.closeDialog()} reports={reports} initialReportId={scheduled.dialog.reportId}
        schedule={scheduled.dialog.schedule} now={scheduled.now} isSaving={scheduled.isSaving} onSubmit={scheduled.submit}
      />
      <ReportConfirmDialog
        open={scheduled.deleteTarget !== null} title="Delete this schedule?" description={scheduled.deleteTarget ? `${scheduled.reportTitle(scheduled.deleteTarget.reportId)} will no longer be emailed automatically.` : ""}
        confirmLabel="Delete" isLoading={scheduled.isDeleting} onClose={() => scheduled.askDelete(null)} onConfirm={scheduled.confirmDelete}
      />
    </>
  );
}
