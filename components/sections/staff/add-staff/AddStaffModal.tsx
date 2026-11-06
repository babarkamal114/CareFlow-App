"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import {
  computeCompliance,
  hasErrors,
  mapRolesToDisplay,
  useGetAllRolesApi,
  validateStep,
} from "lib";
import { StaffFormStepDots, StaffFormStepRail } from "@/components/ui";
import { ComplianceSection } from "./ComplianceSection";
import { DocumentsSection } from "./DocumentsSection";
import { EmploymentSection } from "./EmploymentSection";
import { PersonalSection } from "./PersonalSection";
import { ReviewSection } from "./ReviewSection";
import { SkillsAvailabilitySection } from "./SkillsAvailabilitySection";
import { TrainingSection } from "./TrainingSection";
import {
  INITIAL_STAFF_FORM_DATA,
  STAFF_FORM_STEPS,
  STEP_TOTAL,
} from "types";
import type {
  ComplianceResult,
  StaffFormData,
  StaffFormErrors,
  StaffFormStepId,
} from "types";

interface AddStaffPayload {
  data: StaffFormData;
  compliance: ComplianceResult;
}

function cloneInitialData(): StaffFormData {
  return {
    ...INITIAL_STAFF_FORM_DATA,
    address: { ...INITIAL_STAFF_FORM_DATA.address },
    emergencyContact: { ...INITIAL_STAFF_FORM_DATA.emergencyContact },
    rightToWork: { ...INITIAL_STAFF_FORM_DATA.rightToWork },
    dbs: { ...INITIAL_STAFF_FORM_DATA.dbs },
    driving: { ...INITIAL_STAFF_FORM_DATA.driving },
    referees: [],
    qualifications: [],
    mandatoryTraining: [],
    languages: [],
    skills: [],
    availability: [],
    documents: [],
  };
}

export function AddStaffModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StaffFormData>(cloneInitialData);
  const [touchedSteps, setTouchedSteps] = useState<StaffFormStepId[]>([]);

  const { data: rolesData } = useGetAllRolesApi();
  const roles = useMemo(() => mapRolesToDisplay(rolesData?.roles), [rolesData]);

  const compliance = useMemo(() => computeCompliance(formData), [formData]);

  const currentStepId = STAFF_FORM_STEPS[step - 1].id;

  const errors: StaffFormErrors = useMemo(
    () => validateStep(currentStepId, formData),
    [currentStepId, formData]
  );

  const showErrors = touchedSteps.includes(currentStepId);

  const visibleErrors = showErrors ? errors : {};

  const managerName =
    roles.find((role) => role.id === formData.managerId)?.displayName ??
    roles.find((role) => role.id === formData.managerId)?.name;

  const goToStep = (nextStep: number) => {
    setStep(Math.min(Math.max(nextStep, 1), STEP_TOTAL));
  };

  const handleNext = () => {
    if (hasErrors(errors)) {
      setTouchedSteps((previous) =>
        previous.includes(currentStepId)
          ? previous
          : [...previous, currentStepId]
      );
      return;
    }

    setTouchedSteps((previous) =>
      previous.filter((id) => id !== currentStepId)
    );
    goToStep(step + 1);
  };

  const handleBack = () => {
    goToStep(step - 1);
  };

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

  const handleSubmit = () => {
    if (!formData.confirmed) {
      setTouchedSteps((previous) =>
        previous.includes("review") ? previous : [...previous, "review"]
      );
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4" />
            Add Staff Member
          </Button>
        }
      />

      <DialogContent
        className="flex h-[90vh] max-w-4xl flex-col overflow-hidden border-cf-border bg-cf-surface p-0"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 border-b border-cf-border px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-lg font-bold text-cf-ink">
                Add New Staff Member
              </DialogTitle>
              <DialogDescription className="text-sm text-cf-ink-60">
                Step {step} of {STEP_TOTAL} — {STAFF_FORM_STEPS[step - 1].title}
              </DialogDescription>
            </div>
            <StaffFormStepDots current={step} total={STEP_TOTAL} />
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-cf-border bg-cf-surface-inset/30 px-3 py-4 lg:block">
            <StaffFormStepRail
              steps={STAFF_FORM_STEPS}
              current={step}
              onSelect={goToStep}
            />
          </aside>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {currentStepId === "personal" && (
              <PersonalSection
                data={formData}
                errors={visibleErrors}
                onChange={setFormData}
              />
            )}
            {currentStepId === "employment" && (
              <EmploymentSection
                data={formData}
                errors={visibleErrors}
                onChange={setFormData}
              />
            )}
            {currentStepId === "compliance" && (
              <ComplianceSection
                data={formData}
                errors={visibleErrors}
                onChange={setFormData}
              />
            )}
            {currentStepId === "training" && (
              <TrainingSection
                data={formData}
                errors={visibleErrors}
                onChange={setFormData}
              />
            )}
            {currentStepId === "skills" && (
              <SkillsAvailabilitySection
                data={formData}
                errors={visibleErrors}
                onChange={setFormData}
              />
            )}
            {currentStepId === "documents" && (
              <DocumentsSection
                data={formData}
                errors={visibleErrors}
                onChange={setFormData}
              />
            )}
            {currentStepId === "review" && (
              <ReviewSection
                data={formData}
                errors={visibleErrors}
                compliance={compliance}
                managerName={managerName}
                onEdit={goToStep}
                onConfirmChange={(confirmed) =>
                  setFormData((previous) => ({ ...previous, confirmed }))
                }
              />
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-cf-border px-6 py-4">
          <Button
            variant="outline"
            className="border-cf-border bg-cf-surface text-cf-ink hover:bg-cf-surface-muted"
            onClick={step === 1 ? () => handleOpenChange(false) : handleBack}
          >
            {step > 1 && <ArrowLeft className="mr-1.5 h-4 w-4" />}
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <div className="flex items-center gap-3">
            {currentStepId !== "review" && showErrors && hasErrors(errors) && (
              <span className="text-xs text-destructive">
                {Object.keys(errors).length} field
                {Object.keys(errors).length === 1 ? "" : "s"} need attention
              </span>
            )}

            {currentStepId === "review" ? (
              <Button onClick={handleSubmit} disabled={!formData.confirmed}>
                Create Staff Member
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
