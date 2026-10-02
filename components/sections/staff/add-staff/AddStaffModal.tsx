"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "ui-components";
import { Button } from "ui-components";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { StepDots } from "./AddStaffFormPrimitives";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { EmploymentChecksStep } from "./EmploymentChecksStep";
import { ReviewConfirmStep } from "./ReviewConfirmStep";
import { INITIAL_DATA, STEP_TITLES } from "./types";
import type { AddStaffFormData, PersonalInfo, EmploymentInfo } from "./types";

export function AddStaffModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AddStaffFormData>(INITIAL_DATA);

  const updatePersonal = (personal: PersonalInfo) =>
    setFormData((prev) => ({ ...prev, personal }));

  const updateEmployment = (employment: EmploymentInfo) =>
    setFormData((prev) => ({ ...prev, employment }));

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setFormData(INITIAL_DATA);
      }, 200);
    }
  };

  const handleSubmit = () => {
    // Wire up to your API here
    console.log("Create staff →", formData);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger render={<Button><Plus className="h-4 w-4" />Add Staff Member</Button>} />

      <DialogContent
        className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden border-cf-border bg-cf-surface p-0"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 border-b border-cf-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-cf-ink">
                Add New Staff Member
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Step {step} of 3: {STEP_TITLES[step - 1]}
              </p>
            </div>
            <StepDots current={step} />
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && <PersonalInfoStep data={formData.personal} onChange={updatePersonal} />}
          {step === 2 && <EmploymentChecksStep data={formData.employment} onChange={updateEmployment} />}
          {step === 3 && (
            <ReviewConfirmStep
              data={formData}
              onEdit={(s) => setStep(s)}
              onConfirmChange={(v) => setFormData((prev) => ({ ...prev, confirmed: v }))}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-cf-border px-6 py-4">
          <Button
            variant="outline"
            className="border-cf-border"
            onClick={() => (step === 1 ? handleClose(false) : setStep((s) => s - 1))}
          >
            {step === 1 ? "Cancel" : <><ArrowLeft className="mr-1.5 h-4 w-4" />Back</>}
          </Button>

          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!formData.confirmed}>
              Create Staff Member <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
