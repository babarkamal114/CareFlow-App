'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, dayjsLocalizer, NavigateAction, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { dayStyleGetter, eventStyleGetter } from 'utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { AlertTriangle, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '@/components/styles/calendar.css';

const localizer = dayjsLocalizer(dayjs);
// react-big-calendar's DnD addon types `start`/`end` as `stringOrDate` and infers a bare
// `object` event type, which then conflicts with our `Date`-based callback signatures below.
// The addon works fine at runtime with Date objects (via dayjsLocalizer) — this cast just
// relaxes the compile-time contract instead of fighting the library's generics.
const DragAndDropCalendar = withDragAndDrop(Calendar) as React.ComponentType<any>;

export interface ScheduleFilters {
  carerId: string;
  patientId: string;
  area: string;
  status: string;
}

const defaultFilters: ScheduleFilters = {
  carerId: 'all',
  patientId: 'all',
  area: 'all',
  status: 'all',
};

interface Option {
  id: string;
  name: string;
}

interface CalendarWrapperProps {
  events: any[];
  view: View | string;
  onViewChange: (view: string) => void;
  date: Date;
  onDateChange: (date: Date) => void;
  onSelectEvent: (event: any) => void;
  onSelectSlot: (slotInfo: any) => void;

  /** 3.2.1 filters — filterable by carer, by patient, by area/zone, or by visit status. */
  carers?: Option[];
  patients?: Option[];
  areas?: string[];
  statuses?: Option[];
  filters?: ScheduleFilters;
  onFiltersChange?: (filters: ScheduleFilters) => void;

  /** Drag-and-drop rescheduling (3.2.1: "drag visits between carers to reassign"). */
  onEventDrop?: (args: { event: any; start: Date; end: Date; resourceId?: any }) => void;
  onEventResize?: (args: { event: any; start: Date; end: Date }) => void;

  /** Dropping an unassigned visit card (from the sidebar) onto a slot. */
  draggedVisitId?: string | null;
  onDropFromOutside?: (visitId: string, slotInfo: { start: Date; end: Date }) => void;

  /** 3.2.2 AI-powered smart scheduling + 5.2 bulk actions. */
  onAiSchedule?: () => void;
  onBulkAssignRecurring?: () => void;
  onBulkCancelWeek?: () => void;
  onBulkReassignCarer?: () => void;

  /** True while the AI optimiser is running, to show a loading state on the button. */
  isAiScheduling?: boolean;
}

function CustomToolbar({
  label,
  view,
  onView,
  onNavigate,
}: {
  label: string;
  view: string;
  onView: (view: string) => void;
  onNavigate: (action: NavigateAction) => void;
}) {
  const views: { key: string; label: string }[] = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-cf-border bg-cf-surface">
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onNavigate('PREV')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onNavigate('NEXT')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <motion.h2
        key={label}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-base font-semibold text-cf-ink"
      >
        {label}
      </motion.h2>

      <div className="relative flex items-center gap-0.5 rounded-lg bg-cf-surface-muted p-1">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => onView(v.key)}
            className={`relative z-10 px-3 py-1.5 text-sm rounded-md transition-colors ${
              view === v.key ? 'text-white' : 'text-cf-ink-60 hover:text-cf-ink'
            }`}
          >
            {view === v.key && (
              <motion.span
                layoutId="calendar-view-pill"
                className="absolute inset-0 rounded-md bg-cf-brand-600 -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarWrapper({
  events,
  view,
  onViewChange,
  date,
  onDateChange,
  onSelectEvent,
  onSelectSlot,
  carers = [],
  patients = [],
  areas = [],
  statuses = [
    { id: 'all', name: 'All statuses' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'in-progress', name: 'In progress' },
    { id: 'completed', name: 'Completed' },
    { id: 'missed', name: 'Missed / Cancelled' },
  ],
  filters: controlledFilters,
  onFiltersChange,
  onEventDrop,
  onEventResize,
  draggedVisitId,
  onDropFromOutside,
  onAiSchedule,
  onBulkAssignRecurring,
  onBulkCancelWeek,
  onBulkReassignCarer,
  isAiScheduling,
}: CalendarWrapperProps) {
  const [internalFilters, setInternalFilters] = useState<ScheduleFilters>(defaultFilters);
  const filters = controlledFilters ?? internalFilters;

  const updateFilter = (key: keyof ScheduleFilters, value: string) => {
    const next = { ...filters, [key]: value };
    onFiltersChange ? onFiltersChange(next) : setInternalFilters(next);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.carerId !== 'all' && event.carerId !== filters.carerId) return false;
      if (filters.patientId !== 'all' && event.patientId !== filters.patientId) return false;
      if (filters.area !== 'all' && event.area !== filters.area) return false;
      if (filters.status !== 'all' && event.status !== filters.status) return false;
      return true;
    });
  }, [events, filters]);

  const conflictCount = useMemo(
    () => filteredEvents.filter((e) => e.hasConflict).length,
    [filteredEvents]
  );

  return (
    <div className="flex flex-col gap-3 w-full max-w-7xl">
      {/* Filters + AI / bulk actions row (5.2 Scheduling Module) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {carers.length > 0 && (
            <Select value={filters.carerId} onValueChange={(v) => updateFilter('carerId', v!)}>
              <SelectTrigger className="h-8 w-[140px] text-xs border-cf-border">
                <SelectValue placeholder="Carer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All carers</SelectItem>
                {carers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {patients.length > 0 && (
            <Select value={filters.patientId} onValueChange={(v) => updateFilter('patientId', v!)}>
              <SelectTrigger className="h-8 w-[140px] text-xs border-cf-border">
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All patients</SelectItem>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {areas.length > 0 && (
            <Select value={filters.area} onValueChange={(v) => updateFilter('area', v!)}>
              <SelectTrigger className="h-8 w-[130px] text-xs border-cf-border">
                <SelectValue placeholder="Area / zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All areas</SelectItem>
                {areas.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filters.status} onValueChange={(v) => updateFilter('status', v!)}>
            <SelectTrigger className="h-8 w-[150px] text-xs border-cf-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AnimatePresence>
            {conflictCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 rounded-full bg-error-muted text-error text-xs font-medium px-2.5 py-1"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {conflictCount} conflict{conflictCount > 1 ? 's' : ''} to review
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cf-border bg-cf-surface px-3 text-xs font-medium text-cf-ink hover:bg-cf-surface-muted transition-colors">
              <Layers className="h-3.5 w-3.5" />
              Bulk actions
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onBulkAssignRecurring}>
                Assign recurring visits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onBulkCancelWeek}>
                Cancel a patient's week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onBulkReassignCarer}>
                Reassign a carer's visits
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="sm"
              onClick={onAiSchedule}
              disabled={isAiScheduling}
             
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isAiScheduling ? 'Optimising…' : 'AI Scheduler'}
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full rounded-xl border border-cf-border overflow-hidden bg-cf-surface flex flex-col"
        style={{ height: '600px' }}
      >
        <DragAndDropCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          view={view as any}
          onView={(newView: string) => onViewChange(newView)}
          date={date}
          onNavigate={onDateChange}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          selectable
          popup
          step={30}
          showMultiDayTimes
          defaultView="week"
          views={['day', 'week', 'month']}
          eventPropGetter={(event: any) => {
            const base = eventStyleGetter(event) as {
              style?: React.CSSProperties;
              className?: string;
            };
            if (!event.hasConflict) return base;
            return {
              ...base,
              style: {
                ...base?.style,
                border: '1px dashed #ef4444',
                boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.4)',
              },
              className: `${base?.className ?? ''} animate-pulse-slow`,
            };
          }}
          dayPropGetter={(date: Date) => dayStyleGetter(date)}
          className="rbc-calendar rbc-calendar-custom h-full min-h-0"
          components={{ toolbar: CustomToolbar }}
          // Enables dropping an UnassignedScheduleBlock card straight onto a slot to assign it.
          onDropFromOutside={({ start, end }: { start: Date; end: Date }) => {
            if (draggedVisitId) {
              onDropFromOutside?.(draggedVisitId, { start, end });
            }
          }}
          dragFromOutsideItem={
            draggedVisitId ? () => ({ title: 'New visit' }) : undefined
          }
        />
      </motion.div>
    </div>
  );
}

export default CalendarWrapper;
