'use client';

import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import {
  EMPLOYMENT_TYPE_LABELS,
  PAY_RATE_TYPE_LABELS,
  STAFF_ROLE_LABELS,
} from 'types';
import type { ComplianceResult, StaffFormData } from 'types';
import { formatStaffDate, formatStaffHours, formatStaffPayRate } from 'utils';

export function StaffReviewEmployment({
  data,
  compliance,
  managerName,
  onEdit,
}: {
  data: StaffFormData;
  compliance: ComplianceResult;
  managerName?: string;
  onEdit?: () => void;
}) {
  return (
    <StaffFormReviewGroup title="Employment" stepNumber={2} onEdit={onEdit}>
      <StaffFormReviewItem
        label="Role"
        value={data.role ? STAFF_ROLE_LABELS[data.role] : undefined}
      />
      <StaffFormReviewItem
        label="Employment Type"
        value={data.employmentType ? EMPLOYMENT_TYPE_LABELS[data.employmentType] : undefined}
      />
      <StaffFormReviewItem label="Start Date" value={formatStaffDate(data.startDate)} />
      <StaffFormReviewItem label="Manager" value={managerName} />
      <StaffFormReviewItem
        label="Contracted Hours"
        value={formatStaffHours(data.contractedHoursPerWeek)}
      />
      <StaffFormReviewItem
        label="Pay Rate"
        value={formatStaffPayRate(data.payRatePerHour)}
      />
      <StaffFormReviewItem
        label="Pay Rate Type"
        value={data.payRateType ? PAY_RATE_TYPE_LABELS[data.payRateType] : undefined}
      />
      <StaffFormReviewItem
        label="First Supervision"
        value={formatStaffDate(compliance.firstSupervisionDate)}
      />
    </StaffFormReviewGroup>
  );
}