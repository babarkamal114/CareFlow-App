'use client';

import type { StaffMember } from 'types';
import { buildAvailabilityForStaff, cn } from 'lib';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  AVAILABILITY_LEGEND,
  AVAILABILITY_WEEK_DAYS,
  availabilityCellClasses,
  formatBookedHours,
  getAvailabilityState,
  type AvailabilityDay,
} from 'utils';

interface AvailabilityTabProps {
  staffMembers: StaffMember[];
}

function AvailabilityCell({ day }: { day: AvailabilityDay }) {
  const state = getAvailabilityState(day);

  return (
    <TableCell className="px-3 py-2.5 text-center">
      {state === 'unavailable' ? (
        <span className="text-xs text-cf-ink-40">—</span>
      ) : (
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium',
            availabilityCellClasses[state],
          )}
        >
          {formatBookedHours(day)}
        </span>
      )}
    </TableCell>
  );
}

export function AvailabilityTab({ staffMembers }: AvailabilityTabProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <p className="text-sm font-semibold text-foreground">Weekly availability</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Available hours vs. booked hours per carer, this week
        </p>
      </div>

      <Table variant="minimal" className="w-full text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="sticky left-0 bg-muted px-4 text-left font-medium text-muted-foreground">
              Carer
            </TableHead>
            {AVAILABILITY_WEEK_DAYS.map((day) => (
              <TableHead
                key={day}
                className="px-3 text-center font-medium text-muted-foreground"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {staffMembers.map((staff, index) => {
            const availability = buildAvailabilityForStaff(staff.id, index);
            return (
              <TableRow key={staff.id}>
                <TableCell className="sticky left-0 bg-card px-4 py-2.5 font-medium text-foreground">
                  {staff.name}
                </TableCell>
                {availability.week.map((day) => (
                  <AvailabilityCell key={day.day} day={day} />
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        {AVAILABILITY_LEGEND.map((item) => (
          <span key={item.id} className="flex items-center gap-1.5">
            <span className={cn('size-2.5 rounded-sm', item.swatchClass)} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}