'use client';

import { AlertTriangle } from 'lucide-react';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Checkbox,
  Label,
} from '@/components/ui';

export function StaffConfirmGate({
  confirmed,
  error,
  onChange,
}: {
  confirmed: boolean;
  error?: string;
  onChange: (confirmed: boolean) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-cf-surface-inset px-4 py-3">
        <Checkbox
          id="confirmStaffDetails"
          className="mt-0.5"
          checked={confirmed}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <Label htmlFor="confirmStaffDetails" className="font-medium text-cf-ink">
          I confirm these details are accurate and complete
        </Label>
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );
}

export function StaffSchedulingNotice({
  canBeScheduled,
}: {
  canBeScheduled: boolean;
}) {
  if (canBeScheduled) return null;

  return (
    <Alert variant="warning">
      <AlertIcon>
        <AlertTriangle />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Before scheduling</AlertTitle>
        <AlertDescription>
          This staff member will be created with an onboarding status. Their
          manager must clear the outstanding vetting and training items before
          they can be allocated to visits.
        </AlertDescription>
      </AlertContent>
    </Alert>
  );
}

export function StaffComputedFieldsNotice() {
  return (
    <Alert variant="default">
      <AlertContent>
        <AlertDescription>
          The compliance status, schedulability and first supervision date are
          calculated automatically from the answers above. They are not edited
          directly.
        </AlertDescription>
      </AlertContent>
    </Alert>
  );
}