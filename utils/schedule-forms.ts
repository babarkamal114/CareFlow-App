import type {
  EditVisitFormData,
  RecurringRule,
  RecurringVisitFormData,
  ScheduleContext,
  ScheduleVisit,
  VisitFormData,
  VisitStatus,
  VisitTemplate,
  VisitTemplateFormData,
} from "types";
import { VISIT_TYPE_LABELS } from "./schedule-labels";
import {
  addDaysIso,
  calculateEndTime,
  daysBetween,
  getDayOfWeek,
  getDurationMinutes,
  startOfWeekIso,
} from "./schedule-time";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const MAX_RECURRING_DAYS = 366;

let idCounter = 0;

/** Mock id generator. Call it from event handlers only, never during render. */
export function createScheduleId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}${idCounter}`;
}

/* ── Visit forms ────────────────────────────────────────────── */

export function createVisitFormData(defaults: Partial<VisitFormData> = {}): VisitFormData {
  return {
    patientId: "",
    carerId: "",
    date: "",
    startTime: "09:00",
    durationMinutes: 60,
    type: "care-visit",
    templateId: "",
    title: "",
    location: "",
    notes: "",
    ...defaults,
  };
}

export function visitToFormData(visit: ScheduleVisit): EditVisitFormData {
  return {
    patientId: visit.patientId,
    carerId: visit.carerId ?? "",
    date: visit.date,
    startTime: visit.startTime,
    durationMinutes: getDurationMinutes(visit.startTime, visit.endTime),
    type: visit.type,
    templateId: visit.templateId ?? "",
    title: visit.title,
    location: visit.address,
    notes: visit.notes,
    status: visit.status,
  };
}

/** "30-min morning personal care" becomes "Morning personal care". */
export function templateToTitle(name: string): string {
  const stripped = name.replace(/^\d+-min\s+/i, "");
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

export function applyTemplateToForm<T extends VisitFormData>(data: T, template: VisitTemplate): T {
  return {
    ...data,
    templateId: template.id,
    title: templateToTitle(template.name),
    type: template.type,
    durationMinutes: template.durationMinutes,
  };
}

interface BuildVisitOptions {
  /** The visit being edited. Its skills and address are kept unless overridden. */
  base?: ScheduleVisit;
  status?: VisitStatus;
  templates?: VisitTemplate[];
}

/** Builds a visit from form values. Patient name, area and carer name are looked up, never typed. */
export function formDataToVisit(
  data: VisitFormData,
  id: string,
  ctx: ScheduleContext,
  { base, status = "scheduled", templates = [] }: BuildVisitOptions = {}
): ScheduleVisit {
  const patient = ctx.patients.find((p) => p.id === data.patientId);
  const carer = ctx.carers.find((c) => c.id === data.carerId);
  const template = templates.find((t) => t.id === data.templateId);
  const duration = typeof data.durationMinutes === "number" ? data.durationMinutes : 60;

  return {
    id,
    patientId: data.patientId,
    patientName: patient?.name ?? base?.patientName ?? "",
    carerId: carer ? carer.id : null,
    carerName: carer?.name ?? "",
    date: data.date,
    startTime: data.startTime,
    endTime: calculateEndTime(data.startTime, duration),
    title: data.title.trim(),
    type: data.type === "" ? "care-visit" : data.type,
    status,
    address: data.location.trim() || patient?.address || base?.address || "",
    area: patient?.area ?? base?.area ?? "central",
    notes: data.notes.trim(),
    requiredSkills: template ? template.requiredSkills : (base?.requiredSkills ?? []),
    templateId: data.templateId || undefined,
    recurringRuleId: base?.recurringRuleId,
  };
}

/** True once the form has enough valid values to check conflicts against. */
export function canPreviewIssues(data: VisitFormData): boolean {
  return (
    data.patientId !== "" &&
    data.carerId !== "" &&
    data.date !== "" &&
    TIME_PATTERN.test(data.startTime) &&
    typeof data.durationMinutes === "number"
  );
}

/* ── Recurring visits ───────────────────────────────────────── */

export function createRecurringFormData(
  defaults: Partial<RecurringVisitFormData> = {}
): RecurringVisitFormData {
  return {
    patientId: "",
    carerId: "",
    templateId: "",
    type: "care-visit",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    durationMinutes: 30,
    frequency: "weekly",
    days: ["mon", "tue", "wed", "thu", "fri"],
    ...defaults,
  };
}

export function recurringFormToRule(data: RecurringVisitFormData, id: string): RecurringRule {
  return {
    id,
    patientId: data.patientId,
    carerId: data.carerId === "" ? null : data.carerId,
    templateId: data.templateId === "" ? undefined : data.templateId,
    type: data.type === "" ? "care-visit" : data.type,
    startTime: data.startTime,
    durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : 30,
    frequency: data.frequency === "" ? "weekly" : data.frequency,
    days: data.days,
    startDate: data.startDate,
    endDate: data.endDate,
  };
}

function ruleMatchesDate(rule: RecurringRule, date: string): boolean {
  if (rule.frequency === "daily") return true;
  if (!rule.days.includes(getDayOfWeek(date))) return false;
  if (rule.frequency === "weekly") return true;

  // Fortnightly: every second week, counting from the week the rule starts.
  const weeksApart = daysBetween(startOfWeekIso(rule.startDate), startOfWeekIso(date)) / 7;
  return weeksApart % 2 === 0;
}

/** Every visit a rule produces between its start and end date (capped at 12 months). */
export function expandRecurringRule(
  rule: RecurringRule,
  ctx: ScheduleContext,
  templates: VisitTemplate[] = []
): ScheduleVisit[] {
  if (!rule.startDate || !rule.endDate) return [];
  const template = templates.find((t) => t.id === rule.templateId);
  const title = template ? templateToTitle(template.name) : VISIT_TYPE_LABELS[rule.type];
  const span = Math.min(daysBetween(rule.startDate, rule.endDate), MAX_RECURRING_DAYS);
  const visits: ScheduleVisit[] = [];

  for (let offset = 0; offset <= span; offset += 1) {
    const date = addDaysIso(rule.startDate, offset);
    if (!ruleMatchesDate(rule, date)) continue;

    const form = createVisitFormData({
      patientId: rule.patientId,
      carerId: rule.carerId ?? "",
      date,
      startTime: rule.startTime,
      durationMinutes: rule.durationMinutes,
      type: rule.type,
      templateId: rule.templateId ?? "",
      title,
    });

    visits.push({
      ...formDataToVisit(form, `${rule.id}-${date}`, ctx, { templates }),
      recurringRuleId: rule.id,
    });
  }

  return visits;
}

/* ── Templates ──────────────────────────────────────────────── */

export function createTemplateFormData(): VisitTemplateFormData {
  return { name: "", type: "care-visit", durationMinutes: 30, tasks: "", requiredSkills: [] };
}

export function parseTaskLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

export function templateFormToTemplate(data: VisitTemplateFormData, id: string): VisitTemplate {
  return {
    id,
    name: data.name.trim(),
    type: data.type === "" ? "care-visit" : data.type,
    durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : 30,
    tasks: parseTaskLines(data.tasks),
    requiredSkills: data.requiredSkills,
  };
}