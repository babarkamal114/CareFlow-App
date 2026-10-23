"use client";

import { Card, CardContent, CardHeader, CardTitle, ReportActivityList, Skeleton } from "@/components/ui";
import { useReportActivityQuery } from "hooks";
import { ReportsSectionHeading } from "./ReportsSectionHeading";

export function ReportsActivitySection() {
  const { data, isLoading } = useReportActivityQuery();
  return (
    <section className="space-y-3">
      <ReportsSectionHeading title="Report activity" description="A record of reports run, exported, scheduled and reviewed." />
      <Card className="rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader className="sr-only"><CardTitle>Recent report activity</CardTitle></CardHeader>
        <CardContent>{isLoading ? <Skeleton className="h-32 w-full" /> : <ReportActivityList activity={(data ?? []).slice(0, 8)} />}</CardContent>
      </Card>
    </section>
  );
}
