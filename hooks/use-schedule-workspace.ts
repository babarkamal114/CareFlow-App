'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  SCHEDULE_MOCK_NOW,
  SCHEDULE_MOCK_TODAY,
  scheduleMockCapacity,
  scheduleMockCarers,
  scheduleMockPatients,
  scheduleMockSwaps,
  scheduleMockTemplates,
  scheduleMockVisits,
} from 'lib';
import type {
  OptimiseDialogMode,
  ScheduleCalendarEvent,
  ScheduleCalendarResource,
  ScheduleContext,
  ScheduleFilters,
  ScheduleView,
  ScheduleVisit,
  ShiftSwapRequest,
  VisitFormData,
  VisitTemplate,
} from 'types';
import {
  DEFAULT_SCHEDULE_FILTERS,
  UNASSIGNED_RESOURCE_ID,
  convertVisitToEvent,
  filterVisits,
  getAllVisitIssues,
  getUnassignedVisits,
  parseIsoDate,
  toHHmm,
  toIsoDate,
} from 'utils';
import { useScheduleVisitActions } from './use-schedule-visit-actions';

export type ScheduleModalName = 'detail' | 'add' | 'edit' | 'recurring' | 'templates' | 'optimise';

const AI_THINKING_MS = 900;

/** Owns all state for the scheduling page. Sections receive what they need as props. */
export function useScheduleWorkspace() {
  const todayIso = SCHEDULE_MOCK_TODAY;

  /* ── Data ─────────────────────────────────────────────────── */
  const [visits, setVisits] = useState<ScheduleVisit[]>(scheduleMockVisits);
  const [templates, setTemplates] = useState<VisitTemplate[]>(scheduleMockTemplates);
  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>(scheduleMockSwaps);

  /* ── View state ───────────────────────────────────────────── */
  const [date, setDate] = useState<Date>(() => parseIsoDate(todayIso));
  const [view, setView] = useState<ScheduleView>('week');
  const [filters, setFilters] = useState<ScheduleFilters>(DEFAULT_SCHEDULE_FILTERS);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [draggedVisitId, setDraggedVisitId] = useState<string | null>(null);
  const [isAiScheduling, setIsAiScheduling] = useState(false);

  /* ── Modals (one open at a time) ──────────────────────────── */
  const [activeModal, setActiveModal] = useState<ScheduleModalName | null>(null);
  const [addDefaults, setAddDefaults] = useState<Partial<VisitFormData>>({});
  const [optimiseMode, setOptimiseMode] = useState<OptimiseDialogMode>({ kind: 'what-if' });

  const closeModal = useCallback(() => setActiveModal(null), []);

  /* ── Derived data ─────────────────────────────────────────── */
  const context = useMemo<ScheduleContext>(
    () => ({ visits, carers: scheduleMockCarers, patients: scheduleMockPatients }),
    [visits]
  );

  const filteredVisits = useMemo(() => filterVisits(visits, filters), [visits, filters]);
  const events = useMemo<ScheduleCalendarEvent[]>(
    () => convertVisitToEvent(filteredVisits),
    [filteredVisits]
  );
  const issuesByVisitId = useMemo(() => getAllVisitIssues(context), [context]);
  const conflictCount = useMemo(
    () => filteredVisits.filter((v) => (issuesByVisitId[v.id]?.conflicts.length ?? 0) > 0).length,
    [filteredVisits, issuesByVisitId]
  );
  const unassignedVisits = useMemo(() => getUnassignedVisits(visits), [visits]);
  const selectedVisit = useMemo(
    () => visits.find((v) => v.id === selectedVisitId) ?? null,
    [visits, selectedVisitId]
  );
  const resources = useMemo<ScheduleCalendarResource[]>(
    () => [
      ...scheduleMockCarers.map((c) => ({ id: c.id, title: c.name })),
      { id: UNASSIGNED_RESOURCE_ID, title: 'Unassigned' },
    ],
    []
  );
  const skillOptions = useMemo(
    () => Array.from(new Set(scheduleMockCarers.flatMap((c) => c.skills))),
    []
  );

  /* ── Opening modals ───────────────────────────────────────── */
  const openAssign = useCallback((visitIds: string[]) => {
    setOptimiseMode({ kind: 'assign', visitIds });
    setActiveModal('optimise');
  }, []);

  const openAddVisit = useCallback(() => {
    setAddDefaults({ date: toIsoDate(date) });
    setActiveModal('add');
  }, [date]);

  const openWhatIf = useCallback(() => {
    setOptimiseMode({ kind: 'what-if' });
    setActiveModal('optimise');
  }, []);

  const openRecurring = useCallback(() => setActiveModal('recurring'), []);
  const openTemplates = useCallback(() => setActiveModal('templates'), []);
  const openEdit = useCallback(() => setActiveModal('edit'), []);

  /** The detail modal's "Assign carer" button. */
  const assignFromDetail = useCallback(
    (visitId: string) => openAssign([visitId]),
    [openAssign]
  );

  /* ── Calendar interaction ─────────────────────────────────── */
  const selectEvent = useCallback((event: ScheduleCalendarEvent) => {
    setSelectedVisitId(event.id);
    setActiveModal('detail');
  }, []);

  /** Clicking an empty slot opens Add Visit pre-filled with that day, time and length. */
  const selectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
      const fromTimeGrid = view !== 'month';
      setAddDefaults({
        date: toIsoDate(start),
        ...(fromTimeGrid
          ? { startTime: toHHmm(start), durationMinutes: minutes >= 15 && minutes <= 480 ? minutes : 60 }
          : {}),
      });
      setActiveModal('add');
    },
    [view]
  );

  /** Calendar toolbar "AI Scheduler": think for a moment, then show the suggestions for review. */
  const runAiSchedule = useCallback(async () => {
    const ids = getUnassignedVisits(visits).map((v) => v.id);
    if (ids.length === 0) {
      toast.info('Nothing to schedule', { description: 'Every visit already has a carer.' });
      return;
    }
    setIsAiScheduling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, AI_THINKING_MS));
      openAssign(ids);
    } finally {
      setIsAiScheduling(false);
    }
  }, [visits, openAssign]);

  /* ── Data changes ─────────────────────────────────────────── */
  const actions = useScheduleVisitActions({
    context,
    templates,
    swaps,
    setVisits,
    setTemplates,
    setSwaps,
    onAssignVisit: (visitId) => openAssign([visitId]),
  });

  return {
    // Fixed mock clock
    todayIso,
    nowIso: SCHEDULE_MOCK_NOW,
    // Data
    carers: scheduleMockCarers,
    patients: scheduleMockPatients,
    capacity: scheduleMockCapacity,
    visits,
    templates,
    swaps,
    context,
    events,
    resources,
    skillOptions,
    unassignedVisits,
    issuesByVisitId,
    conflictCount,
    selectedVisit,
    // View state
    date,
    setDate,
    view,
    setView,
    filters,
    setFilters,
    draggedVisitId,
    setDraggedVisitId,
    isAiScheduling,
    // Modals
    activeModal,
    closeModal,
    addDefaults,
    optimiseMode,
    openAddVisit,
    openEdit,
    openRecurring,
    openTemplates,
    openWhatIf,
    openAssign,
    assignFromDetail,
    // Calendar handlers
    selectEvent,
    selectSlot,
    runAiSchedule,
    // Data actions
    ...actions,
  };
}

export type ScheduleWorkspace = ReturnType<typeof useScheduleWorkspace>;