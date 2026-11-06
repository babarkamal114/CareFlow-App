'use client';

import React, { useMemo } from 'react';
import {
  Calendar,
  dayjsLocalizer,
  type CalendarProps,
  type NavigateAction,
  type ToolbarProps,
} from 'react-big-calendar';
import withDragAndDrop, {
  type EventInteractionArgs,
  type withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import type {
  ScheduleCalendarEvent,
  ScheduleCalendarResource,
  ScheduleView,
  VisitIssues,
} from 'types';
import { createDayStyleGetter, eventStyleGetter } from 'utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '@/components/styles/calendar.css';

// UK weeks start on Monday.
dayjs.locale('en-gb');
const localizer = dayjsLocalizer(dayjs);
const DragAndDropCalendar = withDragAndDrop<ScheduleCalendarEvent, ScheduleCalendarResource>(
  Calendar as React.ComponentType<CalendarProps<ScheduleCalendarEvent, ScheduleCalendarResource>>
);

// react-big-calendar reads the dragged item as an object at runtime, but its
// types describe an accessor. This placeholder keeps the drop preview working.
const dragPlaceholder = (() => ({ title: 'Unassigned visit' })) as unknown as withDragAndDropProps<ScheduleCalendarEvent, ScheduleCalendarResource>['dragFromOutsideItem'];

const VIEWS: { key: ScheduleView; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

function CalendarNav({ label, view, onView, onNavigate }: ToolbarProps<ScheduleCalendarEvent>) {
  return (
    <div className="flex items-center justify-between border-b border-cf-border bg-cf-surface px-4 py-3">
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY' as NavigateAction)}>
          Today
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous"
          onClick={() => onNavigate('PREV' as NavigateAction)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next"
          onClick={() => onNavigate('NEXT' as NavigateAction)}
        >
          <ChevronRight />
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
        {VIEWS.map((option) => (
          <Button
            key={option.key}
            variant="ghost"
            size="sm"
            aria-pressed={view === option.key}
            onClick={() => onView(option.key)}
            className={`relative z-10 h-auto rounded-md px-3 py-1.5 font-normal hover:bg-transparent ${
              view === option.key
                ? 'text-primary-foreground hover:text-primary-foreground'
                : 'text-cf-ink-60 hover:text-cf-ink'
            }`}
          >
            {view === option.key && (
              <motion.span
                layoutId="calendar-view-pill"
                className="absolute inset-0 -z-10 rounded-md bg-brand-600"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface ScheduleCalendarSectionProps {
  events: ScheduleCalendarEvent[];
  view: ScheduleView;
  onViewChange: (view: ScheduleView) => void;
  date: Date;
  onDateChange: (date: Date) => void;
  todayIso: string;
  /** Conflicts and preference issues by visit id; conflicted events get a dashed red outline. */
  issuesByVisitId: Record<string, VisitIssues>;
  /** Carer columns, shown in the day view so a visit can be dragged to another carer. */
  resources: ScheduleCalendarResource[];
  onSelectEvent: (event: ScheduleCalendarEvent) => void;
  onSelectSlot: (slot: { start: Date; end: Date }) => void;
  onEventDrop: (args: {
    event: ScheduleCalendarEvent;
    start: Date;
    end: Date;
    /** Set when the visit was dropped into a different carer column. */
    resourceId?: string;
  }) => void;
  onEventResize: (args: { event: ScheduleCalendarEvent; start: Date; end: Date }) => void;
  /** Set while an unassigned visit card is being dragged over the calendar. */
  draggedVisitId: string | null;
  onDropFromOutside: (visitId: string, slot: { start: Date; end: Date }) => void;
}

export function ScheduleCalendarSection({
  events,
  view,
  onViewChange,
  date,
  onDateChange,
  todayIso,
  issuesByVisitId,
  resources,
  onSelectEvent,
  onSelectSlot,
  onEventDrop,
  onEventResize,
  draggedVisitId,
  onDropFromOutside,
}: ScheduleCalendarSectionProps) {
  const dayPropGetter = useMemo(() => createDayStyleGetter(todayIso), [todayIso]);

  const handleInteraction =
    (callback: ScheduleCalendarSectionProps['onEventDrop']) =>
    ({ event, start, end, resourceId }: EventInteractionArgs<ScheduleCalendarEvent>) =>
      callback({
        event,
        start: new Date(start),
        end: new Date(end),
        resourceId: resourceId === undefined ? undefined : String(resourceId),
      });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-[600px] w-full flex-col overflow-hidden rounded-xl border border-cf-border bg-cf-surface"
    >
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(next) => onViewChange(next as ScheduleView)}
        views={['day', 'week', 'month']}
        resources={view === 'day' ? resources : undefined}
        resourceIdAccessor={(resource) => resource.id}
        resourceTitleAccessor={(resource) => resource.title}
        date={date}
        onNavigate={onDateChange}
        onSelectEvent={onSelectEvent}
        onSelectSlot={({ start, end }) =>
          onSelectSlot({ start: new Date(start), end: new Date(end) })
        }
        onEventDrop={handleInteraction(onEventDrop)}
        onEventResize={handleInteraction(onEventResize)}
        resizable
        selectable
        popup
        step={30}
        scrollToTime={new Date(1970, 0, 1, 7)}
        eventPropGetter={(event) => {
          const base = eventStyleGetter(event);
          const hasConflict = (issuesByVisitId[event.id]?.conflicts.length ?? 0) > 0;
          return hasConflict ? { className: `${base.className} event-conflict` } : base;
        }}
        dayPropGetter={dayPropGetter}
        className="rbc-calendar rbc-calendar-custom h-full min-h-0"
        components={{ toolbar: CalendarNav }}
        onDropFromOutside={({ start, end }) => {
          if (draggedVisitId) {
            onDropFromOutside(draggedVisitId, { start: new Date(start), end: new Date(end) });
          }
        }}
        dragFromOutsideItem={draggedVisitId ? dragPlaceholder : undefined}
      />
    </motion.div>
  );
}