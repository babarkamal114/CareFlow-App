"use client";

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
import { StaffFormStepDots, StaffFormStepRail } from "@/components/ui";
import { ComplianceSection } from "./ComplianceSection";
import { DocumentsSection } from "./DocumentsSection";
import { EmploymentSection } from "./EmploymentSection";
import { PersonalSection } from "./PersonalSection";
import { ReviewSection } from "./ReviewSection";
import { SkillsAvailabilitySection } from "./SkillsAvailabilitySection";
import { TrainingSection } from "./TrainingSection";
import { STAFF_FORM_STEPS, STEP_TOTAL } from "types";
import { useAddStaffForm } from "hooks";



export function AddStaffModal() {
  const {
    open,
    step,
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
  } = useAddStaffForm();

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
                onConfirmChange={handleConfirmChange}
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
            {showErrorSummary && (
              <span className="text-xs text-destructive">
                {errorCount} field
                {errorCount === 1 ? "" : "s"} need attention
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
