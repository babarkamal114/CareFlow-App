import {REPORT_TABS} from 'config'

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

// ---- Forms ----
export interface ReportScheduleFormData {
  reportId: string;
  frequency: ReportScheduleFrequency | "";
  time: string;
  dayOfWeek: number | "";
  dayOfMonth: number | "";
  recipients: string; 
}
export interface ReportTemplateFormData { name: string }

// ---- Mock API request ----
export interface ReportMutationResponse {
  success: boolean;
  message: string;
}

export interface LogReportActivityVariables {
  action: ReportActivity["action"];
  target: string;
  detail?: string;
}

export interface SaveReportScheduleVariables {
  id?: string;
  data: ReportScheduleFormData;
}

export interface SetReportScheduleStatusVariables {
  id: string;
  status: ReportSchedule["status"];
}

export interface SaveReportTemplateVariables {
  name: string;
  config: ReportBuilderConfig;
}

export interface ReviewAiInsightVariables {
  id: string;
  status: "accepted" | "dismissed";
}


// ---- Use-hooks-types ----


export interface ScheduleDialogState {
    open: boolean;
    reportId: string | null;
    schedule: ReportSchedule | null;
}

export interface UseScheduledReportsReturn {
    schedules: ReportSchedule[];
    reports: LibraryReport[];
    now: Date;
    isLoading: boolean;
    reportTitle: (id: string) => string;

    dialog: ScheduleDialogState;
    openCreate: (reportId?: string) => void;
    openEdit: (schedule: ReportSchedule) => void;
    closeDialog: () => void;
    submit: (data: ReportScheduleFormData) => void;
    isSaving: boolean;
    toggleStatus: (schedule: ReportSchedule) => void;

    deleteTarget: ReportSchedule | null;
    askDelete: (schedule: ReportSchedule | null) => void;
    confirmDelete: () => void;
    isDeleting: boolean;
}

export interface UseReportsAccessReturn {
    role: ReportRole;
    setRole: (role: ReportRole) => void;
    tabs: typeof REPORT_TABS;
    can: (roles: ReportRole[]) => boolean;
}

export interface UseReportExportReturn {
    exportReport: (format: ReportExportFormat, title: string, datasets: ReportDataset[]) => void;
    logRun: (title: string) => void;
}

export interface UseAiInsightsReturn {
    visible: AiInsight[];
    isLoading: boolean;
    kind: AiInsightKind | "all";
    setKind: (kind: AiInsightKind | "all") => void;
    showReviewed: boolean;
    setShowReviewed: (show: boolean) => void;
    openCount: number;
    reviewedCount: number;
    countByKind: (kind: AiInsightKind | "all") => number;
    accept: (id: string) => void;
    dismiss: (id: string) => void;
    isReviewing: boolean;
}

export interface UseReportLibraryReturn {
    reports: LibraryReport[];
    isLoading: boolean;
    runReport: LibraryReport | null;
    runDatasets: ReportDataset[];
    datasetsLoading: boolean;
    openRun: (report: LibraryReport) => void;
    closeRun: () => void;
    exportRun: (format: ReportExportFormat) => void;
    exportFromCard: (report: LibraryReport, format: ReportExportFormat) => Promise<void>;
}

export interface UseCustomReportBuilderReturn {
    config: ReportBuilderConfig;
    update: <K extends keyof ReportBuilderConfig>(key: K, value: ReportBuilderConfig[K]) => void;
    sources: { id: string; title: string }[];
    dataset: ReportDataset | null;
    isLoadingDataset: boolean;
    errors: ReportFormErrors;
    result: ReportBuilderResult | null;
    chooseSource: (datasetId: string) => void;
    toggleField: (key: string) => void;
    moveField: (key: string, dir: -1 | 1) => void;
    reset: () => void;
    templates: ReportTemplate[];
    loadTemplate: (template: ReportTemplate) => void;
    deleteTemplate: (id: string) => void;
    saveOpen: boolean;
    setSaveOpen: (open: boolean) => void;
    saveTemplate: (name: string) => void;
    isSaving: boolean;
    exportPreview: (format: ReportExportFormat) => void;
}

