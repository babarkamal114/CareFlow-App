import type { Patient, PatientStats, PatientTab } from 'types';
import { PATIENTS_MOCK_TODAY } from 'lib';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Single place that says what "today" is for the Patients page. */
export const getPatientsToday = (): string => PATIENTS_MOCK_TODAY;

const toDayNumber = (iso: string): number => {
  const [year = 0, month = 1, day = 1] = iso.slice(0, 10).split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
};

/** Whole days from `today` to `iso` (negative when `iso` is in the past). */
export const daysFromToday = (iso: string, today = getPatientsToday()): number =>
  toDayNumber(iso) - toDayNumber(today);

/** Care plan review is due within 7 days, or already overdue (blueprint §3.1.2). */
export function isReviewDue(patient: Patient, today = getPatientsToday()): boolean {
  if (patient.status === 'discharged' || !patient.carePlanReviewDate) return false;
  return daysFromToday(patient.carePlanReviewDate, today) <= 7;
}

export function isNewThisMonth(patient: Patient, today = getPatientsToday()): boolean {
  return patient.admissionDate.slice(0, 7) === today.slice(0, 7);
}

const TAB_MATCHERS: Record<PatientTab, (p: Patient, today: string) => boolean> = {
  all: () => true,
  active: (p) => p.status === 'active',
  'on-hold': (p) => p.status === 'on-hold',
  new: (p) => p.status === 'new',
  'high-risk': (p) => p.risk === 'high' && p.status !== 'discharged',
  'review-date': (p, today) => isReviewDue(p, today),
};

function matchesSearch(patient: Patient, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [patient.name, patient.email, patient.carer, patient.address, patient.nhsNumber ?? '']
    .some((value) => value.toLowerCase().includes(q));
}

export function filterPatientsByTab(
  patients: Patient[],
  tab: PatientTab,
  search: string,
  today = getPatientsToday()
): Patient[] {
  return patients.filter((p) => TAB_MATCHERS[tab](p, today) && matchesSearch(p, search));
}

export function getPatientTabCounts(
  patients: Patient[],
  today = getPatientsToday()
): Record<PatientTab, number> {
  return {
    all: patients.length,
    active: patients.filter((p) => TAB_MATCHERS.active(p, today)).length,
    'on-hold': patients.filter((p) => TAB_MATCHERS['on-hold'](p, today)).length,
    'high-risk': patients.filter((p) => TAB_MATCHERS['high-risk'](p, today)).length,
    'review-date': patients.filter((p) => TAB_MATCHERS['review-date'](p, today)).length,
    new: patients.filter((p) => TAB_MATCHERS.new(p, today)).length,
  };
}

/** Numbers for the stat cards, always derived from the list so they match the table. */
export function getPatientStats(patients: Patient[], today = getPatientsToday()): PatientStats {
  const current = patients.filter((p) => p.status !== 'discharged');
  return {
    totalPatients: current.length,
    activePatients: current.filter((p) => p.status === 'active').length,
    newThisMonth: current.filter((p) => isNewThisMonth(p, today)).length,
    highRiskPatients: current.filter((p) => p.risk === 'high').length,
    reviewsDue: current.filter((p) => isReviewDue(p, today)).length,
  };
}

const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

/** "Today, 2:00 pm", "Tomorrow, 10:30 am", "26 Oct, 3:00 pm". */
export function formatNextVisit(iso: string | null, today = getPatientsToday()): string {
  if (!iso) return 'No visit scheduled';
  const date = new Date(iso);
  const time = timeFormat.format(date);
  const diff = daysFromToday(iso, today);
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Tomorrow, ${time}`;
  return `${dayFormat.format(date)}, ${time}`;
}

/** "In 3 days", "Today", "2 days overdue". */
export function formatReviewDue(iso: string | null, today = getPatientsToday()): string {
  if (!iso) return '-';
  const diff = daysFromToday(iso, today);
  if (diff === 0) return 'Today';
  if (diff > 0) return `In ${diff} day${diff === 1 ? '' : 's'}`;
  return `${Math.abs(diff)} day${diff === -1 ? '' : 's'} overdue`;
}