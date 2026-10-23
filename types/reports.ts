export type ReportFormErrors = Partial<Record<string, string>>;

export type ReportRole = "owner" | "registered-manager" | "coordinator" | "finance-admin";
export type ReportDomain = "compliance" | "clinical" | "workforce" | "finance" | "operations";
export type ReportTabId = ReportDomain | "ai-insights" | "benchmarking";
export type ReportExportFormat = "pdf" | "excel" | "csv";
export type ReportColumnKind = "text" | "number" | "percent" | "currency" | "date" | "status";
export type ReportChartKind = "bar" | "line" | "donut" | "table";
export type ReportRow = Record<string, string | number>;

export interface ReportColumn {
  key: string;
  label: string;
  kind: ReportColumnKind;
  groupable?: boolean; 
  dateKey?: boolean;
}

export interface ReportChartSpec { kind: ReportChartKind; xKey: string; yKeys: string[] }

export interface ReportDataset {
  id: string;
  domain: ReportDomain;
  title: string;
  description: string;
  source: string; 
  roles: ReportRole[]; 
  columns: ReportColumn[];
  rows: ReportRow[];
  chart: ReportChartSpec;
}

export interface ReportKpi {
  id: string;
  label: string;
  value: number;
  previous: number;
  unit: "score" | "percent" | "count" | "currency";
  higherIsBetter: boolean;
  target?: number;
  targetLabel?: string;
}

export interface LibraryReport {
  id: string;
  title: string;
  description: string;
  source: string;
  domain: ReportDomain;
  datasetIds: string[];
  roles: ReportRole[];
}

// ---- Scheduled reports ----
export type ReportScheduleFrequency = "daily" | "weekly" | "monthly";
export interface ReportSchedule {
  id: string;
  reportId: string;
  frequency: ReportScheduleFrequency;
  time: string; 
  dayOfWeek?: number; 
  dayOfMonth?: number; 
  recipients: string[];
  status: "active" | "paused";
  lastRun?: { at: Date; status: "success" | "failed" };
  nextRun: Date;
}

// ---- Custom builder ----
export type ReportBuilderAggregate = "sum" | "avg" | "count";
export interface ReportBuilderConfig {
  datasetId: string;
  fields: string[]; 
  groupBy: string; 
  aggregate: ReportBuilderAggregate;
  chart: ReportChartKind;
  from: string;
  to: string;
}
export interface ReportTemplate { id: string; name: string; config: ReportBuilderConfig; createdAt: Date; createdBy: string }
export interface ReportBuilderResult { columns: ReportColumn[]; rows: ReportRow[]; chart: ReportChartSpec }

// ---- AI insights ----
export type AiInsightKind = "predictive-health" | "incident-pattern" | "compliance" | "wellbeing" | "daily-summary";
export interface AiInsight {
  id: string;
  kind: AiInsightKind;
  title: string;
  summary: string;
  evidence: string[];
  severity: "high" | "medium" | "low";
  subject: string;
  status: "suggested" | "accepted" | "dismissed";
  phase: 1 | 2;
}

// ---- Activity log (who ran / exported what) ----
export interface ReportActivity {
  id: string;
  at: Date;
  user: string;
  action: "run" | "export" | "schedule" | "template" | "insight";
  target: string;
  detail?: string;
}

// ---- Forms (zod in lib/validations/reports) ----
export interface ReportScheduleFormData {
  reportId: string;
  frequency: ReportScheduleFrequency | "";
  time: string;
  dayOfWeek: number | "";
  dayOfMonth: number | "";
  recipients: string; 
}
export interface ReportTemplateFormData { name: string }
