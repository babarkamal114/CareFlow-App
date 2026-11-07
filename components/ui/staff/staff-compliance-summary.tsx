'use client';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui';
import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import { StaffFormStatusBadge } from './staff-form-status-badge';
import { COMPLIANCE_STATUS_LABELS } from "types";
import { getStaffComplianceTone } from "utils";
import type { StaffComplianceSummaryProps } from "types";
import { COMPLIANCE_ICON, COMPLIANCE_ALERT_VARIANT, CHECKLIST_LABELS, CHECKLIST_ORDER } from "utils";

export function StaffComplianceSummary({
  compliance,
}: StaffComplianceSummaryProps) {
  const tone = getStaffComplianceTone(compliance.complianceStatus);
  const AlertIconComponent = COMPLIANCE_ICON[tone];

  return (
    <div className="space-y-4">
      <Alert variant={COMPLIANCE_ALERT_VARIANT[tone]}>
        <AlertIcon>
          <AlertIconComponent />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>
            {COMPLIANCE_STATUS_LABELS[compliance.complianceStatus]}
          </AlertTitle>
          <AlertDescription>
            {compliance.canBeScheduled
              ? 'Every vetting check has cleared and mandatory training is complete, so this staff member can be allocated to visits.'
              : 'This staff member cannot be allocated to visits until the outstanding vetting and training items below are resolved.'}
          </AlertDescription>
        </AlertContent>
      </Alert>

      <StaffFormReviewGroup title="Vetting Checklist">
        {CHECKLIST_ORDER.map((key) => (
          <StaffFormReviewItem
            key={key}
            label={CHECKLIST_LABELS[key]}
            value={
              <StaffFormStatusBadge
                status={compliance.breakdown[key] ? 'green' : 'red'}
              >
                {compliance.breakdown[key] ? 'Verified' : 'Outstanding'}
              </StaffFormStatusBadge>
            }
          />
        ))}
      </StaffFormReviewGroup>
    </div>
  );
}