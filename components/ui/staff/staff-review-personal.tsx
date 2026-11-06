'use client';

import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import { formatStaffAddress, formatStaffDate } from 'utils';
import type { StaffFormData } from 'types';

export function StaffReviewPersonal({
  data,
  onEdit,
}: {
  data: StaffFormData;
  onEdit?: () => void;
}) {
  const emergencyContact = data.emergencyContact;

  return (
    <StaffFormReviewGroup title="Personal" stepNumber={1} onEdit={onEdit}>
      <StaffFormReviewItem
        label="Name"
        value={`${data.firstName} ${data.lastName}`.trim() || '—'}
      />
      <StaffFormReviewItem label="Preferred Name" value={data.preferredName} />
      <StaffFormReviewItem label="Date Of Birth" value={formatStaffDate(data.dateOfBirth)} />
      <StaffFormReviewItem
        label="National Insurance"
        value={data.nationalInsuranceNumber}
      />
      <StaffFormReviewItem label="Phone" value={data.phone} />
      <StaffFormReviewItem label="Email" value={data.email} />
      <StaffFormReviewItem label="Address" value={formatStaffAddress(data)} />
      <StaffFormReviewItem
        label="Emergency Contact"
        value={
          emergencyContact.name
            ? `${emergencyContact.name} (${emergencyContact.relationship}) — ${emergencyContact.phone}`
            : undefined
        }
      />
      <StaffFormReviewItem
        label="Photo On Portal"
        value={data.photoConsentForFamilyPortal ? 'Yes' : 'No'}
      />
    </StaffFormReviewGroup>
  );
}