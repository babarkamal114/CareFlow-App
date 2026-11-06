"use client";

import {
  StaffComplianceSummary,
  StaffComputedFieldsNotice,
  StaffConfirmGate,
  StaffFormErrorBanner,
  StaffReviewCompliance,
  StaffReviewDocuments,
  StaffReviewEmployment,
  StaffReviewPersonal,
  StaffReviewSkills,
  StaffReviewTraining,
  StaffSchedulingNotice,
} from "@/components/ui";
import type {
  ComplianceResult,
  StaffFormData,
  StaffFormErrors,
} from "types";

interface Props {
  data: StaffFormData;
  errors: StaffFormErrors;
  compliance: ComplianceResult;
  managerName?: string;
  onEdit: (stepNumber: number) => void;
  onConfirmChange: (confirmed: boolean) => void;
}

export function ReviewSection({
  data,
  errors,
  compliance,
  managerName,
  onEdit,
  onConfirmChange,
}: Props) {
  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffComplianceSummary compliance={compliance} />

      <StaffReviewPersonal data={data} onEdit={() => onEdit(1)} />

      <StaffReviewEmployment
        data={data}
        compliance={compliance}
        managerName={managerName}
        onEdit={() => onEdit(2)}
      />

      <StaffReviewCompliance
        data={data}
        compliance={compliance}
        onEdit={() => onEdit(3)}
      />

      <StaffReviewTraining data={data} onEdit={() => onEdit(4)} />

      <StaffReviewSkills data={data} onEdit={() => onEdit(5)} />

      <StaffReviewDocuments data={data} onEdit={() => onEdit(6)} />

      <StaffComputedFieldsNotice />

      <StaffSchedulingNotice canBeScheduled={compliance.canBeScheduled} />

      <StaffConfirmGate
        confirmed={data.confirmed}
        error={errors.confirmed}
        onChange={onConfirmChange}
      />
    </div>
  );
}
