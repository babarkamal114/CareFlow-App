'use client';

import { CheckCircle2 } from 'lucide-react';
import { StaffFormReviewGroup } from './staff-form-review-group';
import { StaffFormReviewItem } from './staff-form-review-item';
import { StaffFormStatusBadge } from './staff-form-status-badge';
import { DBS_PATH_LABELS, DBS_STATUS_LABELS, RTW_CHECK_TYPE_LABELS, TRAVEL_MODE_LABELS } from 'types';
import type { ComplianceResult, StaffFormData } from 'types';
import { formatStaffDate, getStaffDbsTone } from 'utils';

export function StaffReviewCompliance({
  data,
  compliance,
  onEdit,
}: {
  data: StaffFormData;
  compliance: ComplianceResult;
  onEdit?: () => void;
}) {
  const { rightToWork, dbs, driving } = data;
  const referencesReceived = data.referees.filter(
    (referee) => referee.referenceReceived
  ).length;

  return (
    <StaffFormReviewGroup title="Compliance & Vetting" stepNumber={3} onEdit={onEdit}>
      <StaffFormReviewItem
        label="Right To Work"
        value={
          <StaffFormStatusBadge
            status={compliance.breakdown.rightToWork ? 'green' : 'red'}
          >
            {compliance.breakdown.rightToWork ? (
              <>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified {formatStaffDate(rightToWork.checkDate)}
              </>
            ) : (
              'Outstanding'
            )}
          </StaffFormStatusBadge>
        }
      />
      <StaffFormReviewItem
        label="Check Type"
        value={rightToWork.checkType ? RTW_CHECK_TYPE_LABELS[rightToWork.checkType] : undefined}
      />
      <StaffFormReviewItem label="Document Type" value={rightToWork.documentType} />
      <StaffFormReviewItem
        label="Document Expiry"
        value={formatStaffDate(rightToWork.documentExpiryDate)}
      />
      <StaffFormReviewItem
        label="Follow Up Check"
        value={formatStaffDate(rightToWork.followUpCheckDate)}
      />
      <StaffFormReviewItem label="DBS Route" value={dbs.path ? DBS_PATH_LABELS[dbs.path] : undefined} />
      <StaffFormReviewItem
        label="DBS Status"
        value={
          dbs.status ? (
            <StaffFormStatusBadge status={getStaffDbsTone(dbs.status)}>
              {DBS_STATUS_LABELS[dbs.status]}
            </StaffFormStatusBadge>
          ) : undefined
        }
      />
      <StaffFormReviewItem label="DBS Expiry" value={formatStaffDate(dbs.expiryDate)} />
      <StaffFormReviewItem
        label="Application Ref"
        value={dbs.applicationReference}
      />
      <StaffFormReviewItem
        label="Interim Certificate"
        value={dbs.interimCertificate?.certificateNumber}
      />
      <StaffFormReviewItem
        label="Driving"
        value={
          <StaffFormStatusBadge
            status={compliance.breakdown.driving ? 'green' : 'amber'}
          >
            {driving.hasLicence
              ? driving.drivesForWork
                ? 'Drives for work'
                : 'Licensed'
              : 'No licence'}
          </StaffFormStatusBadge>
        }
      />
      <StaffFormReviewItem label="Licence Number" value={driving.licenceNumber} />
      <StaffFormReviewItem
        label="Travel Mode"
        value={driving.travelMode ? TRAVEL_MODE_LABELS[driving.travelMode] : undefined}
      />
      <StaffFormReviewItem
        label="References"
        value={
          <StaffFormStatusBadge
            status={compliance.breakdown.references ? 'green' : 'red'}
          >
            {referencesReceived} of {data.referees.length} received
          </StaffFormStatusBadge>
        }
      />
    </StaffFormReviewGroup>
  );
}