'use client';

import { CalendarClock, ShieldAlert } from 'lucide-react';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  StaffReviewEmployment,
} from '@/components/ui';
import type { MockStaffProfile } from 'lib';
import { formatStaffDate, formatStaffHours, getStaffSupervisionDeadline } from 'utils';

interface StaffEmploymentTabProps {
  profile: MockStaffProfile;
  managerName?: string;
}

export function StaffEmploymentTab({
  profile,
  managerName,
}: StaffEmploymentTabProps) {
  const { data, compliance } = profile;
  const supervision = getStaffSupervisionDeadline(data.startDate);

  const supervisionVariant = supervision?.overdue
    ? 'error'
    : supervision?.dueSoon
      ? 'warning'
      : 'info';

  const supervisionDescription = !supervision
    ? 'No start date recorded, so a supervision deadline cannot be calculated.'
    : supervision.overdue
      ? `The 30-day supervision session was due ${formatStaffDate(supervision.date)} — ${Math.abs(supervision.daysRemaining)} day(s) overdue.`
      : `Due ${formatStaffDate(supervision.date)} — ${supervision.daysRemaining} day(s) remaining.`;

  return (
    <div className="space-y-6">
      <StaffReviewEmployment
        data={data}
        compliance={compliance}
        managerName={managerName}
      />

      {supervision ? (
        <Alert variant={supervisionVariant}>
          <AlertIcon>
            {supervision.overdue ? <ShieldAlert /> : <CalendarClock />}
          </AlertIcon>
          <AlertContent>
            <AlertTitle>
              {supervision.overdue
                ? 'Supervision session overdue'
                : 'First supervision session'}
            </AlertTitle>
            <AlertDescription>{supervisionDescription}</AlertDescription>
          </AlertContent>
        </Alert>
      ) : null}

      <Alert variant={compliance.canBeScheduled ? 'success' : 'warning'}>
        <AlertContent>
          <AlertTitle>
            {compliance.canBeScheduled ? 'Ready for allocation' : 'Allocation blocked'}
          </AlertTitle>
          <AlertDescription>
            {compliance.canBeScheduled
              ? `Contracted for ${formatStaffHours(data.contractedHoursPerWeek)}. Compliance and mandatory training are complete, so this staff member can be allocated to visits.`
              : 'This staff member can be created and stored, but cannot be allocated to visits until the vetting checklist in the Vetting tab is complete.'}
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}