import type { BadgeProps } from "@/components/ui";
import { Activity, HeartPulse, PoundSterling, Scale, ShieldCheck, Sparkles, Users } from "lucide-react";
import type {
  AiInsight, AiInsightKind, ReportBuilderAggregate, ReportActivity, ReportChartKind, ReportDomain, ReportExportFormat, ReportRole, ReportTabId,
  ReportScheduleFrequency,
} from "types";

type BadgeVariant = BadgeProps["variant"];
const toOptions = <T extends string>(labels: Record<T, string>) => (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

export const REPORT_CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

// ---- Tabs and roles ----
export const REPORT_TABS: { id: ReportTabId; label: string; Icon: typeof Sparkles }[] = [
  { id: "compliance", label: "Compliance", Icon: ShieldCheck },
  { id: "clinical", label: "Clinical", Icon: HeartPulse },
  { id: "workforce", label: "Workforce", Icon: Users },
  { id: "finance", label: "Finance", Icon: PoundSterling },
  { id: "operations", label: "Operations", Icon: Activity },
  { id: "ai-insights", label: "AI insights", Icon: Sparkles },
  { id: "benchmarking", label: "Benchmarking", Icon: Scale },
];

export const REPORT_ROLE_LABEL: Record<ReportRole, string> = { owner: "Agency owner", "registered-manager": "Registered manager", coordinator: "Care coordinator", "finance-admin": "Finance admin" };
export const REPORT_ROLE_OPTIONS = toOptions(REPORT_ROLE_LABEL);
export const REPORT_ROLE_TABS: Record<ReportRole, ReportTabId[]> = {
  owner: ["compliance", "clinical", "workforce", "finance", "operations", "ai-insights", "benchmarking"],
  "registered-manager": ["compliance", "clinical", "workforce", "operations", "ai-insights", "benchmarking"],
  coordinator: ["clinical", "operations"],
  "finance-admin": ["finance"],
};

export const REPORT_TAB_WIDGETS: Record<ReportDomain, { datasetId: string; span: 1 | 2 }[]> = {
  compliance: [{ datasetId: "cqc-questions", span: 1 }, { datasetId: "readiness-factors", span: 1 }, { datasetId: "continuity-of-care", span: 1 }, { datasetId: "complaints-log", span: 1 }, { datasetId: "audit-trail", span: 2 }],
  clinical: [{ datasetId: "mar-audit", span: 1 }, { datasetId: "incidents-by-type", span: 1 }, { datasetId: "incidents-by-severity", span: 1 }, { datasetId: "incidents-by-hour", span: 1 }, { datasetId: "nutrition-hydration", span: 1 }, { datasetId: "patient-outcomes", span: 1 }],
  workforce: [{ datasetId: "training-matrix", span: 2 }, { datasetId: "staff-compliance", span: 2 }, { datasetId: "staff-performance", span: 1 }, { datasetId: "availability", span: 1 }, { datasetId: "workforce-turnover", span: 1 }, { datasetId: "carer-costs", span: 1 }],
  finance: [{ datasetId: "revenue-overview", span: 1 }, { datasetId: "revenue-ageing", span: 1 }, { datasetId: "revenue-by-funding", span: 1 }, { datasetId: "cash-flow", span: 1 }, { datasetId: "budget-vs-actual", span: 1 }, { datasetId: "late-paying-funders", span: 1 }, { datasetId: "pnl-monthly", span: 2 }],
  operations: [{ datasetId: "todays-numbers", span: 1 }, { datasetId: "on-time-trend", span: 1 }, { datasetId: "capacity-planning", span: 1 }, { datasetId: "unassigned-visits", span: 1 }, { datasetId: "visit-duration", span: 1 }, { datasetId: "geofence-flags", span: 1 }],
};

export const REPORT_DOMAIN_LABEL: Record<ReportDomain, string> = { compliance: "Compliance", clinical: "Clinical", workforce: "Workforce", finance: "Finance", operations: "Operations" };
export const REPORT_DOMAIN_BADGE: Record<ReportDomain, BadgeVariant> = { compliance: "pastel-success", clinical: "pastel-info", workforce: "pastel-indigo", finance: "pastel-purple", operations: "pastel-teal" };

// ---- Status cells (green / amber / red) ----
export const REPORT_STATUS_BADGE: Record<string, { label: string; variant: BadgeVariant }> = {
  good: { label: "Good", variant: "pastel-success" }, "needs-improvement": { label: "Needs improvement", variant: "pastel-warning" }, "requires-action": { label: "Requires action", variant: "pastel-danger" },
  clear: { label: "Clear", variant: "pastel-success" }, expiring: { label: "Expiring", variant: "pastel-warning" }, expired: { label: "Expired", variant: "pastel-danger" },
  pass: { label: "Pass", variant: "pastel-success" }, fail: { label: "Fail", variant: "pastel-danger" }, "not-started": { label: "Not started", variant: "pastel-neutral" },
  ok: { label: "On target", variant: "pastel-success" }, short: { label: "Short", variant: "pastel-danger" }, long: { label: "Long", variant: "pastel-warning" },
  open: { label: "Open", variant: "pastel-warning" }, investigating: { label: "Investigating", variant: "pastel-info" }, resolved: { label: "Resolved", variant: "pastel-success" },
  flagged: { label: "Flagged", variant: "pastel-danger" }, cleared: { label: "Cleared", variant: "pastel-success" },
};

// ---- Export, schedule, builder ----
export const REPORT_EXPORT_FORMAT_LABEL: Record<ReportExportFormat, string> = { pdf: "PDF (print)", excel: "Excel", csv: "CSV" };
export const REPORT_FREQUENCY_LABEL: Record<ReportScheduleFrequency, string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };
export const REPORT_FREQUENCY_OPTIONS = toOptions(REPORT_FREQUENCY_LABEL);
export const REPORT_WEEKDAY_OPTIONS = [{ value: "1", label: "Monday" }, { value: "2", label: "Tuesday" }, { value: "3", label: "Wednesday" }, { value: "4", label: "Thursday" }, { value: "5", label: "Friday" }, { value: "6", label: "Saturday" }, { value: "7", label: "Sunday" }];
export const REPORT_AGGREGATE_LABEL: Record<ReportBuilderAggregate, string> = { sum: "Total", avg: "Average", count: "Count" };
export const REPORT_AGGREGATE_OPTIONS = toOptions(REPORT_AGGREGATE_LABEL);
export const REPORT_CHART_KIND_LABEL: Record<ReportChartKind, string> = { bar: "Bar chart", line: "Line chart", donut: "Donut chart", table: "Table only" };
export const REPORT_CHART_KIND_OPTIONS = toOptions(REPORT_CHART_KIND_LABEL);
export const REPORT_ACTIVITY_LABEL: Record<ReportActivity["action"], string> = { run: "Ran report", export: "Exported", schedule: "Scheduled", template: "Template", insight: "AI insight" };

// ---- AI insights ----
export const REPORT_INSIGHT_KIND_CONFIG: Record<AiInsightKind, { label: string; badge: BadgeVariant }> = {
  "predictive-health": { label: "Predictive health", badge: "pastel-danger" }, "incident-pattern": { label: "Incident pattern", badge: "pastel-warning" },
  compliance: { label: "Compliance monitor", badge: "pastel-info" }, wellbeing: { label: "Carer wellbeing", badge: "pastel-purple" }, "daily-summary": { label: "Daily summary", badge: "pastel-neutral" },
};
export const REPORT_INSIGHT_SEVERITY_BADGE: Record<AiInsight["severity"], { label: string; variant: BadgeVariant }> = {
  high: { label: "High", variant: "pastel-danger" }, medium: { label: "Medium", variant: "pastel-warning" }, low: { label: "Low", variant: "pastel-neutral" },
};
