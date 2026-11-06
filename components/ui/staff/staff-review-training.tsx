'use client';

import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import { TRAINING_STATUS_LABELS } from 'types';
import type { StaffFormData } from 'types';
import { formatStaffDate, formatStaffList } from 'utils';

export function StaffReviewTraining({
  data,
  onEdit,
}: {
  data: StaffFormData;
  onEdit?: () => void;
}) {
  const { qualifications, mandatoryTraining } = data;
  const completed = mandatoryTraining.filter(
    (record) => record.status === 'completed'
  ).length;

  return (
    <StaffFormReviewGroup title="Training" stepNumber={4} onEdit={onEdit}>
      <StaffFormReviewItem
        label="Qualifications"
        value={
          qualifications.length === 0
            ? 'None recorded'
            : formatStaffList(qualifications.map((item) => item.name))
        }
      />
      <StaffFormReviewItem
        label="Mandatory Training"
        value={
          mandatoryTraining.length === 0
            ? 'None recorded'
            : `${completed} of ${mandatoryTraining.length} completed`
        }
      />
      {mandatoryTraining.map((record) => (
        <StaffFormReviewItem
          key={`${record.module}-${record.status}`}
          label={record.module}
          value={`${TRAINING_STATUS_LABELS[record.status]}${
            record.expiryDate ? ` · expires ${formatStaffDate(record.expiryDate)}` : ''
          }`}
        />
      ))}
    </StaffFormReviewGroup>
  );
}