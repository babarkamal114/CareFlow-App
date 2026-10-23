"use client";

import { Button, Card, CardContent, ScheduledReportsTable, Skeleton } from "@/components/ui";
import type { useScheduledReports } from "hooks";
import { Plus } from "lucide-react";
import type { ReportSchedule } from "types";
import { ReportsSectionHeading } from "./ReportsSectionHeading";

interface ReportsScheduledSectionProps { scheduled: ReturnType<typeof useScheduledReports>; schedules: ReportSchedule[] }

export function ReportsScheduledSection({ scheduled: s, schedules }: ReportsScheduledSectionProps) {
  return (
    <section className="space-y-3">
      <ReportsSectionHeading title="Scheduled reports" description="Reports that run on their own and are emailed to your team."
        action={<Button size="sm" onClick={() => s.openCreate()}><Plus />New schedule</Button>} />
      <Card className="rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardContent>
          {s.isLoading ? <Skeleton className="h-40 w-full" /> : <ScheduledReportsTable schedules={schedules} reportTitle={s.reportTitle} onEdit={s.openEdit} onToggle={s.toggleStatus} onDelete={s.askDelete} />}
        </CardContent>
      </Card>
    </section>
  );
}
