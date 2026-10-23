"use client";

import { Badge, Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { CalendarClock, Pause, Pencil, Play, Trash2 } from "lucide-react";
import type { ReportSchedule } from "types";
import { describeReportSchedule, formatReportRun } from "utils";

interface ScheduledReportsTableProps {
  schedules: ReportSchedule[]; reportTitle: (id: string) => string;
  onEdit: (s: ReportSchedule) => void; onToggle: (s: ReportSchedule) => void; onDelete: (s: ReportSchedule) => void;
}

export function ScheduledReportsTable({ schedules, reportTitle, onEdit, onToggle, onDelete }: ScheduledReportsTableProps) {
  if (schedules.length === 0) return <EmptyState icon={<CalendarClock />} title="No scheduled reports" description="Schedule a report from the library and it will be emailed automatically." />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report</TableHead><TableHead>Runs</TableHead><TableHead>Recipients</TableHead><TableHead>Next run</TableHead><TableHead>Last run</TableHead><TableHead>Status</TableHead>
          <TableHead className="w-32"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium text-cf-ink">{reportTitle(s.reportId)}</TableCell>
            <TableCell className="whitespace-nowrap text-cf-ink-60">{describeReportSchedule(s)}</TableCell>
            <TableCell className="text-cf-ink-60">{s.recipients[0]}{s.recipients.length > 1 ? ` +${s.recipients.length - 1}` : ""}</TableCell>
            <TableCell className="whitespace-nowrap text-cf-ink-60">{s.status === "paused" ? "—" : formatReportRun(s.nextRun)}</TableCell>
            <TableCell>
              {s.lastRun ? <Badge variant={s.lastRun.status === "success" ? "pastel-success" : "pastel-danger"} shape="pill" badgeSize="sm">{s.lastRun.status === "success" ? "Sent" : "Failed"}</Badge> : <span className="text-cf-ink-40">Never</span>}
            </TableCell>
            <TableCell><Badge variant={s.status === "active" ? "pastel-success" : "pastel-neutral"} shape="pill" badgeSize="sm">{s.status === "active" ? "Active" : "Paused"}</Badge></TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon-sm" aria-label="Edit schedule" onClick={() => onEdit(s)}><Pencil /></Button>
                <Button variant="ghost" size="icon-sm" aria-label={s.status === "active" ? "Pause schedule" : "Resume schedule"} onClick={() => onToggle(s)}>{s.status === "active" ? <Pause /> : <Play />}</Button>
                <Button variant="ghost" size="icon-sm" aria-label="Delete schedule" onClick={() => onDelete(s)}><Trash2 /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
