'use client';

import { format } from 'date-fns';

interface VisitSummaryProps {
  patient?: { id: string; name: string };
  carer?: { id: string; name: string };
  title: string;
  date: Date;
  startTime: string;
}

export function VisitSummary({
  patient,
  carer,
  title,
  date,
  startTime,
}: VisitSummaryProps) {
  if (!patient && !carer && !title) return null;

  return (
    <div className="p-3 bg-cf-surface-muted rounded-lg space-y-1">
      <p className="text-xs font-medium text-cf-ink-60">Summary</p>
      {patient && (
        <p className="text-sm text-cf-ink">
          Patient: <span className="font-medium">{patient.name}</span>
        </p>
      )}
      {carer && (
        <p className="text-sm text-cf-ink">
          Carer: <span className="font-medium">{carer.name}</span>
        </p>
      )}
      {title && (
        <p className="text-sm text-cf-ink">
          Title: <span className="font-medium">{title}</span>
        </p>
      )}
      {date && startTime && (
        <p className="text-sm text-cf-ink">
          Time:{' '}
          <span className="font-medium">
            {format(date, 'dd MMM yyyy')} at {startTime}
          </span>
        </p>
      )}
    </div>
  );
}