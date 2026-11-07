'use client';

import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import { DAY_SHORT_LABELS } from "types";
import { formatStaffList } from "utils";
import type { StaffReviewSkillsProps } from "types";

export function StaffReviewSkills({
  data,
  onEdit,
}: StaffReviewSkillsProps) {
  const { languages, skills, workAreaPostcode, availability } = data;

  return (
    <StaffFormReviewGroup title="Skills & Availability" stepNumber={5} onEdit={onEdit}>
      <StaffFormReviewItem label="Languages" value={formatStaffList(languages)} />
      <StaffFormReviewItem label="Skills" value={formatStaffList(skills)} />
      <StaffFormReviewItem label="Work Area" value={workAreaPostcode} />
      <StaffFormReviewItem
        label="Availability"
        value={
          availability.length === 0
            ? undefined
            : availability
                .map((slot) => `${DAY_SHORT_LABELS[slot.day]} ${slot.startTime}-${slot.endTime}`)
                .join(', ')
        }
      />
    </StaffFormReviewGroup>
  );
}