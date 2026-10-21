"use client";

import { ChevronRight } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  TableCell,
  TableRow,
} from "@/components/ui";
import type { Patient } from "types";
import { formatNextVisit } from "utils";
import { PatientRiskBadge } from "./patient-risk-badge";
import { PatientStatusBadge } from "./patient-status-badge";

interface PatientRowProps {
  patient: Patient;
  onView?: ((patient: Patient) => void) | undefined;
}

export function PatientRow({ patient, onView }: PatientRowProps) {
  return (
    <TableRow className="border-b border-cf-border-light transition-colors hover:bg-cf-surface-muted/50">
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-8 shrink-0 border border-cf-border-light">
            {patient.avatar ? (
              <AvatarImage src={patient.avatar} alt={patient.name} />
            ) : null}
            <AvatarFallback className="bg-cf-surface-muted text-xs font-medium text-cf-ink-60">
              {patient.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cf-ink">{patient.name}</p>
            <p className="truncate text-xs text-cf-ink-60">{patient.address}</p>
          </div>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap text-cf-ink-60">{patient.age}</TableCell>

      <TableCell>
        <PatientRiskBadge risk={patient.risk} />
      </TableCell>

      <TableCell>
        <PatientStatusBadge status={patient.status} />
      </TableCell>

      <TableCell className="whitespace-nowrap text-cf-ink-60">
        {patient.carer || "-"}
      </TableCell>

      <TableCell className="whitespace-nowrap text-cf-ink-60">
        {formatNextVisit(patient.nextVisit)}
      </TableCell>

      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`View ${patient.name}`}
          onClick={() => onView?.(patient)}
        >
          <ChevronRight />
        </Button>
      </TableCell>
    </TableRow>
  );
}