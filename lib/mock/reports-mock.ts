import type { AiInsight, LibraryReport, ReportActivity, ReportDataset, ReportKpi, ReportSchedule, ReportTemplate } from "types";
import { clinicalDatasets } from "./reports-clinical-mock";
import { complianceDatasets } from "./reports-compliance-mock";
import { financeDatasets } from "./reports-finance-mock";
import { operationsDatasets } from "./reports-operations-mock";
import { workforceDatasets } from "./reports-workforce-mock";

export const REPORTS_MOCK_NOW = new Date(2026, 9, 19, 12, 20);
export const REPORTS_CURRENT_USER = "Emma C.";

export const mockReportDatasets: ReportDataset[] = [
  ...complianceDatasets, ...clinicalDatasets, ...workforceDatasets, ...financeDatasets, ...operationsDatasets,
];

export const mockReportKpis: ReportKpi[] = [
  { id: "readiness", label: "CQC readiness", value: 84, previous: 82, unit: "score", higherIsBetter: true, target: 85, targetLabel: "Target 85" },
  { id: "on-time", label: "On-time rate", value: 96.2, previous: 94.8, unit: "percent", higherIsBetter: true, target: 95, targetLabel: "Target 95%" },
  { id: "incidents", label: "Incidents this month", value: 7, previous: 9, unit: "count", higherIsBetter: false, targetLabel: "Lower is better" },
  { id: "mar", label: "Medication accuracy", value: 94.6, previous: 93.8, unit: "percent", higherIsBetter: true, target: 95, targetLabel: "Target 95%" },
  { id: "revenue", label: "Revenue invoiced", value: 42500, previous: 40400, unit: "currency", higherIsBetter: true },
];

export const mockLibraryReports: LibraryReport[] = [
  { id: "cqc-pack", title: "CQC inspection pack", description: "Readiness score, factors, staff compliance, complaints and the audit trail in one evidence bundle.", source: "Blueprint 3.4.4 / 5.6", domain: "compliance", roles: ["owner", "registered-manager"],
    datasetIds: ["cqc-questions", "readiness-factors", "staff-compliance", "complaints-log", "audit-trail"] },
  { id: "monthly-kpi", title: "Monthly KPI summary", description: "The board report: P&L, CQC score, incidents, staff compliance and on-time rate.", source: "Blueprint 5.6 / 10.3", domain: "operations", roles: ["owner"],
    datasetIds: ["pnl-monthly", "cqc-questions", "incidents-by-type", "staff-compliance", "on-time-trend"] },
  { id: "medication-audit", title: "Medication audit", description: "Administration rate, refusals and omissions for the registered manager.", source: "Blueprint 3.1.4 / automation 25", domain: "clinical", roles: ["owner", "registered-manager"], datasetIds: ["mar-audit"] },
  { id: "incident-trends", title: "Incident trend analysis", description: "Incidents by type, severity and time of day, as evidence of a learning culture.", source: "Blueprint 3.1.6 / 6.9", domain: "clinical", roles: ["owner", "registered-manager", "coordinator"],
    datasetIds: ["incidents-by-type", "incidents-by-severity", "incidents-by-hour"] },
  { id: "staff-compliance-report", title: "Staff compliance", description: "DBS, right to work, supervision and the training matrix for every carer.", source: "Blueprint 3.2.4 / 5.4", domain: "workforce", roles: ["owner", "registered-manager"], datasetIds: ["staff-compliance", "training-matrix"] },
  { id: "financial-pnl", title: "Financial P&L", description: "Monthly revenue, direct costs and gross margin, ready for your accountant.", source: "Blueprint 3.6.3", domain: "finance", roles: ["owner", "finance-admin"], datasetIds: ["pnl-monthly", "revenue-by-funding"] },
  { id: "patient-outcomes-report", title: "Patient outcome summary", description: "Progress against care plan goals plus nutrition and hydration trends.", source: "Blueprint 5.6", domain: "clinical", roles: ["owner", "registered-manager"], datasetIds: ["patient-outcomes", "nutrition-hydration"] },
];

const at = (y: number, m: number, d: number, h: number, min = 0) => new Date(y, m, d, h, min);

export const mockReportSchedules: ReportSchedule[] = [
  { id: "sch-1", reportId: "monthly-kpi", frequency: "monthly", time: "07:00", dayOfMonth: 1, recipients: ["owner@careflow.dev"], status: "active", lastRun: { at: at(2026, 9, 1, 7), status: "success" }, nextRun: at(2026, 10, 1, 7) },
  { id: "sch-2", reportId: "medication-audit", frequency: "monthly", time: "06:00", dayOfMonth: 1, recipients: ["manager@careflow.dev", "owner@careflow.dev"], status: "active", lastRun: { at: at(2026, 9, 1, 6), status: "success" }, nextRun: at(2026, 10, 1, 6) },
  { id: "sch-3", reportId: "incident-trends", frequency: "weekly", time: "08:00", dayOfWeek: 1, recipients: ["manager@careflow.dev"], status: "paused", lastRun: { at: at(2026, 9, 12, 8), status: "failed" }, nextRun: at(2026, 9, 26, 8) },
];

export const mockReportTemplates: ReportTemplate[] = [
  { id: "tpl-1", name: "Incidents by type (quarter)", createdAt: at(2026, 9, 2, 10), createdBy: "Emma C.",
    config: { datasetId: "incidents-by-type", fields: ["type", "count"], groupBy: "type", aggregate: "sum", chart: "bar", from: "", to: "" } },
];

export const mockAiInsights: AiInsight[] = [
  { id: "ins-1", kind: "predictive-health", severity: "high", subject: "Robert Ahmed", phase: 2, status: "suggested", title: "Fluid intake is declining",
    summary: "Fluid intake has fallen 40% below his baseline over the past 7 days. Consider contacting the GP.", evidence: ["Baseline 1.5L a day, last 7 days average 0.9L", "3 of the last 5 visits record only sips of water"] },
  { id: "ins-2", kind: "predictive-health", severity: "high", subject: "Dorothy Chen", phase: 2, status: "suggested", title: "Second near-fall in 10 days",
    summary: "Repeated near-falls suggest rising fall risk. Consider updating the falls risk assessment and requesting an occupational therapy referral.", evidence: ["Near-falls on 9 Oct and 18 Oct", "Falls risk already rated High"] },
  { id: "ins-3", kind: "predictive-health", severity: "medium", subject: "Edna Morris", phase: 2, status: "suggested", title: "More low-mood observations",
    summary: "Low mood or withdrawal was recorded at 4 of the last 7 visits, up from 1 of 7 the week before.", evidence: ["4 of 7 visits note low mood", "Appetite also down 12%"] },
  { id: "ins-4", kind: "incident-pattern", severity: "medium", subject: "Night shifts", phase: 2, status: "suggested", title: "Falls cluster between midnight and 6am",
    summary: "5 of 16 incidents happened on night shifts, the highest share of any time slot.", evidence: ["00:00–06:00: 5 incidents", "Average per slot: 4"] },
  { id: "ins-5", kind: "compliance", severity: "high", subject: "Mark Davis", phase: 2, status: "suggested", title: "Expired training, still scheduled",
    summary: "Safeguarding training expired 3 days ago, but this carer is still scheduled for 3 visits this week.", evidence: ["Safeguarding certificate expired 16 Oct", "3 visits booked 20–23 Oct"] },
  { id: "ins-6", kind: "compliance", severity: "medium", subject: "Medication records", phase: 2, status: "suggested", title: "Unexplained gaps in the MAR",
    summary: "4 doses from yesterday's evening round have nothing recorded.", evidence: ["Metformin, Atorvastatin, Senna and Lactulose", "No refusal or omission reason logged"] },
  { id: "ins-7", kind: "wellbeing", severity: "medium", subject: "2 carers", phase: 2, status: "suggested", title: "Wellbeing scores are declining",
    summary: "Two carers have reported low wellbeing for 3 or more consecutive days. A supervisor check-in is suggested.", evidence: ["Both are working more than 45 hours a week", "Confidential: shown to supervisors only"] },
  { id: "ins-8", kind: "daily-summary", severity: "low", subject: "Today", phase: 1, status: "suggested", title: "Daily summary: 2 visits missed",
    summary: "48 visits scheduled, 2 missed, 2 late. 1 incident reported and 5 notes were recorded late.", evidence: ["Missed: Dorothy Chen, James Okafor", "Incident: Edna Morris (safeguarding concern)"] },
];

export const mockReportActivity: ReportActivity[] = [
  { id: "act-1", at: at(2026, 9, 18, 16, 40), user: "Emma C.", action: "export", target: "Medication audit", detail: "CSV" },
  { id: "act-2", at: at(2026, 9, 18, 9, 5), user: "Sarah W.", action: "run", target: "Incident trend analysis" },
  { id: "act-3", at: at(2026, 9, 16, 14, 20), user: "Emma C.", action: "schedule", target: "Monthly KPI summary", detail: "Monthly, 07:00" },
  { id: "act-4", at: at(2026, 9, 2, 10, 0), user: "Emma C.", action: "template", target: "Incidents by type (quarter)", detail: "Saved" },
];
