'use client';

import { Card, CardContent, Badge, Checkbox } from "@/components/ui";
import { AlertCircle } from 'lucide-react';
import { getCarerName, toggleCarer, type Carer } from 'utils';
import type { PatientFormData } from 'utils';

interface AssignCarersStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  carers: Carer[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

function CarerCardSkeleton() {
  return (
    <Card className="border-cf-border">
      <CardContent className="py-3 px-4 flex items-center gap-3">
        <div className="h-4 w-4 rounded bg-cf-ink-40/20 animate-pulse" />
        <div className="h-3.5 w-36 rounded bg-cf-ink-40/20 animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function AssignCarersStep({
  formData,
  setFormData,
  errors,
  setErrors,
  carers,
  isLoading,
  error,
  onRetry,
}: AssignCarersStepProps) {
  const handleCarerToggle = (carerId: string) => {
    setFormData({
      ...formData,
      selectedCarers: toggleCarer(formData.selectedCarers, carerId),
    });
    if (errors.carers) {
      setErrors({ ...errors, carers: '' });
    }
  };

  const renderCarerList = () => {
    if (error) {
      return (
        <div className="flex items-center justify-between text-sm py-4">
          <span className="text-cf-ink-60">Couldn&apos;t load carers.</span>
          <button onClick={onRetry} className="font-semibold text-cf-ink underline">
            Retry
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <CarerCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (carers.length === 0) {
      return (
        <p className="text-sm text-cf-ink-60 text-center py-6">No carers available</p>
      );
    }

    return (
      <div className="space-y-2">
        {carers.map((carer) => {
          const isSelected = formData.selectedCarers.includes(carer.id);

          return (
            <Card
              key={carer.id}
              className={`border-cf-border cursor-pointer transition-colors ${
                isSelected ? 'bg-cf-primary/10' : 'hover:bg-cf-surface-muted/50'
              }`}
              onClick={() => handleCarerToggle(carer.id)}
            >
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Checkbox checked={isSelected} readOnly className="cursor-pointer" />
                <span className="text-sm font-medium text-cf-ink">{carer.name}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">Assign Carers</h3>
      <p className="text-sm text-cf-ink-60">
        Select at least one carer for this patient
      </p>

      {errors.carers && (
        <div className="flex items-center gap-2 p-3 bg-[var(--cf-error-muted)] border border-[var(--cf-error)]/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-[var(--cf-error)] flex-shrink-0" />
          <p className="text-xs text-[var(--cf-error)]">{errors.carers}</p>
        </div>
      )}

      {renderCarerList()}

      {formData.selectedCarers.length > 0 && (
        <div className="p-3 bg-cf-surface-muted rounded-lg">
          <p className="text-xs font-medium text-cf-ink-60 mb-2">
            Selected Carers:
          </p>
          <div className="flex flex-wrap gap-2">
            {formData.selectedCarers.map((carerId) => (
              <Badge key={carerId} variant="pastel-info" className="text-xs">
                {getCarerName(carers, carerId)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}