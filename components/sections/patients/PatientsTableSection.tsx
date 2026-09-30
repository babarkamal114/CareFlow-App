'use client';

import { ChevronRight, AlertCircle } from 'lucide-react';
import { Badge, BadgeProps } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Avatar, 
  AvatarFallback, 
  AvatarImage
} from "@/components/ui";

import {
  getRiskBadgeVariant,
  getRiskDotColor,
  getPatientStatusBadge,
  PATIENTS_TABLE_COLUMNS,
  PATIENTS_TABLE_SKELETON_ROWS,
  PATIENTS_TABLE_SKELETON_CELLS,
} from 'utils';
import type { Patient } from 'types';

interface PatientsTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onView?: (patient: Patient) => void;
}

function PatientRowSkeleton() {
  return (
    <TableRow className="border-b border-cf-border-light">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-cf-ink-40/20 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded bg-cf-ink-40/20 animate-pulse" />
            <div className="h-2.5 w-36 rounded bg-cf-ink-40/20 animate-pulse" />
          </div>
        </div>
      </TableCell>
      {PATIENTS_TABLE_SKELETON_CELLS.map((shape, i) => (
        <TableCell key={i}>
          <div className={`${shape} bg-cf-ink-40/20 animate-pulse`} />
        </TableCell>
      ))}
      <TableCell />
    </TableRow>
  );
}

export function PatientsTable({ patients, isLoading, onView }: PatientsTableProps) {
  if (!isLoading && patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-cf-ink-40 mb-2" />
        <p className="text-sm text-cf-ink-60">No patients found</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-cf-border bg-cf-surface">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-cf-border-light hover:bg-transparent">
              {PATIENTS_TABLE_COLUMNS.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: PATIENTS_TABLE_SKELETON_ROWS }).map((_, i) => (
                  <PatientRowSkeleton key={i} />
                ))
              : patients.map((patient) => {
                  const status = getPatientStatusBadge(patient.status);

                  return (
                    <TableRow
                      key={patient.id}
                      className="border-b border-cf-border-light hover:bg-cf-surface-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8 border border-cf-border-light flex-shrink-0">
                            {patient.avatar && <AvatarImage src={patient.avatar} alt={patient.name} />}
                            <AvatarFallback className="bg-cf-surface-muted text-cf-ink-60 text-xs font-medium">
                              {patient.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-cf-ink truncate">{patient.name}</p>
                            <p className="text-xs text-cf-ink-40 truncate">{patient.address}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">
                        {patient.age}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={getRiskBadgeVariant(patient.risk) as BadgeProps['variant']}
                          className="flex items-center gap-x-2"
                          shape={'pill'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${getRiskDotColor(patient.risk)}`} />
                          {patient.risk}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant={status.variant} className="text-xs capitalize" shape={'pill'}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">
                        {patient.carer}
                      </TableCell>

                      <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">
                        {patient.nextVisit}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button onClick={() => onView?.(patient)} variant="ghost">
                          <ChevronRight className="h-5 w-5 text-cf-ink-40" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}