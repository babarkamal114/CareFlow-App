"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
import { Button } from "@/components/ui";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { StepDots } from "./AddStaffFormPrimitives";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { EmploymentChecksStep } from "./EmploymentChecksStep";
import { ReviewConfirmStep } from "./ReviewConfirmStep";
import {
  ADD_STAFF_INITIAL_DATA,
  ADD_STAFF_MODAL_COPY,
  ADD_STAFF_RESET_DELAY_MS,
  ADD_STAFF_TOTAL_STEPS,
  getAddStaffStepTitle,
  getNextAddStaffStep,
  getPreviousAddStaffStep,
  isFirstAddStaffStep,
  isLastAddStaffStep,
  type AddStaffEmploymentInfo,
  type AddStaffFormData,
  type AddStaffPersonalInfo,
} from "utils";

interface StepContext {
  formData: AddStaffFormData;
  onPersonalChange: (personal: AddStaffPersonalInfo) => void;
  onEmploymentChange: (employment: AddStaffEmploymentInfo) => void;
  onEdit: (step: number) => void;
  onConfirmChange: (confirmed: boolean) => void;
}

// One entry per step number. Add a step = add an entry (and its title in utils).
const STEP_CONTENT: Record<number, (ctx: StepContext) => ReactNode> = {
  1: (ctx) => <PersonalInfoStep data={ctx.formData.personal} onChange={ctx.onPersonalChange} />,
  2: (ctx) => <EmploymentChecksStep data={ctx.formData.employment} onChange={ctx.onEmploymentChange} />,
  3: (ctx) => (
    <ReviewConfirmStep
      data={ctx.formData}
      onEdit={ctx.onEdit}
      onConfirmChange={ctx.onConfirmChange}
    />
  ),
};

export function AddStaffModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AddStaffFormData>(ADD_STAFF_INITIAL_DATA);

  const updatePersonal = (personal: AddStaffPersonalInfo) =>
    setFormData((prev) => ({ ...prev, personal }));

  const updateEmployment = (employment: AddStaffEmploymentInfo) =>
    setFormData((prev) => ({ ...prev, employment }));

  const updateConfirmed = (confirmed: boolean) =>
    setFormData((prev) => ({ ...prev, confirmed }));

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setFormData(ADD_STAFF_INITIAL_DATA);
      }, ADD_STAFF_RESET_DELAY_MS);
    }
  };

  const handleBack = () =>
    isFirstAddStaffStep(step) ? handleClose(false) : setStep(getPreviousAddStaffStep(step));

  const handleNext = () => setStep(getNextAddStaffStep(step));

  const handleSubmit = () => {
    // Wire up to your API here
    console.log("Create staff →", formData);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4" />
            {ADD_STAFF_MODAL_COPY.trigger}
          </Button>
        }
      />

      <DialogContent
        className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden border-border bg-card p-0"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-foreground">
                {ADD_STAFF_MODAL_COPY.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Step {step} of {ADD_STAFF_TOTAL_STEPS}: {getAddStaffStepTitle(step)}
              </p>
            </div>
            <StepDots current={step} />
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {STEP_CONTENT[step]({
            formData,
            onPersonalChange: updatePersonal,
            onEmploymentChange: updateEmployment,
            onEdit: setStep,
            onConfirmChange: updateConfirmed,
          })}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-4">
          <Button variant="outline" onClick={handleBack}>
            {isFirstAddStaffStep(step) ? (
              ADD_STAFF_MODAL_COPY.cancel
            ) : (
              <>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                {ADD_STAFF_MODAL_COPY.back}
              </>
            )}
          </Button>

          {isLastAddStaffStep(step) ? (
            <Button onClick={handleSubmit} disabled={!formData.confirmed}>
              {ADD_STAFF_MODAL_COPY.submit} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {ADD_STAFF_MODAL_COPY.next} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}