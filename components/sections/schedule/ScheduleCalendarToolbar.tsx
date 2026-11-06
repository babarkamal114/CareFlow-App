'use client';

import {
  AlertTriangle,
  CalendarX,
  Layers,
  ListChecks,
  Repeat,
  Sparkles,
  UserMinus,
  UserX,
} from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScheduleFilterBar,
} from '@/components/ui';
import type { ScheduleFilters } from 'types';

interface ScheduleCalendarToolbarProps {
  filters: ScheduleFilters;
  carers: { id: string; name: string }[];
  patients: { id: string; name: string }[];
  onFiltersChange: (filters: ScheduleFilters) => void;
  /** Visits in view that have at least one conflict. */
  conflictCount: number;
  isAiScheduling: boolean;
  onAiSchedule: () => void;
  onCreateRecurring: () => void;
  onManageTemplates: () => void;
  onWhatIf: () => void;
  onBulkCancelWeek: () => void;
  onBulkReassignCarer: () => void;
}

export function ScheduleCalendarToolbar({
  filters,
  carers,
  patients,
  onFiltersChange,
  conflictCount,
  isAiScheduling,
  onAiSchedule,
  onCreateRecurring,
  onManageTemplates,
  onWhatIf,
  onBulkCancelWeek,
  onBulkReassignCarer,
}: ScheduleCalendarToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ScheduleFilterBar
          filters={filters}
          carers={carers}
          patients={patients}
          onFiltersChange={onFiltersChange}
        />
        {conflictCount > 0 && (
          <Badge variant="softDanger" shape="pill">
            <AlertTriangle className="size-3.5" />
            {conflictCount} conflict{conflictCount === 1 ? '' : 's'} to review
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cf-border bg-cf-surface px-3 text-xs font-medium text-cf-ink transition-colors hover:bg-cf-surface-muted">
            <Layers className="size-3.5" />
            Bulk actions
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCreateRecurring}>
              <Repeat />
              Create recurring visits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onManageTemplates}>
              <ListChecks />
              Manage visit templates
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onWhatIf}>
              <UserMinus />
              What if a carer is off?
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkCancelWeek}>
              <CalendarX />
              Cancel a patient&apos;s week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkReassignCarer}>
              <UserX />
              Reassign a carer&apos;s visits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onAiSchedule} loading={isAiScheduling} className="gap-1.5">
          {!isAiScheduling && <Sparkles />}
          {isAiScheduling ? 'Optimising…' : 'AI Scheduler'}
        </Button>
      </div>
    </div>
  );
}