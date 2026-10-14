import type { ScheduleCalendarEvent, ScheduleVisit } from "types";
import { parseIsoDate, timeToMinutes } from "./schedule-time";

/** Resource id used for visits that have no carer. */
export const UNASSIGNED_RESOURCE_ID = "unassigned";

function withTime(dateIso: string, time: string): Date {
  const date = parseIsoDate(dateIso);
  const minutes = timeToMinutes(time);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

export function convertVisitToEvent(visits: ScheduleVisit[]): ScheduleCalendarEvent[] {
  return visits.map((visit) => ({
    id: visit.id,
    title: `${visit.patientName} - ${visit.carerName || "Unassigned"}`,
    start: withTime(visit.date, visit.startTime),
    end: withTime(visit.date, visit.endTime),
    resourceId: visit.carerId ?? UNASSIGNED_RESOURCE_ID,
    resource: visit,
  }));
}