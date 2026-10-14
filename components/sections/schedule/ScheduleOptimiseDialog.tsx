'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AiSuggestionRow,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScheduleSelect,
} from '@/components/ui';
import type {
  OptimiseDialogMode,
  ScheduleAssignment,
  ScheduleContext,
  ScheduleSuggestion,
  ScheduleVisit,
  VisitIssues,
} from 'types';
import {
  addDaysIso,
  getVisitIssues,
  runWhatIf,
  suggestAssignments,
  toSelectOptions,
} from 'utils';

interface ScheduleOptimiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: OptimiseDialogMode;
  context: ScheduleContext;
  /** ISO date treated as "today". The what-if date defaults to tomorrow. */
  todayIso: string;
  onApply: (assignments: ScheduleAssignment[]) => void;
}

interface Plan {
  visits: ScheduleVisit[];
  suggestions: ScheduleSuggestion[];
}

export function ScheduleOptimiseDialog({
  open,
  onOpenChange,
  mode,
  context,
  todayIso,
  onApply,
}: ScheduleOptimiseDialogProps) {
  const [absentCarerId, setAbsentCarerId] = useState('');
  const [whatIfDate, setWhatIfDate] = useState('');
  const [selection, setSelection] = useState<Record<string, string>>({});

  const isWhatIf = mode.kind === 'what-if';
  const carerOptions = useMemo(() => toSelectOptions(context.carers), [context.carers]);

  useEffect(() => {
    if (open && isWhatIf) {
      setAbsentCarerId((current) => current || (context.carers[0]?.id ?? ''));
      setWhatIfDate((current) => current || addDaysIso(todayIso, 1));
    }
  }, [open, isWhatIf, context.carers, todayIso]);

  const plan = useMemo<Plan>(() => {
    if (!open) return { visits: [], suggestions: [] };

    if (mode.kind === 'assign') {
      const visits = context.visits.filter((v) => mode.visitIds.includes(v.id) && v.carerId === null);
      return { visits, suggestions: suggestAssignments(visits, context).suggestions };
    }

    if (!absentCarerId || !whatIfDate) return { visits: [], suggestions: [] };
    const result = runWhatIf(absentCarerId, whatIfDate, context);
    const visits = context.visits.filter(
      (v) => v.carerId === absentCarerId && v.date === whatIfDate && v.status === 'scheduled'
    );
    return { visits, suggestions: result.reassignments };
  }, [open, mode, context, absentCarerId, whatIfDate]);

  // Start from the suggestions whenever the plan changes. The coordinator can then override any row.
  useEffect(() => {
    setSelection(Object.fromEntries(plan.suggestions.map((s) => [s.visitId, s.carerId])));
  }, [plan]);

  const issuesFor = (visit: ScheduleVisit, carerId: string): VisitIssues | undefined =>
    carerId === ''
      ? undefined
      : getVisitIssues(
          { ...visit, carerId, carerName: context.carers.find((c) => c.id === carerId)?.name ?? '' },
          context
        );

  const assignments: ScheduleAssignment[] = Object.entries(selection)
    .filter(([, carerId]) => carerId !== '')
    .map(([visitId, carerId]) => ({ visitId, carerId }));

  const handleApply = () => {
    onApply(assignments);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isWhatIf ? 'What if a carer is off?' : 'AI schedule suggestions'}</DialogTitle>
          <DialogDescription>
            {isWhatIf
              ? 'Pick a carer and a day to see the best way to cover their visits.'
              : 'These are suggestions. Change any carer before applying. Nothing is saved until you apply.'}
          </DialogDescription>
        </DialogHeader>

        {isWhatIf && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ScheduleSelect
              aria-label="Carer who is off"
              value={absentCarerId}
              options={carerOptions}
              placeholder="Select carer"
              onValueChange={setAbsentCarerId}
            />
            <Input
              type="date"
              aria-label="Day they are off"
              value={whatIfDate}
              onChange={(event) => setWhatIfDate(event.target.value)}
            />
          </div>
        )}

        <div className="space-y-3">
          {plan.visits.length === 0 && (
            <p className="py-6 text-center text-sm text-cf-ink-60">
              {isWhatIf ? 'This carer has no scheduled visits on that day.' : 'There are no visits to assign.'}
            </p>
          )}
          {plan.visits.map((visit) => (
            <AiSuggestionRow
              key={visit.id}
              visit={visit}
              suggestion={plan.suggestions.find((s) => s.visitId === visit.id)}
              carerOptions={carerOptions}
              selectedCarerId={selection[visit.id] ?? ''}
              selectedIssues={issuesFor(visit, selection[visit.id] ?? '')}
              onCarerChange={(carerId) => setSelection((prev) => ({ ...prev, [visit.id]: carerId }))}
            />
          ))}
        </div>

        <DialogFooter className="flex items-center gap-3 sm:justify-between">
          <p className="text-xs text-cf-ink-60">
            {assignments.length} of {plan.visits.length} visit{plan.visits.length === 1 ? '' : 's'} will be assigned
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={assignments.length === 0} onClick={handleApply}>
              Apply {assignments.length > 0 ? `${assignments.length} ` : ''}assignment
              {assignments.length === 1 ? '' : 's'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}