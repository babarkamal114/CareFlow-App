'use client';

import type { StaffMember } from 'types';
import { buildPerformanceForStaff, cn } from 'lib';
import { Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  PERFORMANCE_TABLE_COLUMNS,
  SCORE_STAR_INDEXES,
  formatPercent,
  formatScore,
  getMetricColorClass,
  getStarClassName,
  type PerformanceColumn,
  type StaffPerformance,
} from 'utils';

interface PerformanceTabProps {
  staffMembers: StaffMember[];
}

function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {SCORE_STAR_INDEXES.map((i) => (
        <Star key={i} className={cn('size-3.5', getStarClassName(i, score))} />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{formatScore(score)}</span>
    </div>
  );
}

function PerformanceCell({
  column,
  staff,
  perf,
}: {
  column: PerformanceColumn;
  staff: StaffMember;
  perf: StaffPerformance;
}) {
  if (column.kind === 'name') {
    return (
      <TableCell className="px-4 py-2.5 font-medium text-foreground">
        {staff.name}
      </TableCell>
    );
  }

  const value = perf[column.field!];

  if (column.kind === 'percent') {
    return (
      <TableCell className={cn('text-center font-semibold', getMetricColorClass(value))}>
        {formatPercent(value)}
      </TableCell>
    );
  }

  return (
    <TableCell>
      <ScoreStars score={value} />
    </TableCell>
  );
}

export function PerformanceTab({ staffMembers }: PerformanceTabProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <p className="text-sm font-semibold text-foreground">Performance dashboard</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Punctuality, visit completion, note quality, and patient feedback per carer
        </p>
      </div>

      <Table variant="minimal" className="w-full text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50">
            {PERFORMANCE_TABLE_COLUMNS.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  'font-medium text-muted-foreground',
                  column.kind === 'name' ? 'px-4 text-left' : 'px-3 text-center',
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {staffMembers.map((staff, index) => {
            const perf = buildPerformanceForStaff(staff.id, index);
            return (
              <TableRow key={staff.id}>
                {PERFORMANCE_TABLE_COLUMNS.map((column) => (
                  <PerformanceCell
                    key={column.id}
                    column={column}
                    staff={staff}
                    perf={perf}
                  />
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}