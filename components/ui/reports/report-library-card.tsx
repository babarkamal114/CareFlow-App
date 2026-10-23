"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { CalendarClock, Play } from "lucide-react";
import type { LibraryReport, ReportExportFormat } from "types";
import { REPORT_DOMAIN_BADGE, REPORT_DOMAIN_LABEL } from "utils";
import { ReportExportMenu } from "./report-export-menu";

interface ReportLibraryCardProps { report: LibraryReport; onRun: (r: LibraryReport) => void; onSchedule: (reportId: string) => void; onExport: (r: LibraryReport, f: ReportExportFormat) => void }

export function ReportLibraryCard({ report, onRun, onSchedule, onExport }: ReportLibraryCardProps) {
  return (
    <Card className="h-full rounded-2xl border-cf-border-light shadow-cf-sm">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-cf-ink">{report.title}</h3>
          <Badge variant={REPORT_DOMAIN_BADGE[report.domain]} shape="pill" badgeSize="sm">{REPORT_DOMAIN_LABEL[report.domain]}</Badge>
        </div>
        <p className="flex-1 text-sm text-cf-ink-60">{report.description}</p>
        <p className="text-xs text-cf-ink-40">{report.datasetIds.length} {report.datasetIds.length === 1 ? "section" : "sections"} · {report.source}</p>
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1" onClick={() => onRun(report)}><Play />Run</Button>
          <Button size="sm" variant="outline" onClick={() => onSchedule(report.id)}><CalendarClock />Schedule</Button>
          <ReportExportMenu compact onSelect={(f) => onExport(report, f)} />
        </div>
      </CardContent>
    </Card>
  );
}
