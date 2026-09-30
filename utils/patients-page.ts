import {
  Calendar,
  Edit,
  FileText,
  Pill,
  AlertTriangle,
  BarChart3,
  Archive,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import type { PatientTab } from './patients';

export const PATIENT_TAB_DEFS: { id: PatientTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'on-hold', label: 'On Hold' },
  { id: 'high-risk', label: 'High Risk' },
  { id: 'review-date', label: 'Review Date' },
  { id: 'new', label: 'New' },
];

const PATIENT_STAT_GRID_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export function getPatientStatGridClass(visibleCount: number): string {
  return `grid grid-cols-1 sm:grid-cols-2 ${PATIENT_STAT_GRID_COLS[Math.min(visibleCount, 4)]} gap-4`;
}

const PATIENTS_TABLE_HEAD_CLASS = 'text-cf-ink-60 font-medium text-xs';

export const PATIENTS_TABLE_COLUMNS = [
  { key: 'patient', label: 'Patient', className: PATIENTS_TABLE_HEAD_CLASS },
  { key: 'age', label: 'Age', className: PATIENTS_TABLE_HEAD_CLASS },
  { key: 'risk', label: 'Risk', className: PATIENTS_TABLE_HEAD_CLASS },
  { key: 'status', label: 'Status', className: PATIENTS_TABLE_HEAD_CLASS },
  { key: 'carer', label: 'Carer', className: PATIENTS_TABLE_HEAD_CLASS },
  { key: 'nextVisit', label: 'Next Visit', className: PATIENTS_TABLE_HEAD_CLASS },
  { key: 'actions', label: '', className: 'w-8' },
];

export const PATIENTS_TABLE_SKELETON_ROWS = 5;

export const PATIENTS_TABLE_SKELETON_CELLS = [
  'h-3 w-6 rounded',
  'h-5 w-16 rounded-full',
  'h-5 w-16 rounded-full',
  'h-3 w-20 rounded',
  'h-3 w-24 rounded',
];

export interface PatientDrawerFooterHandlers {
  onScheduleVisit?: () => void;
  onEdit?: () => void;
  onCarePlan?: () => void;
  onMedication?: () => void;
  onAddDocument?: () => void;
  onRiskAssessment?: () => void;
  onGenerateReport?: () => void;
  onArchive?: () => void;
  onDischarge?: () => void;
}

type FooterHandlerKey = keyof PatientDrawerFooterHandlers;

export const PATIENT_DRAWER_FOOTER_ACTIONS: {
  handler: FooterHandlerKey;
  label: string;
  Icon: LucideIcon;
  variant: 'default' | 'outline';
}[] = [
  { handler: 'onScheduleVisit', label: 'Schedule', Icon: Calendar, variant: 'default' },
  { handler: 'onEdit', label: 'Edit', Icon: Edit, variant: 'outline' },
  { handler: 'onCarePlan', label: 'Add Care Plan', Icon: FileText, variant: 'outline' },
  { handler: 'onMedication', label: 'Update Medication', Icon: Pill, variant: 'outline' },
];

export const PATIENT_DRAWER_FOOTER_MENU_ACTIONS: {
  handler: FooterHandlerKey;
  label: string;
  Icon: LucideIcon;
  className: string;
}[] = [
  { handler: 'onAddDocument', label: 'Add Document', Icon: FileText, className: 'gap-2' },
  { handler: 'onRiskAssessment', label: 'Risk Assessment', Icon: AlertTriangle, className: 'gap-2' },
  { handler: 'onGenerateReport', label: 'Generate Report', Icon: BarChart3, className: 'gap-2' },
  { handler: 'onArchive', label: 'Archive Patient', Icon: Archive, className: 'gap-2 text-cf-error' },
];

export const PATIENT_DRAWER_FOOTER_DISCHARGE_ACTION = {
  handler: 'onDischarge' as FooterHandlerKey,
  label: 'Discharge Patient',
  Icon: LogOut,
  className:
    'gap-2 text-[var(--cf-error)] focus:text-[var(--cf-error)] focus:bg-[var(--cf-error-muted)]',
};