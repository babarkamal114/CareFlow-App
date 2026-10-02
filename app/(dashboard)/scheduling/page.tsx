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
import type { Visit } from "types";
import { toast } from "sonner";

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


export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date("2024-03-18"));
  const [view, setView] = useState("week");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [visits, setVisits] = useState(mockVisits);
  const events = convertVisitToEvent(visits);

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



  return (
    <div className="h-screen w-full space-y-4 overflow-y-scroll overflow-x-hidden min-w-0 no-scrollbar">
      <ScheduleHeaderSection onAddVisit={handleAddVisit} />
      <ScheduleStatSection />
      
      <div className="w-full flex gap-x-4">
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
            
          />
          <CapacityPlanningSection />
        </div>
        <div className="flex flex-col gap-y-4 w-full max-w-sm h-full">
          <UnassignedVisits />
          <ScheduleCarerVisitSwaps />
        </div>
      </div>

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
    </div>
  );
}