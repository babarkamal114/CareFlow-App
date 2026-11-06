import type { ReactNode } from "react";
import type { REPORT_TABS } from "config";
import type { useScheduledReports } from "hooks";
import type { AiInsight, LibraryReport, ReportBuilderConfig, ReportChartSpec, ReportColumn, ReportActivity, ReportDataset, ReportDomain, ReportExportFormat, ReportFormErrors, ReportRole, ReportRow, ReportSchedule, ReportScheduleFormData, ReportTemplate } from "./reports";

// ---- Component props (reports UI) ----

export interface AiInsightCardProps {
  insight: AiInsight;
  disabled: boolean;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

export interface BuilderControlsProps {
  dataset: ReportDataset;
  config: ReportBuilderConfig;
  errors: ReportFormErrors;
  onChange: <K extends keyof ReportBuilderConfig>(key: K, value: ReportBuilderConfig[K]) => void;
}

export interface BuilderFieldPickerProps {
  columns: ReportColumn[];
  fields: string[];
  error?: string;
  onToggle: (key: string) => void;
  onMove: (key: string, dir: -1 | 1) => void;
}

export interface ReportActivityListProps {
  activity: ReportActivity[];
}

export interface ReportChartProps {
  columns: ReportColumn[];
  rows: ReportRow[];
  chart: ReportChartSpec;
}

export interface ReportConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ReportDatasetViewProps {
  columns: ReportColumn[];
  rows: ReportRow[];
  chart: ReportChartSpec;
  mode: "chart" | "table" | "both";
}

export interface ReportExportMenuProps {
  onSelect: (format: ReportExportFormat) => void;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
}

export interface ReportFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export interface ReportLibraryCardProps {
  report: LibraryReport;
  onRun: (r: LibraryReport) => void;
  onSchedule: (reportId: string) => void;
  onExport: (r: LibraryReport, f: ReportExportFormat) => void;
}

export interface ReportPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

export interface ReportRunDialogProps {
  report: LibraryReport | null;
  datasets: ReportDataset[];
  isLoading: boolean;
  onClose: () => void;
  onExport: (f: ReportExportFormat) => void;
  onSchedule: (reportId: string) => void;
}

export interface ReportScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reports: LibraryReport[];
  initialReportId: string | null;
  schedule: ReportSchedule | null;
  now: Date;
  isSaving: boolean;
  onSubmit: (data: ReportScheduleFormData) => void;
}

export interface ReportSelectProps<T extends string> {
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ReportTableProps {
  columns: ReportColumn[];
  rows: ReportRow[];
  maxHeight?: string;
}

export interface ReportTemplateListProps {
  templates: ReportTemplate[];
  onLoad: (t: ReportTemplate) => void;
  onDelete: (id: string) => void;
}

export interface ReportWidgetProps {
  dataset: ReportDataset | undefined;
  isLoading: boolean;
  onExport: (format: ReportExportFormat, dataset: ReportDataset) => void;
}

export interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onSubmit: (name: string) => void;
}

export interface ScheduledReportsTableProps {
  schedules: ReportSchedule[];
  reportTitle: (id: string) => string;
  onEdit: (s: ReportSchedule) => void;
  onToggle: (s: ReportSchedule) => void;
  onDelete: (s: ReportSchedule) => void;
}

export interface ReportRoleSelectProps {
  role: ReportRole;
  onChange: (role: ReportRole) => void;
}

// ---- Component props (reports sections) ----

export interface ReportsBuilderSectionProps {
  role: ReportRole;
}

export interface ReportsDashboardSectionProps {
  role: ReportRole;
  tabs: typeof REPORT_TABS;
}

export interface ReportsDomainPanelProps {
  domain: ReportDomain;
  role: ReportRole;
}

export interface ReportsHeaderSectionProps {
  role: ReportRole;
  onRoleChange: (role: ReportRole) => void;
  onSchedule: () => void;
}

export interface ReportsLibrarySectionProps {
  role: ReportRole;
  onSchedule: (reportId: string) => void;
}

export interface ReportsScheduledSectionProps {
  scheduled: ReturnType<typeof useScheduledReports>;
  schedules: ReportSchedule[];
}

export interface ReportsSectionHeadingProps {
  title: string;
  description: string;
  action?: ReactNode;
}
