"use client";

import { Avatar, AvatarFallback, Badge, Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { Pill } from "lucide-react";
import type { RoundRow } from "types";
import { formatMedTime, getMinutesOverdue, isRecentlyChanged, REASON_LABEL, ROUTE_LABEL } from "utils";
import { DoseStatusBadge } from "./dose-status-badge";
import { MedicationTypeBadge } from "./medication-type-badge";

interface MedicationRoundTableProps { rows: RoundRow[]; now: Date; onRecord: (row: RoundRow) => void }

export function MedicationRoundTable({ rows, now, onRecord }: MedicationRoundTableProps) {
  if (rows.length === 0) {
    return <EmptyState icon={<Pill />} title="No doses match" description="Try clearing your filters. Doses appear here from each patient's medication profile." />;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Due</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Medication</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-28 text-right"><span className="sr-only">Action</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const needsAction = r.state === "due" || r.state === "missed";
          const rec = r.dose.record;
          return (
            <TableRow key={r.dose.id}>
              <TableCell className="font-semibold tabular-nums text-cf-ink">{formatMedTime(r.dose.scheduledAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 border border-cf-border-light"><AvatarFallback className="bg-cf-surface-muted text-xs font-medium text-cf-ink-60">{r.patient.initials}</AvatarFallback></Avatar>
                  <span className="whitespace-nowrap font-medium text-cf-ink">{r.patient.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-cf-ink">{r.medication.drugName} {r.medication.strength}</span>
                  <MedicationTypeBadge medication={r.medication} />
                  {isRecentlyChanged(r.medication, now) && <Badge variant="pastel-warning" shape="pill" badgeSize="sm">Changed</Badge>}
                </div>
                <p className="text-xs text-cf-ink-60">{ROUTE_LABEL[r.medication.route]}{r.medication.instructions ? ` · ${r.medication.instructions}` : ""}</p>
              </TableCell>
              <TableCell>
                <DoseStatusBadge state={r.state} />
                {r.state === "missed" && <p className="mt-0.5 text-xs font-semibold text-error">{getMinutesOverdue(r.dose, now)} min overdue</p>}
                {rec && <p className="mt-0.5 text-xs text-cf-ink-60">{rec.reasonCode ? `${REASON_LABEL[rec.reasonCode]} · ` : ""}{rec.recordedBy} · {formatMedTime(rec.recordedAt)}</p>}
              </TableCell>
              <TableCell className="text-right">
                {!rec && (
                  <Button size="sm" variant={needsAction ? "default" : "outline"} onClick={() => onRecord(r)}>Record</Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
