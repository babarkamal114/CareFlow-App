/* ── Core enums (value tuples are reused by the zod schemas) ── */

export type ScheduleView = "day" | "week" | "month";

export const VISIT_TYPES = [
  "care-visit",
  "medication",
  "initial-assessment",
  "follow-up",
  "review",
  "appointment",
  "emergency",
] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

/** "Unassigned" is not a status: it is derived from `carerId === null`. */
export const VISIT_STATUSES = [
  "scheduled",
  "in-progress",
  "completed",
  "missed",
  "cancelled",
] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

export const SCHEDULE_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type ScheduleDayOfWeek = (typeof SCHEDULE_DAYS)[number];

export type ScheduleEmploymentType = "employed" | "bank" | "agency";

export type ScheduleTravelMode =
  | "drive"
  | "public_transport"
  | "cycle"
  | "walk";

export interface ScheduleAvailabilitySlot {
  id: string;
  day: ScheduleDayOfWeek;
  startTime: string;
  endTime: string;
}

export type ScheduleArea = "north" | "south" | "east" | "west" | "central";

export type CarerGender = "female" | "male" | "other";

export type VisitUrgency = "overdue" | "urgent" | "soon" | "upcoming";

/* ── People ─────────────────────────────────────────────────── */

export interface ScheduleCarer {
  id: string;
  name: string;
  gender: CarerGender;
  languages: string[];
  skills: string[];
  area: ScheduleArea;
  employmentType: ScheduleEmploymentType;
  travelMode: ScheduleTravelMode;
  contractedHoursPerWeek: number;
  availability: ScheduleAvailabilitySlot[];
  /** ISO dates (yyyy-mm-dd) on which the carer is on leave or off sick. */
  leaveDates: string[];
}

export interface PatientPreferences {
  carerGender?: Exclude<CarerGender, "other">;
  languages: string[];
  prefersContinuity: boolean;
  preferredCarerId?: string;
}

export interface SchedulePatient {
  id: string;
  name: string;
  address: string;
  area: ScheduleArea;
  preferences: PatientPreferences;
}

/* ── Visits ─────────────────────────────────────────────────── */

export interface ScheduleVisit {
  id: string;
  patientId: string;
  /** Denormalised for display; kept in sync by the workspace hook. */
  patientName: string;
  carerId: string | null;
  /** Empty string when unassigned. */
  carerName: string;
  /** ISO date, yyyy-mm-dd (local, never via toISOString). */
  date: string;
  /** 24h HH:mm */
  startTime: string;
  endTime: string;
  title: string;
  type: VisitType;
  status: VisitStatus;
  address: string;
  area: ScheduleArea;
  notes: string;
  requiredSkills: string[];
  templateId?: string;
  recurringRuleId?: string;
}

export interface ScheduleCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  /** Carer id, or "unassigned". Lets the day view show one column per carer. */
  resourceId: string;
  resource: ScheduleVisit;
}

/** A carer column in the day view (plus one for unassigned visits). */
export interface ScheduleCalendarResource {
  id: string;
  title: string;
}

export interface ScheduleFilters {
  carerId: string | "all";
  patientId: string | "all";
  area: ScheduleArea | "all";
  status: VisitStatus | "unassigned" | "all";
}

/* ── Templates and recurrence ───────────────────────────────── */

export interface VisitTemplate {
  id: string;
  name: string;
  durationMinutes: number;
  type: VisitType;
  tasks: string[];
  requiredSkills: string[];
}

export const RECURRING_FREQUENCIES = ["daily", "weekly", "fortnightly"] as const;
export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];

export interface RecurringRule {
  id: string;
  patientId: string;
  carerId: string | null;
  templateId?: string;
  type: VisitType;
  startTime: string;
  durationMinutes: number;
  frequency: RecurringFrequency;
  days: ScheduleDayOfWeek[];
  startDate: string;
  endDate: string;
}

/* ── Conflicts and preferences ──────────────────────────────── */

export type VisitConflictType =
  | "double-booking"
  | "carer-unavailable"
  | "missing-skill"
  | "travel-time";

export interface VisitConflict {
  type: VisitConflictType;
  severity: "error" | "warning";
  message: string;
  /** The other visit involved, when relevant. */
  relatedVisitId?: string;
}

export type PreferenceViolationType =
  | "carer-gender"
  | "language"
  | "continuity";

export interface PreferenceViolation {
  type: PreferenceViolationType;
  message: string;
}

/* ── Capacity, swaps and AI ─────────────────────────────────── */

export interface CapacityDay {
  /** ISO date, yyyy-mm-dd */
  date: string;
  label: string;
  neededHours: number;
  availableHours: number;
}

export type SwapStatus = "pending" | "approved" | "declined";

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetId: string;
  targetName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SwapStatus;
  /** Local ISO datetime, yyyy-mm-ddTHH:mm:ss */
  requestedAt: string;
  /** Set when the system found a clash with the swap. */
  conflictMessage?: string;
}

export interface ScheduleSuggestion {
  visitId: string;
  carerId: string;
  carerName: string;
  /** 0 to 100, higher is a better match. */
  score: number;
  reasons: string[];
  conflicts: VisitConflict[];
  violations: PreferenceViolation[];
}

export interface WhatIfResult {
  absentCarerId: string;
  date: string;
  reassignments: ScheduleSuggestion[];
  unresolvedVisitIds: string[];
}

/* ── Forms ──────────────────────────────────────────────────── */

export type ScheduleFormErrors = Partial<Record<string, string>>;

export interface VisitFormData {
  patientId: string;
  carerId: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  startTime: string;
  durationMinutes: number | "";
  type: VisitType | "";
  templateId: string;
  title: string;
  location: string;
  notes: string;
}

export interface EditVisitFormData extends VisitFormData {
  status: VisitStatus | "";
}

export interface RecurringVisitFormData {
  patientId: string;
  carerId: string;
  templateId: string;
  type: VisitType | "";
  startDate: string;
  endDate: string;
  startTime: string;
  durationMinutes: number | "";
  frequency: RecurringFrequency | "";
  days: ScheduleDayOfWeek[];
}

export interface VisitTemplateFormData {
  name: string;
  type: VisitType | "";
  durationMinutes: number | "";
  /** One task per line. */
  tasks: string;
  requiredSkills: string[];
}

/* ── Derived data (built by utils, rendered by sections) ────── */

/** Everything the conflict and AI logic needs to look things up. */
export interface ScheduleContext {
  visits: ScheduleVisit[];
  carers: ScheduleCarer[];
  patients: SchedulePatient[];
}

export interface VisitIssues {
  conflicts: VisitConflict[];
  violations: PreferenceViolation[];
}

export interface UnassignedCounts {
  today: number;
  tomorrow: number;
  restOfWeek: number;
}

export interface VisitStatusCounts {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  missedOrCancelled: number;
}

export type CapacityStatus = "ok" | "tight" | "short";

export interface CapacitySummary {
  totalNeededHours: number;
  totalAvailableHours: number;
  /** Available minus needed. Negative means a shortfall. */
  differenceHours: number;
  utilisationPercent: number;
  shortfallDays: CapacityDay[];
  status: CapacityStatus;
}

export interface OptimiseResult {
  suggestions: ScheduleSuggestion[];
  unresolvedVisitIds: string[];
}

export interface ScheduleSelectOption {
  value: string;
  label: string;
}

/** One accepted assignment from the optimiser or what-if dialog. */
export interface ScheduleAssignment {
  visitId: string;
  carerId: string;
}

/** What the optimise dialog is showing: suggestions for given visits, or a what-if scenario. */
export type OptimiseDialogMode =
  | { kind: 'assign'; visitIds: string[] }
  | { kind: 'what-if' };