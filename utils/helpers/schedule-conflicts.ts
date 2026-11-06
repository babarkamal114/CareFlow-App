import type {
  PreferenceViolation,
  ScheduleArea,
  ScheduleContext,
  ScheduleTravelMode,
  ScheduleVisit,
  VisitConflict,
  VisitIssues,
} from "types";
import { DAY_LABELS } from "./schedule-labels";
import { getDayOfWeek, timeRangesOverlap, timeToMinutes } from "./schedule-time";

/* ── Travel time (mock estimate) ────────────────────────────── */

const SAME_AREA_MINUTES = 5;
const CROSS_AREA_MINUTES = 20;

const TRAVEL_MULTIPLIER: Record<ScheduleTravelMode, number> = {
  drive: 1,
  public_transport: 1.5,
  cycle: 1.25,
  walk: 1.5,
};

export function estimateTravelMinutes(
  from: ScheduleArea,
  to: ScheduleArea,
  mode: ScheduleTravelMode
): number {
  const base = from === to ? SAME_AREA_MINUTES : CROSS_AREA_MINUTES;
  return Math.round(base * TRAVEL_MULTIPLIER[mode]);
}

/* ── Helpers ────────────────────────────────────────────────── */

/** Cancelled and missed visits no longer occupy the carer. */
function occupiesCarer(visit: ScheduleVisit): boolean {
  return visit.status !== "cancelled" && visit.status !== "missed";
}

export function hasBlockingConflict(conflicts: VisitConflict[]): boolean {
  return conflicts.some((conflict) => conflict.severity === "error");
}

/* ── Conflicts: double-booking, availability, skills, travel ── */

export function detectVisitConflicts(
  visit: ScheduleVisit,
  ctx: ScheduleContext
): VisitConflict[] {
  if (!visit.carerId) return [];
  const carer = ctx.carers.find((c) => c.id === visit.carerId);
  if (!carer) return [];

  const conflicts: VisitConflict[] = [];
  const dayOfWeek = getDayOfWeek(visit.date);

  // Leave and availability
  if (carer.leaveDates.includes(visit.date)) {
    conflicts.push({
      type: "carer-unavailable",
      severity: "error",
      message: `${carer.name} is on leave on this date`,
    });
  } else {
    const daySlots = carer.availability.filter((slot) => slot.day === dayOfWeek);
    const covered = daySlots.some(
      (slot) =>
        timeToMinutes(visit.startTime) >= timeToMinutes(slot.startTime) &&
        timeToMinutes(visit.endTime) <= timeToMinutes(slot.endTime)
    );

    if (daySlots.length === 0) {
      conflicts.push({
        type: "carer-unavailable",
        severity: "error",
        message: `${carer.name} does not work on ${DAY_LABELS[dayOfWeek]}s`,
      });
    } else if (!covered) {
      conflicts.push({
        type: "carer-unavailable",
        severity: "error",
        message: `${carer.name} is only available ${daySlots[0].startTime} to ${daySlots[0].endTime} on ${DAY_LABELS[dayOfWeek]}s`,
      });
    }
  }

  // Qualifications
  const missingSkills = visit.requiredSkills.filter(
    (skill) => !carer.skills.includes(skill)
  );
  if (missingSkills.length > 0) {
    conflicts.push({
      type: "missing-skill",
      severity: "error",
      message: `${carer.name} lacks required training: ${missingSkills.join(", ")}`,
    });
  }

  // Double-booking and travel time against the carer's other visits that day
  const sameDay = ctx.visits.filter(
    (other) =>
      other.id !== visit.id &&
      other.carerId === visit.carerId &&
      other.date === visit.date &&
      occupiesCarer(other)
  );

  for (const other of sameDay) {
    if (timeRangesOverlap(visit.startTime, visit.endTime, other.startTime, other.endTime)) {
      conflicts.push({
        type: "double-booking",
        severity: "error",
        message: `Overlaps ${other.patientName} (${other.startTime} to ${other.endTime})`,
        relatedVisitId: other.id,
      });
      continue;
    }

    const otherIsEarlier = timeToMinutes(other.endTime) <= timeToMinutes(visit.startTime);
    const gap = otherIsEarlier
      ? timeToMinutes(visit.startTime) - timeToMinutes(other.endTime)
      : timeToMinutes(other.startTime) - timeToMinutes(visit.endTime);
    const travel = otherIsEarlier
      ? estimateTravelMinutes(other.area, visit.area, carer.travelMode)
      : estimateTravelMinutes(visit.area, other.area, carer.travelMode);

    if (gap < travel) {
      conflicts.push({
        type: "travel-time",
        severity: "warning",
        message: `Only ${gap} min before or after ${other.patientName}; about ${travel} min travel needed`,
        relatedVisitId: other.id,
      });
    }
  }

  return conflicts;
}

/* ── Patient preferences ────────────────────────────────────── */

export function detectPreferenceViolations(
  visit: ScheduleVisit,
  ctx: ScheduleContext
): PreferenceViolation[] {
  if (!visit.carerId) return [];
  const carer = ctx.carers.find((c) => c.id === visit.carerId);
  const patient = ctx.patients.find((p) => p.id === visit.patientId);
  if (!carer || !patient) return [];

  const prefs = patient.preferences;
  const violations: PreferenceViolation[] = [];

  if (prefs.carerGender && carer.gender !== prefs.carerGender) {
    violations.push({
      type: "carer-gender",
      message: `${patient.name} prefers ${prefs.carerGender} carers only`,
    });
  }

  const missingLanguages = prefs.languages.filter(
    (language) => !carer.languages.includes(language)
  );
  if (missingLanguages.length > 0) {
    violations.push({
      type: "language",
      message: `${patient.name} needs a carer who speaks ${missingLanguages.join(", ")}`,
    });
  }

  if (
    prefs.prefersContinuity &&
    prefs.preferredCarerId &&
    prefs.preferredCarerId !== carer.id
  ) {
    const preferred = ctx.carers.find((c) => c.id === prefs.preferredCarerId);
    violations.push({
      type: "continuity",
      message: `${patient.name} prefers the same carer each visit${
        preferred ? ` (${preferred.name})` : ""
      }`,
    });
  }

  return violations;
}

/* ── Combined ───────────────────────────────────────────────── */

export function getVisitIssues(visit: ScheduleVisit, ctx: ScheduleContext): VisitIssues {
  return {
    conflicts: detectVisitConflicts(visit, ctx),
    violations: detectPreferenceViolations(visit, ctx),
  };
}

/** Issues for every visit that has any. Visits with none are left out. */
export function getAllVisitIssues(ctx: ScheduleContext): Record<string, VisitIssues> {
  const result: Record<string, VisitIssues> = {};

  for (const visit of ctx.visits) {
    if (!occupiesCarer(visit) || visit.status === "completed") continue;
    const issues = getVisitIssues(visit, ctx);
    if (issues.conflicts.length > 0 || issues.violations.length > 0) {
      result[visit.id] = issues;
    }
  }

  return result;
}

export function countVisitsWithConflicts(issues: Record<string, VisitIssues>): number {
  return Object.values(issues).filter((entry) => entry.conflicts.length > 0).length;
}