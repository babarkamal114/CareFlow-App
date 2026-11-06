'use client';

import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';

interface ScheduleHeaderSectionProps {
  onAddVisit: () => void;
}

export function ScheduleHeaderSection({ onAddVisit }: ScheduleHeaderSectionProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
          Scheduling
        </h1>
        <p className="text-sm text-cf-ink-60">
          View and manage staff schedules and patient visits
        </p>
      </div>
      <Button onClick={onAddVisit} className="gap-1.5">
        <Plus className="h-4 w-4" />
        Add Visit
      </Button>
    </div>
  );
}