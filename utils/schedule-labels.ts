import type { BadgeProps } from "@/components/ui";
import type {
  CapacityStatus,
  ScheduleArea,
  ScheduleDayOfWeek,
  ScheduleSelectOption,
  RecurringFrequency,
  VisitConflictType,
  VisitStatus,
  VisitType,
  VisitUrgency,
} from "types";

type BadgeVariant = BadgeProps["variant"];

export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  "care-visit": "Care Visit",
  medication: "Medication",
  "initial-assessment": "Initial Assessment",
  "follow-up": "Follow-up",
  review: "Review",
  appointment: "Appointment",
  emergency: "Emergency",
};

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  completed: "Completed",
  missed: "Missed",
  cancelled: "Cancelled",
};

export const SCHEDULE_AREA_LABELS: Record<ScheduleArea, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  central: "Central",
};

export const DAY_LABELS: Record<ScheduleDayOfWeek, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export const DAY_SHORT_LABELS: Record<ScheduleDayOfWeek, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export const RECURRING_FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  fortnightly: "Fortnightly",
};

export const CONFLICT_TYPE_LABELS: Record<VisitConflictType, string> = {
  "double-booking": "Double booking",
  "carer-unavailable": "Carer unavailable",
  "missing-skill": "Missing training",
  "travel-time": "Travel time",
};

export const URGENCY_LABELS: Record<VisitUrgency, string> = {
  overdue: "Overdue",
  urgent: "Today",
  soon: "Tomorrow",
  upcoming: "This week",
};

/* ── Badge variants (design-system variants only) ───────────── */

/** Live-status colours from the blueprint: green active, blue done, red missed. */
export const VISIT_STATUS_BADGE_VARIANT: Record<VisitStatus, BadgeVariant> = {
  scheduled: "softMuted",
  "in-progress": "softSuccess",
  completed: "softInfo",
  missed: "softDanger",
  cancelled: "outlineMuted",
};

/** Only complete variants (soft*, outline*). The pastel-* ones have no padding or rounding. */
export const VISIT_TYPE_BADGE_VARIANT: Record<VisitType, BadgeVariant> = {
  "care-visit": "softSuccess",
  medication: "softInfo",
  "initial-assessment": "softWarning",
  "follow-up": "outlineSuccess",
  review: "softMuted",
  appointment: "outlineInfo",
  emergency: "softDanger",
};

export const URGENCY_BADGE_VARIANT: Record<VisitUrgency, BadgeVariant> = {
  overdue: "softDanger",
  urgent: "softWarning",
  soon: "softInfo",
  upcoming: "softMuted",
};

/* ── Select options ─────────────────────────────────────────── */

function recordToOptions<K extends string>(
  labels: Record<K, string>
): ScheduleSelectOption[] {
  return (Object.keys(labels) as K[]).map((value) => ({
    value,
    label: labels[value],
  }));
}

export const VISIT_TYPE_OPTIONS = recordToOptions(VISIT_TYPE_LABELS);
export const VISIT_STATUS_OPTIONS = recordToOptions(VISIT_STATUS_LABELS);
export const SCHEDULE_AREA_OPTIONS = recordToOptions(SCHEDULE_AREA_LABELS);
export const RECURRING_FREQUENCY_OPTIONS = recordToOptions(
  RECURRING_FREQUENCY_LABELS
);

/** Duration choices in minutes. Labels come from formatDurationLabel. */
export const VISIT_DURATION_MINUTES = [15, 30, 45, 60, 90, 120, 180, 240] as const;

export function toSelectOptions(
  items: { id: string; name: string }[]
): ScheduleSelectOption[] {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

export function withAllOption(
  options: ScheduleSelectOption[],
  allLabel: string
): ScheduleSelectOption[] {
  return [{ value: "all", label: allLabel }, ...options];
}

/* ── Small display helpers ──────────────────────────────────── */

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export type ShiftPeriod = "Morning" | "Afternoon" | "Evening" | "Night";

export function getShiftPeriod(startTime: string): ShiftPeriod {
  const hour = Number(startTime.split(":")[0]);
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

/** Match-score badge for AI suggestions: 75+ good, 50+ fair, below that poor. */
export function getScoreBadgeVariant(score: number): BadgeVariant {
  if (score >= 75) return "softSuccess";
  if (score >= 50) return "softWarning";
  return "softDanger";
}

export const SHIFT_PERIOD_BADGE_VARIANT: Record<ShiftPeriod, BadgeVariant> = {
  Morning: "softWarning",
  Afternoon: "softInfo",
  Evening: "outlineWarning",
  Night: "softMuted",
};

export const CAPACITY_STATUS_LABELS: Record<CapacityStatus, string> = {
  ok: "Enough capacity",
  tight: "Tight week",
  short: "Shortfall",
};

export const CAPACITY_STATUS_BADGE_VARIANT: Record<CapacityStatus, BadgeVariant> = {
  ok: "softSuccess",
  tight: "softWarning",
  short: "softDanger",
};