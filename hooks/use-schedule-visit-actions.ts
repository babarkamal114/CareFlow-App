'use client';

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import type {
  EditVisitFormData,
  RecurringVisitFormData,
  ScheduleAssignment,
  ScheduleContext,
  ScheduleVisit,
  ShiftSwapRequest,
  VisitFormData,
  VisitTemplate,
  VisitTemplateFormData,
} from 'types';
import {
  UNASSIGNED_RESOURCE_ID,
  createScheduleId,
  detectVisitConflicts,
  expandRecurringRule,
  formDataToVisit,
  formatShortDate,
  hasBlockingConflict,
  recurringFormToRule,
  templateFormToTemplate,
  toHHmm,
  toIsoDate,
} from 'utils';

/** Stands in for the network round trip so buttons show their loading state. */
function simulateRequest(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}

interface VisitActionsArgs {
  context: ScheduleContext;
  templates: VisitTemplate[];
  swaps: ShiftSwapRequest[];
  setVisits: Dispatch<SetStateAction<ScheduleVisit[]>>;
  setTemplates: Dispatch<SetStateAction<VisitTemplate[]>>;
  setSwaps: Dispatch<SetStateAction<ShiftSwapRequest[]>>;
  /** Called after an unassigned visit is dropped on the calendar, to ask who should take it. */
  onAssignVisit: (visitId: string) => void;
}

/** Everything that changes schedule data. Mock-only: swap the bodies for API calls later. */
export function useScheduleVisitActions({
  context,
  templates,
  swaps,
  setVisits,
  setTemplates,
  setSwaps,
  onAssignVisit,
}: VisitActionsArgs) {
  /* ── Add and edit ─────────────────────────────────────────── */

  const addVisit = useCallback(
    async (data: VisitFormData) => {
      await simulateRequest();
      const visit = formDataToVisit(data, createScheduleId('v'), context, { templates });
      setVisits((prev) => [...prev, visit]);
      toast.success(visit.carerId ? 'Visit scheduled' : 'Visit added as unassigned', {
        description: `${visit.patientName} · ${formatShortDate(visit.date)} ${visit.startTime}`,
      });
    },
    [context, templates, setVisits]
  );

  const editVisit = useCallback(
    async (visitId: string, data: EditVisitFormData) => {
      const base = context.visits.find((v) => v.id === visitId);
      if (!base) {
        toast.error('Visit not found');
        return;
      }
      await simulateRequest();
      const updated = formDataToVisit(data, visitId, context, {
        base,
        templates,
        status: data.status === '' ? base.status : data.status,
      });
      setVisits((prev) => prev.map((v) => (v.id === visitId ? updated : v)));
      toast.success('Visit updated', { description: updated.patientName });
    },
    [context, templates, setVisits]
  );

  /* ── Drag, drop and resize ────────────────────────────────── */

  /**
   * Moves a visit in time and, in the day view, to another carer column.
   * Returns false (and tells the user why) if the new slot has a blocking conflict.
   */
  const moveVisit = useCallback(
    (visitId: string, start: Date, end: Date, resourceId?: string): boolean => {
      const existing = context.visits.find((v) => v.id === visitId);
      if (!existing) {
        toast.error('Visit not found');
        return false;
      }

      const date = toIsoDate(start);
      if (toIsoDate(end) !== date) {
        toast.warning('A visit has to finish on the day it starts');
        return false;
      }

      const carerId =
        resourceId === undefined
          ? existing.carerId
          : resourceId === UNASSIGNED_RESOURCE_ID
            ? null
            : resourceId;
      const carer = context.carers.find((c) => c.id === carerId);
      const moved: ScheduleVisit = {
        ...existing,
        date,
        startTime: toHHmm(start),
        endTime: toHHmm(end),
        carerId: carer ? carer.id : null,
        carerName: carer?.name ?? '',
      };

      const conflicts = detectVisitConflicts(moved, context);
      const blocking = conflicts.find((c) => c.severity === 'error');
      if (blocking) {
        toast.warning(blocking.message, { description: 'Choose a different time slot or carer' });
        return false;
      }

      setVisits((prev) => prev.map((v) => (v.id === visitId ? moved : v)));

      const carerChanged = moved.carerId !== existing.carerId;
      const warning = conflicts[0];
      if (warning) {
        toast.warning(`Moved, but: ${warning.message}`, { description: existing.patientName });
      } else {
        toast.success(`Visit moved to ${formatShortDate(date)} ${moved.startTime} - ${moved.endTime}`, {
          description: carerChanged
            ? `${existing.patientName} · now with ${moved.carerName || 'no carer'}`
            : existing.patientName,
        });
      }
      return true;
    },
    [context, setVisits]
  );

  /** An unassigned visit dropped on a slot gets that time, then we ask who should take it. */
  const dropVisitFromOutside = useCallback(
    (visitId: string, slot: { start: Date; end: Date }) => {
      if (moveVisit(visitId, slot.start, slot.end)) onAssignVisit(visitId);
    },
    [moveVisit, onAssignVisit]
  );

  /* ── AI and what-if ───────────────────────────────────────── */

  const applyAssignments = useCallback(
    (assignments: ScheduleAssignment[]) => {
      const byVisit = new Map(assignments.map((a) => [a.visitId, a.carerId]));
      setVisits((prev) =>
        prev.map((visit) => {
          const carerId = byVisit.get(visit.id);
          const carer = context.carers.find((c) => c.id === carerId);
          return carer ? { ...visit, carerId: carer.id, carerName: carer.name } : visit;
        })
      );
      toast.success(`${assignments.length} visit${assignments.length === 1 ? '' : 's'} assigned`);
    },
    [context.carers, setVisits]
  );

  /* ── Recurring visits and templates ───────────────────────── */

  const createRecurring = useCallback(
    async (data: RecurringVisitFormData) => {
      await simulateRequest();
      const rule = recurringFormToRule(data, createScheduleId('r'));
      const generated = expandRecurringRule(rule, context, templates);
      const combined = { ...context, visits: [...context.visits, ...generated] };
      const clashing = generated.filter((v) =>
        hasBlockingConflict(detectVisitConflicts(v, combined))
      ).length;

      setVisits((prev) => [...prev, ...generated]);
      toast.success(`${generated.length} recurring visit${generated.length === 1 ? '' : 's'} created`, {
        description: clashing > 0 ? `${clashing} have a clash to review` : undefined,
      });
    },
    [context, templates, setVisits]
  );

  const saveTemplate = useCallback(
    (data: VisitTemplateFormData) => {
      const template = templateFormToTemplate(data, createScheduleId('t'));
      setTemplates((prev) => [...prev, template]);
      toast.success('Template added', { description: template.name });
    },
    [setTemplates]
  );

  const deleteTemplate = useCallback(
    (templateId: string) => {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      toast.info('Template deleted');
    },
    [setTemplates]
  );

  /* ── Shift swaps ──────────────────────────────────────────── */

  /** Approving a swap moves the requester's scheduled visits inside the shift to the other carer. */
  const approveSwap = useCallback(
    (swapId: string) => {
      const swap = swaps.find((s) => s.id === swapId);
      if (!swap) return;
      const target = context.carers.find((c) => c.id === swap.targetId);
      const affected = context.visits.filter(
        (v) =>
          v.carerId === swap.requesterId &&
          v.date === swap.date &&
          v.status === 'scheduled' &&
          v.startTime >= swap.startTime &&
          v.endTime <= swap.endTime
      );
      const affectedIds = new Set(affected.map((v) => v.id));

      setSwaps((prev) => prev.map((s) => (s.id === swap.id ? { ...s, status: 'approved' } : s)));
      if (target && affectedIds.size > 0) {
        setVisits((prev) =>
          prev.map((v) =>
            affectedIds.has(v.id) ? { ...v, carerId: target.id, carerName: target.name } : v
          )
        );
      }

      if (swap.conflictMessage) {
        toast.warning('Swap approved with a known clash', { description: swap.conflictMessage });
      } else {
        toast.success('Swap approved', {
          description: `${affectedIds.size} visit${affectedIds.size === 1 ? '' : 's'} moved to ${swap.targetName}`,
        });
      }
    },
    [context, swaps, setSwaps, setVisits]
  );

  const rejectSwap = useCallback(
    (swapId: string) => {
      setSwaps((prev) => prev.map((s) => (s.id === swapId ? { ...s, status: 'declined' } : s)));
      toast.info('Swap declined');
    },
    [setSwaps]
  );

  /* ── Bulk actions still to build ──────────────────────────── */

  // Each needs its own confirmation modal (scope, reason, preview) before it touches data.
  const bulkCancelWeek = useCallback(() => {
    toast.info("Cancel a patient's week", {
      description: 'This needs a dedicated modal with patient selection and confirmation.',
    });
  }, []);

  const bulkReassignCarer = useCallback(() => {
    toast.info("Reassign a carer's visits", {
      description: 'This needs a dedicated modal with carer selection and confirmation.',
    });
  }, []);

  return {
    addVisit,
    editVisit,
    moveVisit,
    dropVisitFromOutside,
    applyAssignments,
    createRecurring,
    saveTemplate,
    deleteTemplate,
    approveSwap,
    rejectSwap,
    bulkCancelWeek,
    bulkReassignCarer,
  };
}