"use client";

import { useMemo, useState } from "react";
import { computeCompliance, hasErrors, mapRolesToDisplay, useGetAllRolesApi, validateStep } from "lib";
import { STAFF_FORM_STEPS, STEP_TOTAL } from "types";
import type { AddStaffPayload, StaffFormData, StaffFormErrors, StaffFormStepId } from "types";
import { cloneInitialData } from "utils";

export function useAddStaffForm() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StaffFormData>(cloneInitialData);
  const [touchedSteps, setTouchedSteps] = useState<StaffFormStepId[]>([]);

  const { data: rolesData } = useGetAllRolesApi();
  const roles = useMemo(() => mapRolesToDisplay(rolesData?.roles), [rolesData]);

  const compliance = useMemo(() => computeCompliance(formData), [formData]);

  const currentStep = STAFF_FORM_STEPS[step - 1];
  const currentStepId = currentStep.id;

  const errors: StaffFormErrors = useMemo(
    () => validateStep(currentStepId, formData),
    [currentStepId, formData]
  );

  const showErrors = touchedSteps.includes(currentStepId);
  const visibleErrors: StaffFormErrors = showErrors ? errors : {};
  const errorCount = Object.keys(errors).length;
  const showErrorSummary = currentStepId !== "review" && showErrors && hasErrors(errors);

  const manager = roles.find((role) => role.id === formData.managerId);
  const managerName = manager?.displayName ?? manager?.name;

  const markTouched = (id: StaffFormStepId) =>
    setTouchedSteps((previous) => (previous.includes(id) ? previous : [...previous, id]));

  const goToStep = (nextStep: number) => {
    setStep(Math.min(Math.max(nextStep, 1), STEP_TOTAL));
  };

  const handleNext = () => {
    if (hasErrors(errors)) {
      markTouched(currentStepId);
      return;
    }
    setTouchedSteps((previous) => previous.filter((id) => id !== currentStepId));
    goToStep(step + 1);
  };

  const handleBack = () => goToStep(step - 1);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setFormData(cloneInitialData());
        setTouchedSteps([]);
      }, 200);
    }
  };

  const handleConfirmChange = (confirmed: boolean) =>
    setFormData((previous) => ({ ...previous, confirmed }));

  const handleSubmit = () => {
    if (!formData.confirmed) {
      markTouched("review");
      return;
    }

    const payload: AddStaffPayload = {
      data: {
        ...formData,
        complianceStatus: compliance.complianceStatus,
        canBeScheduled: compliance.canBeScheduled,
        firstSupervisionDate: compliance.firstSupervisionDate,
      },
      compliance,
    };

    console.log("Create staff →", payload);

    handleOpenChange(false);
  };

  return {
    open,
    step,
    currentStep,
    currentStepId,
    formData,
    setFormData,
    compliance,
    visibleErrors,
    errorCount,
    showErrorSummary,
    managerName,
    goToStep,
    handleNext,
    handleBack,
    handleOpenChange,
    handleConfirmChange,
    handleSubmit,
  };
}
