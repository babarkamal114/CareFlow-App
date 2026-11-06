import type {
  OptimiseResult,
  ScheduleCarer,
  ScheduleContext,
  ScheduleSuggestion,
  ScheduleVisit,
  WhatIfResult,
} from "types";
import { scheduledHoursForCarer } from "./schedule-capacity";
import { detectPreferenceViolations, detectVisitConflicts, hasBlockingConflict } from "./schedule-conflicts";
import { getDurationHours, startOfWeekIso } from "./schedule-time";

/*
 * Mock optimiser. Deterministic and rule-based so the UI can be built and
 * tested. Replace with the real optimiser endpoint later; the input and
 * output shapes (ScheduleContext in, suggestions out) are what the page uses.
 */

const BASE_SCORE = 60;
const ERROR_PENALTY = 40;
const WARNING_PENALTY = 10;
const VIOLATION_PENALTY = 15;
const OVER_HOURS_PENALTY = 20;

function byDateThenTime(a: ScheduleVisit, b: ScheduleVisit): number {
  return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
}

export function scoreCarerForVisit(
  visit: ScheduleVisit,
  carer: ScheduleCarer,
  ctx: ScheduleContext
): ScheduleSuggestion {
  const candidate: ScheduleVisit = { ...visit, carerId: carer.id, carerName: carer.name };
  const conflicts = detectVisitConflicts(candidate, ctx);
  const violations = detectPreferenceViolations(candidate, ctx);
  const patient = ctx.patients.find((p) => p.id === visit.patientId);
  const reasons: string[] = [];

  let score = BASE_SCORE;
  score -= conflicts.filter((c) => c.severity === "error").length * ERROR_PENALTY;
  score -= conflicts.filter((c) => c.severity === "warning").length * WARNING_PENALTY;
  score -= violations.length * VIOLATION_PENALTY;

  if (visit.requiredSkills.length > 0 && !conflicts.some((c) => c.type === "missing-skill")) {
    score += 10;
    reasons.push("Has all required training");
  }

  if (carer.area === visit.area) {
    score += 10;
    reasons.push(`Works in the ${visit.area} area`);
  }

  const prefs = patient?.preferences;
  if (prefs?.preferredCarerId === carer.id) {
    score += 15;
    reasons.push("Preferred carer");
  } else if (ctx.visits.some((v) => v.patientId === visit.patientId && v.carerId === carer.id)) {
    score += 8;
    reasons.push("Already visits this patient");
  }

  if (prefs?.carerGender && prefs.carerGender === carer.gender) {
    score += 5;
    reasons.push("Matches gender preference");
  }

  if (prefs && prefs.languages.length > 0 && !violations.some((v) => v.type === "language")) {
    score += 5;
    reasons.push(`Speaks ${prefs.languages.join(", ")}`);
  }

  const bookedHours = scheduledHoursForCarer(carer.id, ctx.visits, startOfWeekIso(visit.date));
  if (bookedHours + getDurationHours(visit.startTime, visit.endTime) > carer.contractedHoursPerWeek) {
    score -= OVER_HOURS_PENALTY;
    reasons.push("Would go over contracted weekly hours");
  }

  return {
    visitId: visit.id,
    carerId: carer.id,
    carerName: carer.name,
    score: Math.max(0, Math.min(100, score)),
    reasons,
    conflicts,
    violations,
  };
}

/**
 * Greedy allocation, earliest visit first. Each pick is applied to a working
 * copy so later visits see it (no double-booking within the run).
 */
export function suggestAssignments(
  visitsToPlace: ScheduleVisit[],
  ctx: ScheduleContext,
  excludedCarerIds: string[] = []
): OptimiseResult {
  const suggestions: ScheduleSuggestion[] = [];
  const unresolvedVisitIds: string[] = [];
  let working = ctx.visits;

  for (const visit of [...visitsToPlace].sort(byDateThenTime)) {
    const workingCtx: ScheduleContext = { ...ctx, visits: working };

    const best = ctx.carers
      .filter((carer) => !excludedCarerIds.includes(carer.id))
      .map((carer) => scoreCarerForVisit(visit, carer, workingCtx))
      .filter((suggestion) => !hasBlockingConflict(suggestion.conflicts))
      .sort((a, b) => b.score - a.score || a.carerId.localeCompare(b.carerId))[0];

    if (!best) {
      unresolvedVisitIds.push(visit.id);
      continue;
    }

    suggestions.push(best);
    working = working.map((v) =>
      v.id === visit.id ? { ...v, carerId: best.carerId, carerName: best.carerName } : v
    );
  }

  return { suggestions, unresolvedVisitIds };
}

/** Applies accepted suggestions. Visits without a suggestion are returned unchanged. */
export function applySuggestions(
  visits: ScheduleVisit[],
  suggestions: ScheduleSuggestion[]
): ScheduleVisit[] {
  const byVisit = new Map(suggestions.map((s) => [s.visitId, s]));

  return visits.map((visit) => {
    const suggestion = byVisit.get(visit.id);
    return suggestion
      ? { ...visit, carerId: suggestion.carerId, carerName: suggestion.carerName }
      : visit;
  });
}

/** "What happens if this carer is off on this date?" Reallocates their scheduled visits. */
export function runWhatIf(
  absentCarerId: string,
  dateIso: string,
  ctx: ScheduleContext
): WhatIfResult {
  const affected = ctx.visits
    .filter((v) => v.carerId === absentCarerId && v.date === dateIso && v.status === "scheduled")
    .map((v) => ({ ...v, carerId: null, carerName: "" }));
  const affectedIds = new Set(affected.map((v) => v.id));

  const working = ctx.visits.map((v) =>
    affectedIds.has(v.id) ? { ...v, carerId: null, carerName: "" } : v
  );

  const result = suggestAssignments(affected, { ...ctx, visits: working }, [absentCarerId]);

  return {
    absentCarerId,
    date: dateIso,
    reassignments: result.suggestions,
    unresolvedVisitIds: result.unresolvedVisitIds,
  };
}