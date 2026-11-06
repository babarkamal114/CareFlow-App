'use client';

import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';

interface ScheduleHeaderSectionProps {
  onAddVisit: () => void;
}

export function ScheduleHeaderSection({ onAddVisit }: ScheduleHeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-cf-ink">Scheduling</h1>
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