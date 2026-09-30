export type DischargeReason =
  | 'recovered'
  | 'deceased'
  | 'moved-out-of-area'
  | 'moved-to-care-home'
  | 'hospital-admission-permanent'
  | 'self-funding-withdrawn'
  | 'family-request'
  | 'other';

export interface DischargePayload {
  reason: DischargeReason;
  notes: string;
  dischargeDate: string;
  scheduleFinalVisit: boolean;
  finalVisitDate?: string | undefined;
  finalVisitTime?: string | undefined;
  notifyGp: boolean;
  notifyNextOfKin: boolean;
  notifyEmergencyContact: boolean;
  otherNotifications: string;
}

export interface DischargeFormState {
  reason: DischargeReason;
  notes: string;
  dischargeDate: string;
  scheduleFinalVisit: boolean;
  finalVisitDate: string;
  finalVisitTime: string;
  notifyGp: boolean;
  notifyNextOfKin: boolean;
  notifyEmergencyContact: boolean;
  otherNotifications: string;
}

export interface DischargeContacts {
  gpName?: string | undefined;
  nextOfKinName?: string | undefined;
  emergencyContact?: string | undefined;
}

export const DISCHARGE_REASON_LABELS: Record<DischargeReason, string> = {
  recovered: 'Recovered / no longer needs care',
  deceased: 'Deceased',
  'moved-out-of-area': 'Moved out of area',
  'moved-to-care-home': 'Moved to residential care home',
  'hospital-admission-permanent': 'Permanent hospital admission',
  'self-funding-withdrawn': 'Self-funding withdrawn',
  'family-request': 'Family request',
  other: 'Other',
};

export const DISCHARGE_REASONS = Object.keys(DISCHARGE_REASON_LABELS) as DischargeReason[];

export const DISCHARGE_FINAL_VISIT_FIELDS = [
  { field: 'finalVisitDate', type: 'date' },
  { field: 'finalVisitTime', type: 'time' },
] as const;

export const DISCHARGE_NOTIFY_OPTIONS = [
  { field: 'notifyGp', label: 'GP', contact: 'gpName', emptyText: '(no GP on file)' },
  { field: 'notifyNextOfKin', label: 'Next of kin', contact: 'nextOfKinName', emptyText: '(none on file)' },
  {
    field: 'notifyEmergencyContact',
    label: 'Emergency contact',
    contact: 'emergencyContact',
    emptyText: '(none on file)',
  },
] as const;

export type DischargeNotifyOption = (typeof DISCHARGE_NOTIFY_OPTIONS)[number];

export function getDischargeNotifyLabel(option: DischargeNotifyOption, contacts: DischargeContacts): string {
  const name = contacts[option.contact];
  return `${option.label} ${name ? `(${name})` : option.emptyText}`;
}

export const todayISO = () => new Date().toLocaleDateString('en-CA');

export function getInitialDischargeForm(contacts: DischargeContacts): DischargeFormState {
  return {
    reason: 'recovered',
    notes: '',
    dischargeDate: todayISO(),
    scheduleFinalVisit: true,
    finalVisitDate: '',
    finalVisitTime: '',
    notifyGp: !!contacts.gpName,
    notifyNextOfKin: !!contacts.nextOfKinName,
    notifyEmergencyContact: !!contacts.emergencyContact,
    otherNotifications: '',
  };
}

export function validateDischargeForm(form: DischargeFormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.dischargeDate) errors.dischargeDate = 'Discharge date is required';
  if (form.scheduleFinalVisit && !form.finalVisitDate) {
    errors.finalVisitDate = 'Pick a date for the final visit, or turn scheduling off';
  }
  if (form.reason === 'other' && !form.notes.trim()) {
    errors.notes = 'Add a reason since "Other" was selected';
  }
  return errors;
}

export function buildDischargePayload(form: DischargeFormState): DischargePayload {
  const { finalVisitDate, finalVisitTime, ...rest } = form;
  return {
    ...rest,
    finalVisitDate: form.scheduleFinalVisit ? finalVisitDate : undefined,
    finalVisitTime: form.scheduleFinalVisit ? finalVisitTime : undefined,
  };
}