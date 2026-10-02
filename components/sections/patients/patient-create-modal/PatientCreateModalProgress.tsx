'use client';

interface CreatePatientModalProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function CreatePatientModalProgress({
  currentStep,
  totalSteps,
  labels,
}: CreatePatientModalProgressProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-cf-ink">
          {labels[currentStep - 1]}
        </span>
        <span className="text-xs text-cf-ink-40">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="w-full h-1.5 bg-cf-surface-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--cf-brand-500)] rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}