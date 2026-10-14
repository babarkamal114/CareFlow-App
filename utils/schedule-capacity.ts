import type {
  CapacityDay,
  CapacityStatus,
  CapacitySummary,
  ScheduleVisit,
} from "types";
import { addDaysIso, getDurationHours } from "./schedule-time";

/** At or above this share of available hours, a day counts as tight. */
const TIGHT_THRESHOLD = 0.9;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Cancelled and missed visits do not use carer time. */
function usesCarerTime(visit: ScheduleVisit): boolean {
  return visit.status !== "cancelled" && visit.status !== "missed";
}

export function sumVisitHours(visits: ScheduleVisit[]): number {
  return round1(
    visits
      .filter(usesCarerTime)
      .reduce((sum, v) => sum + getDurationHours(v.startTime, v.endTime), 0)
  );
}

/** Hours a carer is already booked for in the week starting `weekStartIso` (Monday). */
export function scheduledHoursForCarer(
  carerId: string,
  visits: ScheduleVisit[],
  weekStartIso: string
): number {
  const weekEnd = addDaysIso(weekStartIso, 6);
  return sumVisitHours(
    visits.filter(
      (v) => v.carerId === carerId && v.date >= weekStartIso && v.date <= weekEnd
    )
  );
}

export function getCapacityStatus(neededHours: number, availableHours: number): CapacityStatus {
  if (neededHours > availableHours) return "short";
  if (availableHours > 0 && neededHours / availableHours >= TIGHT_THRESHOLD) return "tight";
  return "ok";
}

export function summariseCapacity(days: CapacityDay[]): CapacitySummary {
  const totalNeededHours = round1(days.reduce((sum, d) => sum + d.neededHours, 0));
  const totalAvailableHours = round1(days.reduce((sum, d) => sum + d.availableHours, 0));

  return {
    totalNeededHours,
    totalAvailableHours,
    differenceHours: round1(totalAvailableHours - totalNeededHours),
    utilisationPercent:
      totalAvailableHours > 0
        ? Math.round((totalNeededHours / totalAvailableHours) * 100)
        : 0,
    shortfallDays: days.filter((d) => d.neededHours > d.availableHours),
    status: getCapacityStatus(totalNeededHours, totalAvailableHours),
  };
}