"use client";

import { Badge, Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { Pill } from "lucide-react";
import type { PrnRow } from "types";
import { EFFECTIVENESS_BADGE, EFFECTIVENESS_LABEL, formatMedDateTime, getDrugLabel, PRN_FOLLOWUP_CONFIG } from "utils";

interface PrnTableProps { rows: PrnRow[]; now: Date; onFollowUp: (id: string) => void }

export function PrnTable({ rows, now, onFollowUp }: PrnTableProps) {
  if (rows.length === 0) return <EmptyState icon={<Pill />} title="No PRN doses yet" description="Record an as-needed dose and the effectiveness check will appear here." />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Given</TableHead><TableHead>Patient</TableHead><TableHead>Medication</TableHead><TableHead>Reason</TableHead>
          <TableHead>Effectiveness check</TableHead><TableHead className="w-28"><span className="sr-only">Action</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ record, medication, patient, state }) => (
          <TableRow key={record.id}>
            <TableCell className="whitespace-nowrap text-cf-ink-60">{formatMedDateTime(record.administeredAt, now)}</TableCell>
            <TableCell className="whitespace-nowrap font-medium text-cf-ink">{patient.name}</TableCell>
            <TableCell>{getDrugLabel(medication)}<p className="text-xs text-cf-ink-60">{record.doseGiven} · by {record.recordedBy}</p></TableCell>
            <TableCell>{record.reason}</TableCell>
            <TableCell>
              {record.followUp ? (
                <div className="space-y-0.5">
                  <Badge variant={EFFECTIVENESS_BADGE[record.followUp.effectiveness]} shape="pill" badgeSize="sm">{EFFECTIVENESS_LABEL[record.followUp.effectiveness]}</Badge>
                  {record.followUp.note && <p className="text-xs text-cf-ink-60">{record.followUp.note}</p>}
                </div>
              ) : <Badge variant={PRN_FOLLOWUP_CONFIG[state].badge} shape="pill" badgeSize="sm">{PRN_FOLLOWUP_CONFIG[state].label}</Badge>}
            </TableCell>
            <TableCell className="text-right">
              {!record.followUp && <Button size="sm" variant={state === "waiting" ? "outline" : "default"} onClick={() => onFollowUp(record.id)}>Record check</Button>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
