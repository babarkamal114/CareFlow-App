"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { Patient } from "types";
import { PATIENTS_TABLE_COLUMNS } from "utils";
import { PatientEmptyState } from "./patient-empty-state";
import { PatientRow } from "./patient-row";
import { PatientTableSkeleton } from "./patient-table-skeleton";

interface PatientsTableProps {
  patients: Patient[];
  isLoading?: boolean;
  /** True when a tab or search is narrowing the list (changes the empty message). */
  hasFilters?: boolean;
  onView?: ((patient: Patient) => void) | undefined;
}

export function PatientsTable({
  patients,
  isLoading = false,
  hasFilters = false,
  onView,
}: PatientsTableProps) {
  if (!isLoading && patients.length === 0) {
    return <PatientEmptyState hasFilters={hasFilters} />;
  }

  return (
    <Table aria-busy={isLoading || undefined}>
      <TableHeader>
        <TableRow className="border-b border-cf-border-light hover:bg-transparent">
          {PATIENTS_TABLE_COLUMNS.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.label || <span className="sr-only">Actions</span>}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <PatientTableSkeleton />
        ) : (
          patients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} onView={onView} />
          ))
        )}
      </TableBody>
    </Table>
  );
}