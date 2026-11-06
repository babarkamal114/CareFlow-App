'use client';

import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import { STAFF_DOCUMENT_TYPE_LABELS } from 'types';
import type { StaffFormData } from 'types';
import { formatStaffDate } from 'utils';

export function StaffReviewDocuments({
  data,
  onEdit,
}: {
  data: StaffFormData;
  onEdit?: () => void;
}) {
  const { documents } = data;

  return (
    <StaffFormReviewGroup title="Documents" stepNumber={6} onEdit={onEdit}>
      <StaffFormReviewItem
        label="Uploaded"
        value={`${documents.length} document${documents.length === 1 ? '' : 's'}`}
      />
      {documents.map((document) => (
        <StaffFormReviewItem
          key={`${document.type}-${document.url}`}
          label={STAFF_DOCUMENT_TYPE_LABELS[document.type]}
          value={document.fileName || formatStaffDate(document.uploadedAt)}
        />
      ))}
    </StaffFormReviewGroup>
  );
}