import type {
  ScheduleFilters,
  ScheduleVisit,
  UnassignedCounts,
  VisitStatusCounts,
  VisitUrgency,
} from "types";
import { addDaysIso, daysBetween, startOfWeekIso } from "./schedule-time";

export const DEFAULT_SCHEDULE_FILTERS: ScheduleFilters = {
  carerId: "all",
  patientId: "all",
  area: "all",
  status: "all",
};

export function hasActiveFilters(filters: ScheduleFilters): boolean {
  return (
    filters.carerId !== "all" ||
    filters.patientId !== "all" ||
    filters.area !== "all" ||
    filters.status !== "all"
  );
}

/** Unassigned is derived, never stored as a status. */
export function isUnassigned(visit: ScheduleVisit): boolean {
  return visit.carerId === null;
}

export function filterVisits(
  visits: ScheduleVisit[],
  filters: ScheduleFilters
): ScheduleVisit[] {
  return visits.filter((visit) => {
    if (filters.carerId !== "all" && visit.carerId !== filters.carerId) return false;
    if (filters.patientId !== "all" && visit.patientId !== filters.patientId) return false;
    if (filters.area !== "all" && visit.area !== filters.area) return false;
    if (filters.status === "unassigned") return isUnassigned(visit);
    if (filters.status !== "all" && visit.status !== filters.status) return false;
    return true;
  });
}

function byDateThenTime(a: ScheduleVisit, b: ScheduleVisit): number {
  return (
    a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  );
}

/** Unassigned visits, soonest first. Cancelled visits are ignored. */
export function getUnassignedVisits(visits: ScheduleVisit[]): ScheduleVisit[] {
  return visits
    .filter((visit) => isUnassigned(visit) && visit.status !== "cancelled")
    .sort(byDateThenTime);
}

export function getVisitUrgency(visit: ScheduleVisit, todayIso: string): VisitUrgency {
  const days = daysBetween(todayIso, visit.date);
  if (days < 0) return "overdue";
  if (days === 0) return "urgent";
  if (days === 1) return "soon";
  return "upcoming";
}

/** Today, tomorrow and the rest of the current week (to Sunday). Past visits are excluded. */
export function countUnassignedByWindow(
  visits: ScheduleVisit[],
  todayIso: string
): UnassignedCounts {
  const tomorrow = addDaysIso(todayIso, 1);
  const weekEnd = addDaysIso(startOfWeekIso(todayIso), 6);
  const unassigned = getUnassignedVisits(visits);

  return {
    today: unassigned.filter((v) => v.date === todayIso).length,
    tomorrow: unassigned.filter((v) => v.date === tomorrow).length,
    restOfWeek: unassigned.filter((v) => v.date > tomorrow && v.date <= weekEnd).length,
  };
}

export function getVisitsForDate(visits: ScheduleVisit[], dateIso: string): ScheduleVisit[] {
  return visits.filter((visit) => visit.date === dateIso).sort(byDateThenTime);
}

export function countVisitsByStatus(visits: ScheduleVisit[]): VisitStatusCounts {
  return {
    total: visits.length,
    scheduled: visits.filter((v) => v.status === "scheduled").length,
    inProgress: visits.filter((v) => v.status === "in-progress").length,
    completed: visits.filter((v) => v.status === "completed").length,
    missedOrCancelled: visits.filter(
      (v) => v.status === "missed" || v.status === "cancelled"
    ).length,
  };
}