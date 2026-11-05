import { z } from "zod";
import type {
  AlertSeverity, AuditFilters, AuditLog, ComplianceAlert, ComplianceFormErrors, CqcQuestionId, CqcQuestionScore, PackSection,
  PackSectionId, ReadinessFactor, RegStatus, Regulation, RegulationFilters, ScoreBand, ScoreHistoryPoint,
  SignatureItem,
} from "types";

export const CQC_QUESTION_ORDER: CqcQuestionId[] = ["safe", "effective", "caring", "responsive", "well-led"];

const weightedAverage = (items: { score: number; weight: number }[]): number => {
  const total = items.reduce((s, i) => s + i.weight, 0);
  return total > 0 ? Math.round(items.reduce((s, i) => s + i.score * i.weight, 0) / total) : 0;
};

export const calcOverallScore = (factors: ReadinessFactor[]): number => weightedAverage(factors);

/** Each CQC key question = weighted average of the factors that feed it. */
export function calcQuestionScores(
  factors: ReadinessFactor[],
  improvements: Record<CqcQuestionId, string[]>,
  labels: Record<CqcQuestionId, string>,
): CqcQuestionScore[] {
  return CQC_QUESTION_ORDER.map((id) => ({
    id,
    label: labels[id],
    score: weightedAverage(factors.filter((f) => f.questions.includes(id))),
    improvements: improvements[id] ?? [],
  }));
}

export function getScoreBand(score: number): ScoreBand {
  if (score >= 85) return "good";
  if (score >= 70) return "needs-improvement";
  return "requires-action";
}

/** The last month always reflects the live calculated score; `months` trims to the last 3 / 6 / 12. */
export function buildScoreTrend(
  history: ScoreHistoryPoint[],
  overall: number,
  responsive: number,
  months: number,
): ScoreHistoryPoint[] {
  const live = history.map((p, i) => (i === history.length - 1 ? { ...p, overall, responsive } : p));
  return live.slice(-months);
}

// ---- Regulations ----

export function filterRegulations(regs: Regulation[], f: RegulationFilters): Regulation[] {
  const q = f.search.trim().toLowerCase();
  return regs.filter(
    (r) =>
      (!q || r.title.toLowerCase().includes(q) || r.reg.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) &&
      (f.category === "All" || r.category === f.category) &&
      (f.status === "All" || r.status === f.status),
  );
}

export function countRegulationsByStatus(regs: Regulation[]): Record<RegStatus, number> {
  const counts: Record<RegStatus, number> = { Compliant: 0, Attention: 0, Risk: 0, "N/A": 0 };
  regs.forEach((r) => { counts[r.status] += 1; });
  return counts;
}

export const getEvidenceCount = (reg: Regulation) => ({
  done: reg.evidenceItems.filter((e) => e.done).length,
  total: reg.evidenceItems.length,
});

// ---- Dates ----

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayDiff = (a: Date, b: Date) => Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
const clock = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const dayMonth = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** "09:42" today, "Yesterday 17:40", otherwise "12 Oct 10:30". */
export function formatAuditTime(date: Date, asOf: Date = new Date()): string {
  const diff = dayDiff(asOf, date);
  if (diff === 0) return clock(date);
  if (diff === 1) return `Yesterday ${clock(date)}`;
  return `${dayMonth(date)} ${clock(date)}`;
}

/** "Today · 09:42", "Yesterday · 17:40", "12 Oct 2026 · 10:30". */
export function formatStamp(date: Date, asOf: Date = new Date()): string {
  const diff = dayDiff(asOf, date);
  if (diff === 0) return `Today · ${clock(date)}`;
  if (diff === 1) return `Yesterday · ${clock(date)}`;
  return `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · ${clock(date)}`;
}

export function formatDueLabel(date: Date, asOf: Date = new Date()): string {
  const diff = dayDiff(date, asOf);
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  return dayMonth(date);
}

export const formatLongDate = (date: Date): string =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Parses yyyy-MM-dd as a LOCAL date (new Date("2026-10-14") would be UTC and can shift a day). */
export function parseLocalDate(value: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
}

/** Copy of `base` moved by `days` (negative = past). */
export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/** `base` moved by `dayOffset` days, set to an "HH:mm" time of day. */
export function dateAt(base: Date, dayOffset: number, hhmm: string): Date {
  const d = addDays(base, dayOffset);
  const [h, m] = hhmm.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

/** "14 October" (long month, used in alert copy). */
export const formatDayLongMonth = (date: Date): string =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

// ---- Audit trail ----

export function filterAuditLogs(logs: AuditLog[], f: AuditFilters): AuditLog[] {
  const q = f.search.trim().toLowerCase();
  const from = parseLocalDate(f.from);
  const to = parseLocalDate(f.to);
  const toEnd = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59) : undefined;

  return logs
    .filter((l) => {
      if (f.entity !== "All" && l.entity !== f.entity) return false;
      if (from && l.timestamp < from) return false;
      if (toEnd && l.timestamp > toEnd) return false;
      if (!q) return true;
      return [l.action, l.details, l.user, l.patient ?? ""].some((v) => v.toLowerCase().includes(q));
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const getInitials = (name: string): string =>
  name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

// ---- Alerts and signatures ----

const SEVERITY_ORDER: Record<AlertSeverity, number> = { urgent: 0, warning: 1, info: 2 };

export const getOpenAlerts = (alerts: ComplianceAlert[]): ComplianceAlert[] =>
  alerts.filter((a) => !a.resolved).sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

export function countSignatures(items: SignatureItem[]) {
  return {
    signed: items.filter((i) => i.status === "signed").length,
    pending: items.filter((i) => i.status === "pending").length,
    overdue: items.filter((i) => i.status === "overdue").length,
  };
}

// ---- Inspection pack ----

export const sumPackPages = (sections: PackSection[], selected: PackSectionId[]): number =>
  sections.filter((s) => selected.includes(s.id)).reduce((sum, s) => sum + s.pages, 0);

// ---- Form validation (zod helpers) ----

export const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

export const requiredIsoDate = (label: string) =>
  z.string().trim().min(1, `${label} is required`).refine((v) => !Number.isNaN(new Date(v).getTime()), {
    message: `Enter a valid ${label.toLowerCase()}`,
  });

export function zodToFormErrors(error: z.ZodError, fallbackKey = "form"): ComplianceFormErrors {
  const errors: ComplianceFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : fallbackKey;
    if (errors[key] === undefined) errors[key] = issue.message;
  }
  return errors;
}

export function runSchema<TSchema extends z.ZodType>(schema: TSchema, data: z.input<TSchema>): ComplianceFormErrors {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error);
}
