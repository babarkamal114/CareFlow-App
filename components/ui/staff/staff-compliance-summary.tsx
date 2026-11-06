'use client';

import { CircleCheck, CircleSlash, ShieldAlert } from 'lucide-react';
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
import { COMPLIANCE_STATUS_LABELS } from 'types';
import type { ComplianceBreakdown, ComplianceResult } from 'types';
import { getStaffComplianceTone } from 'utils';

const ALERT_VARIANT = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
} as const;

const ALERT_ICON = {
  success: CircleCheck,
  warning: ShieldAlert,
  danger: CircleSlash,
} as const;

const CHECKLIST_LABELS: Record<keyof ComplianceBreakdown, string> = {
  rightToWork: 'Right to work verified',
  dbs: 'DBS on record',
  dbsClear: 'DBS cleared',
  driving: 'Driving / travel details',
  training: 'Mandatory training complete',
  references: 'Two references received',
  documents: 'Signed contract uploaded',
};

const CHECKLIST_ORDER: (keyof ComplianceBreakdown)[] = [
  'rightToWork',
  'dbs',
  'dbsClear',
  'driving',
  'training',
  'references',
  'documents',
];

export function StaffComplianceSummary({
  compliance,
}: {
  compliance: ComplianceResult;
}) {
  const tone = getStaffComplianceTone(compliance.complianceStatus);
  const AlertIconComponent = ALERT_ICON[tone];

  return (
    <div className="space-y-4">
      <Alert variant={ALERT_VARIANT[tone]}>
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