'use client';

import { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Progress,
} from '@/components/ui';
import {
  buildIncidentPayload,
  canAdvanceIncidentStep,
  getDefaultIncidentFormData,
  getIncidentStepCount,
  getIncidentStepProgress,
  INCIDENT_REPORT_STEPS,
} from 'utils';
import type {
  Incident,
  IncidentFormData,
  IncidentFormUpdate,
} from 'types';
import { IncidentDetailsStep } from './IncidentDetailsStep';
import { IncidentNarrativeStep } from './IncidentNarrativeStep';
import { IncidentInjuriesStep } from './IncidentInjuriesStep';
import { IncidentResponseStep } from './IncidentResponseStep';
import { IncidentFollowUpStep } from './IncidentFollowUpStep';
import { IncidentReviewStep } from './IncidentReviewStep';

interface ReportIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function ReportIncidentModal({
  open,
  onOpenChange,
  onSubmit,
}: ReportIncidentModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<IncidentFormData>(getDefaultIncidentFormData);

  const stepCount = getIncidentStepCount();
  const step = INCIDENT_REPORT_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === stepCount - 1;
  const canContinue = canAdvanceIncidentStep(stepIndex, form);

  const update = useCallback<IncidentFormUpdate>((field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  }, []);

  const replace = useCallback((nextForm: IncidentFormData) => {
    setForm(nextForm);
  }, []);

  const handleClose = () => {
    setStepIndex(0);
    setForm(getDefaultIncidentFormData());
    onOpenChange(false);
  };

  const handleSubmit = () => {
    onSubmit(buildIncidentPayload(form));
    handleClose();
  };

  const stepProps = { form, update, replace };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="full"
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col overflow-hidden p-0"
      >
        <DialogHeader className="gap-3 border-b border-cf-border p-6">
          <div>
            <DialogTitle className="text-xl font-bold text-cf-ink">
              Report Incident / Safeguarding Concern
            </DialogTitle>
            <DialogDescription className="text-cf-ink-60">
              {step.description}
            </DialogDescription>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-cf-ink-60">
              <span>
                Step {stepIndex + 1} of {stepCount} · {step.title}
              </span>
              <span>{getIncidentStepProgress(stepIndex)}% complete</span>
            </div>
            <Progress value={getIncidentStepProgress(stepIndex)} className="h-1.5" />
            <div className="flex flex-wrap gap-2 pt-1">
              {INCIDENT_REPORT_STEPS.map((item, index) => (
                <span
                  key={item.title}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    index === stepIndex
                      ? 'bg-brand-500 text-white'
                      : index < stepIndex
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-cf-surface-muted text-cf-ink-40'
                  }`}
                >
                  {index < stepIndex && <Check className="size-3" />}
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {stepIndex === 0 && <IncidentDetailsStep {...stepProps} />}
          {stepIndex === 1 && <IncidentNarrativeStep {...stepProps} />}
          {stepIndex === 2 && <IncidentInjuriesStep {...stepProps} />}
          {stepIndex === 3 && <IncidentResponseStep {...stepProps} />}
          {stepIndex === 4 && <IncidentFollowUpStep {...stepProps} />}
          {stepIndex === 5 && <IncidentReviewStep {...stepProps} />}
        </div>

        <DialogFooter className="mx-0 mb-0 flex-col items-stretch gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            {!canContinue && !isLastStep && (
              <p className="text-xs text-cf-ink-60">
                Complete the required fields marked * to continue.
              </p>
            )}
            {isLastStep && (
              <p className="text-xs text-cf-ink-60">
                Review the summary above before submitting the report.
              </p>
            )}
          </div>
          <div className="flex gap-2 sm:justify-end">
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStepIndex((index) => index - 1)}
              >
                Back
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            {isLastStep ? (
              <Button type="button" onClick={handleSubmit}>
                Submit Incident Report
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!canContinue}
                onClick={() => setStepIndex((index) => index + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}