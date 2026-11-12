import type { BadgeProps } from '@/components/ui';
import type { Medication } from "types";
import { formatMedDate, isRecentlyChanged } from './medication';
import { FREQUENCY_LABEL, ROUTE_LABEL } from './medication-display';

export const DRAWER_MEDICATION_LIMIT = 5;
const ENDING_SOON_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface MedicationStatus {
  label: string;
  variant: BadgeProps['variant'];
}

export function getMedicationStatus(med: Medication, now: Date): MedicationStatus {
  if (!med.active) return { label: 'Discontinued', variant: 'pastel-info' };
  if (med.endDate) {
    const daysLeft = (med.endDate.getTime() - now.getTime()) / MS_PER_DAY;
    if (daysLeft < 0) return { label: 'Course ended', variant: 'pastel-info' };
    if (daysLeft <= ENDING_SOON_DAYS) return { label: 'Ending soon', variant: 'pastel-warning' };
  }
  if (isRecentlyChanged(med, now)) {
    return { label: med.changeNote === 'New medication added' ? 'New' : 'Changed', variant: 'pastel-warning' };
  }
  return { label: 'Active', variant: 'pastel-success' };
}

export function sortMedicationsForDrawer(meds: Medication[]): Medication[] {
  const rank = (m: Medication) => (!m.active ? 2 : m.type === 'controlled' ? 0 : 1);
  return [...meds].sort((a, b) => rank(a) - rank(b));
}

export function getDrawerMedicationSummary(meds: Medication[]) {
  const sorted = sortMedicationsForDrawer(meds);
  return {
    preview: sorted.slice(0, DRAWER_MEDICATION_LIMIT),
    total: sorted.length,
    hiddenCount: Math.max(0, sorted.length - DRAWER_MEDICATION_LIMIT),
  };
}

export function getMedicationSummaryParts(med: Medication): string[] {
  const schedule =
    med.times.length > 0
      ? `${FREQUENCY_LABEL[med.frequency]} (${med.times.join(', ')})`
      : FREQUENCY_LABEL[med.frequency];
  const prnLimits = [
    med.prnMinIntervalHours !== undefined ? `min ${med.prnMinIntervalHours}h apart` : '',
    med.prnMaxPer24h !== undefined ? `max ${med.prnMaxPer24h} per 24h` : '',
  ].filter(Boolean);
  return [ROUTE_LABEL[med.route], schedule, ...prnLimits, `for ${med.indication.toLowerCase()}`];
}

export function getMedicationPrescriberParts(med: Medication): string[] {
  return [
    `Prescribed by ${med.prescriber}`,
    `started ${formatMedDate(med.startDate)}`,
    med.endDate ? `ends ${formatMedDate(med.endDate)}` : '',
  ].filter(Boolean);
}