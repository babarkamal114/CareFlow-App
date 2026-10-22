"use client";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import { formatMedDateTime, type AuditGap, type RefusalPattern } from "utils";

export function RefusalPatternsTable({ patterns, now }: { patterns: RefusalPattern[]; now: Date }) {
  if (patterns.length === 0) return <p className="py-6 text-center text-sm text-cf-ink-40">No repeated refusals.</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Patient</TableHead><TableHead>Medication</TableHead><TableHead className="text-right">Times refused</TableHead><TableHead>Last refused</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {patterns.map((p) => (
          <TableRow key={p.key}>
            <TableCell className="font-medium text-cf-ink">{p.patientName}</TableCell>
            <TableCell>{p.drug}</TableCell>
            <TableCell className="text-right"><Badge variant={p.refusals >= 5 ? "pastel-danger" : "pastel-warning"} shape="pill" badgeSize="sm">{p.refusals}</Badge></TableCell>
            <TableCell className="whitespace-nowrap text-cf-ink-60">{formatMedDateTime(p.lastRefusal, now)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Unexplained gaps: a scheduled dose with nothing recorded. */
export function AuditGapList({ gaps, now }: { gaps: AuditGap[]; now: Date }) {
  if (gaps.length === 0) return <p className="py-6 text-center text-sm text-cf-ink-40">No unexplained gaps.</p>;
  return (
    <ul className="divide-y divide-cf-border-light rounded-lg border border-cf-border-light">
      {gaps.map((g) => (
        <li key={g.key} className="flex items-center gap-3 p-3">
          <AlertTriangle className="size-4 flex-shrink-0 text-warning" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-cf-ink">{g.drug}</p>
            <p className="text-xs text-cf-ink-60">{g.patientName} · due {formatMedDateTime(g.when, now)} · nothing recorded</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
