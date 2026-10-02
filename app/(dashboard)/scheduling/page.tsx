'use client'

import {
  CalendarWrapper,
  ScheduleStatSection,
  ScheduleHeaderSection,
  AddVisitModal,
  UnassignedVisits,
  EventDetailsModal,
  EditVisitModal,
  ScheduleCarerVisitSwaps,
  CapacityPlanningSection,
} from "sections";
import { mockVisits, convertVisitToEvent } from "utils";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Visit } from "types";
import { toast } from "sonner";
import type { ScheduleFilters } from "sections";

const mockPatients = [
  { id: 'P-12345', name: 'Dorothy Chen' },
  { id: 'P-12346', name: 'James Okafor' },
  { id: 'P-12347', name: 'Edna Morris' },
  { id: 'P-12348', name: 'Robert Hayes' },
  { id: 'P-12349', name: 'Sophie Martinez' },
  { id: 'P-12350', name: 'Margaret Johnson' },
];

const mockCarers = [
  { id: 'carer-1', name: 'Sarah Johnson' },
  { id: 'carer-2', name: 'Michael Chen' },
  { id: 'carer-3', name: 'Emma Williams' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date("2024-03-18"));
  const [view, setView] = useState("week");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [visits, setVisits] = useState(mockVisits);
  const events = convertVisitToEvent(visits);

  // Calendar filters (5.2 Scheduling Module — filter by carer/patient/area/status).
  // Previously the CalendarWrapper had this built but nothing passed it real
  // options, so the carer/patient dropdowns never rendered at all.
  const [filters, setFilters] = useState<ScheduleFilters>({
    carerId: 'all',
    patientId: 'all',
    area: 'all',
    status: 'all',
  });

  // AI Scheduler (calendar toolbar) — was previously wired to nothing
  // (onAiSchedule had no handler), so the button did nothing on click.
  const [isAiScheduling, setIsAiScheduling] = useState(false);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleAddVisit = () => {
    setModalOpen(true);
  };

  const handleEditVisit = () => {
    setEventModalOpen(false);
    setEditModalOpen(true);
  };

  const handleEditSave = async (data: any) => {
    const updatedVisit = {
      id: selectedEvent?.resource?.id || selectedEvent?.id,
      patientId: data.patientId,
      patientName: mockPatients.find(p => p.id === data.patientId)?.name || '',
      carerId: data.carerId,
      carerName: mockCarers.find(c => c.id === data.carerId)?.name || '',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      title: data.title,
      type: data.type,
      address: data.location || '',
      notes: data.notes || '',
      status: data.status,
    };

    setVisits((prev) =>
      prev.map((v) =>
        v.id === updatedVisit.id ? updatedVisit : v
      )
    );

    setSelectedEvent(null);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const calculateEndTime = (startTime: string, durationMinutes: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(durationMinutes);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const handleSaveVisit = async (data: any) => {
    const newVisit = {
      id: `visit-${Date.now()}`,
      patientId: data.patientId,
      patientName: mockPatients.find(p => p.id === data.patientId)?.name || '',
      carerId: data.carerId,
      carerName: mockCarers.find(c => c.id === data.carerId)?.name || '',
      date: data.date.toISOString().split('T')[0],
      startTime: data.startTime,
      endTime: calculateEndTime(data.startTime, data.duration),
      title: data.title,
      type: data.type,
      address: data.location || '',
      notes: data.notes || '',
      status: 'scheduled',
    };

    setVisits((prev) => [...prev, newVisit as Visit]);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleSelectSlot = (slotInfo: any) => {
    console.log("Selected slot:", slotInfo.start, slotInfo.end);
  };

  const handleEventDrop = (args: { event: any; start: Date; end: Date }) => {
    const { event, start, end } = args;

    const visitId = event?.resource?.id || event?.id;
    const existingVisit = visits.find(v => v.id === visitId);

    if (!existingVisit) {
      toast.error('Visit not found');
      return;
    }

    const newStartTime = start.toTimeString().slice(0, 5);
    const newEndTime = end.toTimeString().slice(0, 5);
    const newDate = start.toISOString().split('T')[0];

    const hasConflict = visits.some(v => {
      if (v.id === visitId) return false;
      if (v.carerId !== existingVisit.carerId) return false;
      if (v.date !== newDate) return false;

      const vStart = v.startTime;
      const vEnd = v.endTime;
      return (newStartTime < vEnd && newEndTime > vStart);
    });

    if (hasConflict) {
      toast.warning('Time conflict with another visit for this carer', {
        description: 'Please choose a different time slot',
        duration: 5000,
      });
      return;
    }

    const updatedVisit = {
      ...existingVisit,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? updatedVisit : v
      )
    );

    toast.success(`Visit rescheduled to ${newDate} ${newStartTime} - ${newEndTime}`, {
      description: `${existingVisit.patientName} - ${existingVisit.carerName}`,
    });

    setEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventResize = (args: { event: any; start: Date; end: Date }) => {
    const { event, start, end } = args;

    const visitId = event?.resource?.id || event?.id;
    const existingVisit = visits.find(v => v.id === visitId);

    if (!existingVisit) {
      toast.error('Visit not found');
      return;
    }

    const newStartTime = start.toTimeString().slice(0, 5);
    const newEndTime = end.toTimeString().slice(0, 5);
    const newDate = start.toISOString().split('T')[0];

    const hasConflict = visits.some(v => {
      if (v.id === visitId) return false;
      if (v.carerId !== existingVisit.carerId) return false;
      if (v.date !== newDate) return false;

      const vStart = v.startTime;
      const vEnd = v.endTime;
      return (newStartTime < vEnd && newEndTime > vStart);
    });

    if (hasConflict) {
      toast.warning('Cannot resize: time conflict with another visit');
      return;
    }

    const updatedVisit = {
      ...existingVisit,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? updatedVisit : v
      )
    );

    toast.success(`Visit duration updated`);
  };

  const handleDropFromOutside = (visitId: string, slotInfo: { start: Date; end: Date }) => {
    const { start, end } = slotInfo;

    const visit = visits.find(v => v.id === visitId);
    if (!visit) {
      toast.error('Visit not found');
      return;
    }

    const newStartTime = start.toTimeString().slice(0, 5);
    const newEndTime = end.toTimeString().slice(0, 5);
    const newDate = start.toISOString().split('T')[0];

    const updatedVisit = {
      ...visit,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'scheduled' as const,
    };

    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? updatedVisit : v
      )
    );

    toast.success(`Visit assigned to ${newDate} ${newStartTime} - ${newEndTime}`, {
      description: `${visit.patientName}`,
    });
  };

  // Calendar toolbar's AI Scheduler — separate from the one inside the
  // Unassigned Visits panel. TODO: replace with the real optimiser endpoint.
  const handleAiSchedule = async () => {
    setIsAiScheduling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      toast.success('Schedule optimised', {
        description: 'AI has proposed assignments for unassigned visits — review them in the Unassigned panel.',
      });
    } finally {
      setIsAiScheduling(false);
    }
  };

  // Bulk actions — stubs that give real feedback instead of silently doing
  // nothing. Each needs a proper confirmation modal (reason, scope, preview)
  // before this should touch real data — same pattern as the patient
  // discharge modal.
  const handleBulkAssignRecurring = () => {
    toast.info('Assign recurring visits', {
      description: 'Full recurring-assignment flow not built yet — this needs a dedicated modal.',
    });
  };

  const handleBulkCancelWeek = () => {
    toast.info("Cancel a patient's week", {
      description: 'Full cancel-week flow not built yet — this needs a dedicated modal with patient selection + confirmation.',
    });
  };

  const handleBulkReassignCarer = () => {
    toast.info("Reassign a carer's visits", {
      description: 'Full reassignment flow not built yet — this needs a dedicated modal with carer selection + confirmation.',
    });
  };

  return (
    <div className="w-full p-6 bg-transparent">
      {/* One white rounded panel holding the heading and everything below
          it — same structure as Dashboard/Staff/Patients. No overflow
          here: the shell's <main> is the only scroll container. */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-4"
      >
        <motion.div variants={item}>
          <ScheduleHeaderSection onAddVisit={handleAddVisit} />
        </motion.div>

        <motion.div variants={item}>
          <ScheduleStatSection />
        </motion.div>

        <motion.div variants={item} className="w-full flex gap-x-4">
          <div className="flex flex-col gap-y-4 w-full">
            <CalendarWrapper
              events={events}
              view={view}
              onViewChange={setView}
              date={currentDate}
              onDateChange={setCurrentDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onDropFromOutside={handleDropFromOutside}
              carers={mockCarers}
              patients={mockPatients}
              filters={filters}
              onFiltersChange={setFilters}
              onAiSchedule={handleAiSchedule}
              isAiScheduling={isAiScheduling}
              onBulkAssignRecurring={handleBulkAssignRecurring}
              onBulkCancelWeek={handleBulkCancelWeek}
              onBulkReassignCarer={handleBulkReassignCarer}
            />
            <CapacityPlanningSection />
          </div>
          <div className="flex flex-col gap-y-4 w-full max-w-sm h-full">
            <UnassignedVisits />
            <ScheduleCarerVisitSwaps />
          </div>
        </motion.div>

        <EventDetailsModal
          open={eventModalOpen}
          onOpenChange={setEventModalOpen}
          event={selectedEvent}
          onEdit={handleEditVisit}
        />

        <EditVisitModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          visit={selectedEvent}
          onSave={handleEditSave}
          patients={mockPatients}
          carers={mockCarers}
        />

        <AddVisitModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={handleSaveVisit}
          patients={mockPatients}
          carers={mockCarers}
          defaultDate={new Date()}
        />
      </motion.div>
    </div>
  );
}