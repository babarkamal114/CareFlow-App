import type { DischargeContacts, DischargeFormState, DischargePayload, DischargeReason, Patient } from 'types';
import { getPatientsToday } from './patients';

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

export const todayISO = () => getPatientsToday();

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

export function buildDischargePayload(form: DischargeFormState): DischargePayload {
  const { finalVisitDate, finalVisitTime, ...rest } = form;
  return {
    ...rest,
    finalVisitDate: form.scheduleFinalVisit ? finalVisitDate : undefined,
    finalVisitTime: form.scheduleFinalVisit ? finalVisitTime : undefined,
  };
}

/** A discharged patient is kept, never deleted (blueprint §12): status changes and visits stop. */
export function applyDischarge(patient: Patient, payload: DischargePayload): Patient {
  return {
    ...patient,
    status: 'discharged',
    nextVisit: null,
    carePlanReviewDate: null,
    dischargeDetails: payload,
  };
}