import type { AiInsight, LibraryReport, ReportActivity, ReportDataset, ReportKpi, ReportSchedule, ReportTemplate } from "types";
import { mockClinicalDatasets } from "./reports-clinical-mock";
import { mockComplianceDatasets } from "./reports-compliance-mock";
import { mockFinanceDatasets } from "./reports-finance-mock";
import { mockOperationsDatasets } from "./reports-operations-mock";
import { mockWorkforceDatasets } from "./reports-workforce-mock";

export const REPORTS_MOCK_NOW = new Date(2026, 9, 19, 12, 20);
export const REPORTS_CURRENT_USER = "Emma C.";

export const mockReportKpis: ReportKpi[] = [
  { id: "readiness", label: "CQC readiness", value: 84, previous: 82, unit: "score", higherIsBetter: true, target: 85, targetLabel: "Target 85" },
  { id: "on-time", label: "On-time rate", value: 96.2, previous: 94.8, unit: "percent", higherIsBetter: true, target: 95, targetLabel: "Target 95%" },
  { id: "incidents", label: "Incidents this month", value: 7, previous: 9, unit: "count", higherIsBetter: false, targetLabel: "Lower is better" },
  { id: "mar", label: "Medication accuracy", value: 94.6, previous: 93.8, unit: "percent", higherIsBetter: true, target: 95, targetLabel: "Target 95%" },
  { id: "revenue", label: "Revenue invoiced", value: 42500, previous: 40400, unit: "currency", higherIsBetter: true },
];

export const mockLibraryReports: LibraryReport[] = [
  { id: "cqc-pack", title: "CQC inspection pack", description: "Readiness score, factors, staff compliance, complaints and the audit trail in one evidence bundle.", domain: "compliance", roles: ["owner", "registered-manager"], datasetIds: ["cqc-questions", "readiness-factors", "staff-compliance", "complaints-log", "audit-trail"] },
  { id: "monthly-kpi", title: "Monthly KPI summary", description: "The board report: P&L, CQC score, incidents, staff compliance and on-time rate.", domain: "operations", roles: ["owner"], datasetIds: ["pnl-monthly", "cqc-questions", "incidents-by-type", "staff-compliance", "on-time-trend"] },
  { id: "medication-audit", title: "Medication audit", description: "Administration rate, refusals and omissions for the registered manager.", domain: "clinical", roles: ["owner", "registered-manager"], datasetIds: ["mar-audit"] },
  { id: "incident-trends", title: "Incident trend analysis", description: "Incidents by type, severity and time of day, as evidence of a learning culture.", domain: "clinical", roles: ["owner", "registered-manager", "coordinator"], datasetIds: ["incidents-by-type", "incidents-by-severity", "incidents-by-hour"] },
  { id: "staff-compliance-report", title: "Staff compliance", description: "DBS, right to work, supervision and the training matrix for every carer.",  domain: "workforce", roles: ["owner", "registered-manager"], datasetIds: ["staff-compliance", "training-matrix"] },
  { id: "financial-pnl", title: "Financial P&L", description: "Monthly revenue, direct costs and gross margin, ready for your accountant.", domain: "finance", roles: ["owner", "finance-admin"], datasetIds: ["pnl-monthly", "revenue-by-funding"] },
  { id: "patient-outcomes-report", title: "Patient outcome summary", description: "Progress against care plan goals plus nutrition and hydration trends.", domain: "clinical", roles: ["owner", "registered-manager"], datasetIds: ["patient-outcomes", "nutrition-hydration"] },
];

export const mockReportSchedules: ReportSchedule[] = [
  { id: "sch-1", reportId: "monthly-kpi", frequency: "monthly", time: "07:00", dayOfMonth: 1, recipients: ["owner@careflow.dev"], status: "active", lastRun: { at: new Date(2026, 9, 1, 7, 0), status: "success" }, nextRun: new Date(2026, 10, 1, 7, 0) },
  { id: "sch-2", reportId: "medication-audit", frequency: "monthly", time: "06:00", dayOfMonth: 1, recipients: ["manager@careflow.dev", "owner@careflow.dev"], status: "active", lastRun: { at: new Date(2026, 9, 1, 6, 0), status: "success" }, nextRun: new Date(2026, 10, 1, 6, 0) },
  { id: "sch-3", reportId: "incident-trends", frequency: "weekly", time: "08:00", dayOfWeek: 1, recipients: ["manager@careflow.dev"], status: "paused", lastRun: { at: new Date(2026, 9, 12, 8, 0), status: "failed" }, nextRun: new Date(2026, 9, 26, 8, 0) },
];

export const mockReportTemplates: ReportTemplate[] = [
  { id: "tpl-1", name: "Incidents by type (quarter)", createdAt: new Date(2026, 9, 2, 10, 0), createdBy: "Emma C.", config: { datasetId: "incidents-by-type", fields: ["type", "count"], groupBy: "type", aggregate: "sum", chart: "bar", from: "", to: "" } },
];

export const mockAiInsights: AiInsight[] = [
  { id: "ins-1", kind: "predictive-health", severity: "high", subject: "Robert Ahmed", phase: 2, status: "suggested", title: "Fluid intake is declining", summary: "Fluid intake has fallen 40% below his baseline over the past 7 days. Consider contacting the GP.", evidence: ["Baseline 1.5L a day, last 7 days average 0.9L", "3 of the last 5 visits record only sips of water"] },
  { id: "ins-2", kind: "predictive-health", severity: "high", subject: "Dorothy Chen", phase: 2, status: "suggested", title: "Second near-fall in 10 days", summary: "Repeated near-falls suggest rising fall risk. Consider updating the falls risk assessment and requesting an occupational therapy referral.", evidence: ["Near-falls on 9 Oct and 18 Oct", "Falls risk already rated High"] },
  { id: "ins-3", kind: "predictive-health", severity: "medium", subject: "Edna Morris", phase: 2, status: "suggested", title: "More low-mood observations", summary: "Low mood or withdrawal was recorded at 4 of the last 7 visits, up from 1 of 7 the week before.", evidence: ["4 of 7 visits note low mood", "Appetite also down 12%"] },
  { id: "ins-4", kind: "incident-pattern", severity: "medium", subject: "Night shifts", phase: 2, status: "suggested", title: "Falls cluster between midnight and 6am", summary: "5 of 16 incidents happened on night shifts, the highest share of any time slot.", evidence: ["00:00–06:00: 5 incidents", "Average per slot: 4"] },
  { id: "ins-5", kind: "compliance", severity: "high", subject: "Mark Davis", phase: 2, status: "suggested", title: "Expired training, still scheduled", summary: "Safeguarding training expired 3 days ago, but this carer is still scheduled for 3 visits this week.", evidence: ["Safeguarding certificate expired 16 Oct", "3 visits booked 20–23 Oct"] },
  { id: "ins-6", kind: "compliance", severity: "medium", subject: "Medication records", phase: 2, status: "suggested", title: "Unexplained gaps in the MAR", summary: "4 doses from yesterday's evening round have nothing recorded.", evidence: ["Metformin, Atorvastatin, Senna and Lactulose", "No refusal or omission reason logged"] },
  { id: "ins-7", kind: "wellbeing", severity: "medium", subject: "2 carers", phase: 2, status: "suggested", title: "Wellbeing scores are declining", summary: "Two carers have reported low wellbeing for 3 or more consecutive days. A supervisor check-in is suggested.", evidence: ["Both are working more than 45 hours a week", "Confidential: shown to supervisors only"] },
  { id: "ins-8", kind: "daily-summary", severity: "low", subject: "Today", phase: 1, status: "suggested", title: "Daily summary: 2 visits missed", summary: "48 visits scheduled, 2 missed, 2 late. 1 incident reported and 5 notes were recorded late.", evidence: ["Missed: Dorothy Chen, James Okafor", "Incident: Edna Morris (safeguarding concern)"] },
];

export const mockReportActivity: ReportActivity[] = [
  { id: "act-1", at: new Date(2026, 9, 18, 16, 40), user: "Emma C.", action: "export", target: "Medication audit", detail: "CSV" },
  { id: "act-2", at: new Date(2026, 9, 18, 9, 5), user: "Sarah W.", action: "run", target: "Incident trend analysis" },
  { id: "act-3", at: new Date(2026, 9, 16, 14, 20), user: "Emma C.", action: "schedule", target: "Monthly KPI summary", detail: "Monthly, 07:00" },
  { id: "act-4", at: new Date(2026, 9, 2, 10, 0), user: "Emma C.", action: "template", target: "Incidents by type (quarter)", detail: "Saved" },
];

export const mockReportCatalog: Pick<ReportDataset, "id" | "title" | "domain" | "roles">[] = [
  { id: "cqc-questions", title: "CQC five key questions", domain: "compliance", roles: ["owner", "registered-manager"] },
  { id: "readiness-factors", title: "Readiness score factors", domain: "compliance", roles: ["owner", "registered-manager"] },
  { id: "audit-trail", title: "Audit trail", domain: "compliance", roles: ["owner", "registered-manager"] },
  { id: "continuity-of-care", title: "Continuity of care", domain: "compliance", roles: ["owner", "registered-manager"] },
  { id: "complaints-log", title: "Complaints log", domain: "compliance", roles: ["owner", "registered-manager"] },
  { id: "mar-audit", title: "Medication administration rate", domain: "clinical", roles: ["owner", "registered-manager"] },
  { id: "incidents-by-type", title: "Incidents by type", domain: "clinical", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "incidents-by-severity", title: "Incidents by severity", domain: "clinical", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "incidents-by-hour", title: "Incidents by time of day", domain: "clinical", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "nutrition-hydration", title: "Nutrition and hydration", domain: "clinical", roles: ["owner", "registered-manager"] },
  { id: "patient-outcomes", title: "Patient outcomes", domain: "clinical", roles: ["owner", "registered-manager"] },
  { id: "training-matrix", title: "Training matrix", domain: "workforce", roles: ["owner", "registered-manager"] },
  { id: "staff-compliance", title: "Staff compliance status", domain: "workforce", roles: ["owner", "registered-manager"] },
  { id: "staff-performance", title: "Carer performance", domain: "workforce", roles: ["owner", "registered-manager"] },
  { id: "availability", title: "Availability and utilisation", domain: "workforce", roles: ["owner", "registered-manager"] },
  { id: "workforce-turnover", title: "Workforce health vs industry", domain: "workforce", roles: ["owner", "registered-manager"] },
  { id: "carer-costs", title: "Carer cost analysis", domain: "workforce", roles: ["owner", "finance-admin"] },
  { id: "revenue-overview", title: "Revenue overview", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "revenue-ageing", title: "Outstanding invoices by age", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "revenue-by-funding", title: "Revenue by funding source", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "budget-vs-actual", title: "Budget vs actual", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "cash-flow", title: "Cash flow projection", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "late-paying-funders", title: "Late-paying funders", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "pnl-monthly", title: "Monthly P&L", domain: "finance", roles: ["owner", "finance-admin"] },
  { id: "todays-numbers", title: "Today's visits", domain: "operations", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "on-time-trend", title: "On-time rate", domain: "operations", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "visit-duration", title: "Visit duration monitoring", domain: "operations", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "capacity-planning", title: "Capacity planning", domain: "operations", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "unassigned-visits", title: "Unassigned visits", domain: "operations", roles: ["owner", "registered-manager", "coordinator"] },
  { id: "geofence-flags", title: "Check-in flags", domain: "operations", roles: ["owner", "registered-manager", "coordinator"] },
];

// The 30 dashboard and report datasets live in one file per domain; this puts them back in one list.
export const mockReportDatasets: ReportDataset[] = [
  ...mockComplianceDatasets,
  ...mockClinicalDatasets,
  ...mockWorkforceDatasets,
  ...mockFinanceDatasets,
  ...mockOperationsDatasets,
];
