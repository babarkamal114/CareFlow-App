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
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import React from 'react';
import { Button } from "@/components/ui";
import { getRiskBadgeVariant, getRiskDotColor } from 'utils';
import type { Patient } from 'types';

interface PatientsTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onView?: (patient: Patient) => void;
}

const statusVariants: Record<Patient['status'], BadgeProps['variant']> = {
  active: 'pastel-success',
  'on-hold': 'pastel-warning',
  new: 'pastel-info',
  discharged: 'pastel-muted' as BadgeProps['variant'],
};

const statusLabels: Record<Patient['status'], string> = {
  active: 'Active',
  'on-hold': 'On Hold',
  new: 'New',
  discharged: 'Discharged',
};

export function PatientsTable({ patients, isLoading, onView }: PatientsTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-cf-ink-60">Loading patients...</p>
      </div>
    );
  }

  if (patients.length === 0) {
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
              <TableHead className="text-cf-ink-60 font-medium text-xs">Patient</TableHead>
              <TableHead className="text-cf-ink-60 font-medium text-xs">Age</TableHead>
              <TableHead className="text-cf-ink-60 font-medium text-xs">Risk</TableHead>
              <TableHead className="text-cf-ink-60 font-medium text-xs">Status</TableHead>
              <TableHead className="text-cf-ink-60 font-medium text-xs">Carer</TableHead>
              <TableHead className="text-cf-ink-60 font-medium text-xs">Next Visit</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.id}
                className={`border-b border-cf-border-light hover:bg-cf-surface-muted/50 transition-colors ${
                  selectedRows.has(patient.id) ? 'bg-cf-surface-muted/50' : ''
                }`}
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
                    className='flex items-center gap-x-2 '
                    shape={'pill'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${getRiskDotColor(patient.risk)}`} />
                    {patient.risk}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={statusVariants[patient.status]}
                    className="text-xs capitalize"
                    shape={'pill'}
                  >
                    {statusLabels[patient.status]}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">
                  {patient.carer}
                </TableCell>

                <TableCell className="text-sm text-cf-ink-60 whitespace-nowrap">
                  {patient.nextVisit}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    onClick={() => onView?.(patient)}
                    variant='ghost'
                  >
                    <ChevronRight className="h-5 w-5 text-cf-ink-40" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}