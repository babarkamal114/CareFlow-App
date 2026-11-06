"use client";

import { EmptyState, ReportLibraryCard, ReportRunDialog, Skeleton } from "@/components/ui";
import { useReportLibrary } from "hooks";
import { FileText } from "lucide-react";
import type { ReportRole } from "types";
import { ReportsSectionHeading } from "./ReportsSectionHeading";

export function ReportsLibrarySection({ role, onSchedule }: { role: ReportRole; onSchedule: (reportId: string) => void }) {
  const lib = useReportLibrary(role);

  return (
    <section className="space-y-3">
      <ReportsSectionHeading title="Report library" description="Ready-made reports for inspections, the board and your accountant." />
      {lib.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}</div>
      ) : lib.reports.length === 0 ? (
        <EmptyState icon={<FileText />} title="No reports for your role" description="Switch role to see the reports other roles can run." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lib.reports.map((r) => <ReportLibraryCard key={r.id} report={r} onRun={lib.openRun} onSchedule={onSchedule} onExport={lib.exportFromCard} />)}
        </div>
      )}
      <ReportRunDialog report={lib.runReport} datasets={lib.runDatasets} isLoading={lib.datasetsLoading} onClose={lib.closeRun} onExport={lib.exportRun}
        onSchedule={(id) => { lib.closeRun(); onSchedule(id); }} />
    </section>
  );
}
