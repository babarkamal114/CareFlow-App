"use client";

import { Badge, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { BookOpen } from "lucide-react";
import type { ControlledEntry, Medication, MedicationPatient } from "types";
import { CONTROLLED_KIND_LABEL, formatMedDateTime, getDrugLabel } from "utils";

interface ControlledLedgerTableProps { entries: ControlledEntry[]; medications: Medication[]; patients: MedicationPatient[]; now: Date }

export function ControlledLedgerTable({ entries, medications, patients, now }: ControlledLedgerTableProps) {
  if (entries.length === 0) return <EmptyState icon={<BookOpen />} title="No ledger entries" description="Receipts, administrations and stock checks are recorded here." />;
  const medById = new Map(medications.map((m) => [m.id, m]));
  const patientById = new Map(patients.map((p) => [p.id, p]));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead><TableHead>Medication</TableHead><TableHead>Entry</TableHead><TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Balance</TableHead><TableHead>Recorded by / witness</TableHead><TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e) => {
          const m = medById.get(e.medicationId);
          return (
            <TableRow key={e.id}>
              <TableCell className="whitespace-nowrap text-cf-ink-60">{formatMedDateTime(e.at, now)}</TableCell>
              <TableCell>{m ? getDrugLabel(m) : "—"}<p className="text-xs text-cf-ink-60">{patientById.get(e.patientId)?.name}</p></TableCell>
              <TableCell><Badge variant={e.kind === "stock-check" ? "pastel-info" : e.kind === "administration" ? "pastel-success" : "pastel-neutral"} shape="pill" badgeSize="sm">{CONTROLLED_KIND_LABEL[e.kind]}</Badge></TableCell>
              <TableCell className="text-right tabular-nums">{e.quantity}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{e.balanceAfter}</TableCell>
              <TableCell className="whitespace-nowrap text-sm text-cf-ink-60">{e.recordedBy} / {e.witness}</TableCell>
              <TableCell className="max-w-64 text-xs text-cf-ink-60">{e.note ?? ""}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
