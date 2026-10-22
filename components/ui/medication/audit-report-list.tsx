"use client";

import { Badge, Button } from "@/components/ui";
import { Download, FileText } from "lucide-react";
import type { AuditReport } from "types";
import { formatMedDate } from "utils";

interface AuditReportListProps { reports: AuditReport[]; onDownload: () => void }

/** Monthly reports (auto-generated on the 1st of each month) plus any generated manually. */
export function AuditReportList({ reports, onDownload }: AuditReportListProps) {
  return (
    <ul className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
      {reports.map((r) => (
        <li key={r.id} className="flex items-center gap-3 p-3">
          <FileText className="size-4 flex-shrink-0 text-cf-ink-40" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-cf-ink">{r.period}</p>
            <p className="text-xs text-cf-ink-60">{formatMedDate(r.generatedAt)} · {r.scheduled} doses · {r.administrationRate}% administered</p>
          </div>
          <Badge variant={r.generatedBy === "auto" ? "pastel-neutral" : "pastel-info"} shape="pill" badgeSize="sm">{r.generatedBy === "auto" ? "Auto" : "Manual"}</Badge>
          <Button variant="ghost" size="icon-sm" aria-label={`Download ${r.period} report`} onClick={onDownload}><Download /></Button>
        </li>
      ))}
    </ul>
  );
}
