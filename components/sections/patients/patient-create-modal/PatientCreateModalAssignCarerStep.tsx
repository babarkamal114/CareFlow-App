'use client';

import { Card, CardContent, Badge, Checkbox } from "@/components/ui";
import { AlertCircle } from 'lucide-react';
import { PatientFormData } from './PatientCreateModal';


const mockCarers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emma Williams' },
  { id: '4', name: 'David Smith' },
  { id: '5', name: 'Lisa Garcia' },
];

interface AssignCarersStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export function AssignCarersStep({
  formData,
  setFormData,
  errors,
  setErrors,
}: AssignCarersStepProps) {
  const handleCarerToggle = (carerId: string) => {
    setFormData({
      ...formData,
      selectedCarers: formData.selectedCarers.includes(carerId)
        ? formData.selectedCarers.filter((id: string) => id !== carerId)
        : [...formData.selectedCarers, carerId],
    });
    if (errors.carers) {
      setErrors({ ...errors, carers: '' });
    }
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

      <div className="space-y-2">
        {mockCarers.map((carer) => (
          <Card
            key={carer.id}
            className={`border-cf-border cursor-pointer transition-colors ${
              formData.selectedCarers.includes(carer.id)
                ? 'bg-cf-primary/10'
                : 'hover:bg-cf-surface-muted/50'
            }`}
            onClick={() => handleCarerToggle(carer.id)}
          >
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <Checkbox
                checked={formData.selectedCarers.includes(carer.id)}
                readOnly
                className="cursor-pointer"
              />
              <span className="text-sm font-medium text-cf-ink">
                {carer.name}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.selectedCarers.length > 0 && (
        <div className="p-3 bg-cf-surface-muted rounded-lg">
          <p className="text-xs font-medium text-cf-ink-60 mb-2">
            Selected Carers:
          </p>
          <div className="flex flex-wrap gap-2">
            {formData.selectedCarers.map((carerId: string) => {
              const carer = mockCarers.find((c) => c.id === carerId);
              return (
                <Badge
                  key={carerId}
                  variant="pastel-info"
                  className="text-xs"
                >
                  {carer?.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}