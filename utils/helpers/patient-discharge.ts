import type {
  DischargeContacts,
  DischargeFormState,
  DischargePayload,
  Patient,
} from "types";
import { getPatientsToday } from "./patients";

export const DISCHARGE_REASON_VALUES = [
  "recovered",
  "deceased",
  "moved-out-of-area",
  "moved-to-care-home",
  "hospital-admission-permanent",
  "self-funding-withdrawn",
  "family-request",
  "other",
] as const;

export type DischargeReason = (typeof DISCHARGE_REASON_VALUES)[number];

export const DISCHARGE_REASON_LABELS: Record<DischargeReason, string> = {
  recovered: "Recovered / no longer needs care",
  deceased: "Deceased",
  "moved-out-of-area": "Moved out of area",
  "moved-to-care-home": "Moved to residential care home",
  "hospital-admission-permanent": "Permanent hospital admission",
  "self-funding-withdrawn": "Self-funding withdrawn",
  "family-request": "Family request",
  other: "Other",
};

export const DISCHARGE_FINAL_VISIT_FIELDS = [
  { field: "finalVisitDate", type: "date", label: "Visit date" },
  { field: "finalVisitTime", type: "time", label: "Visit time" },
] as const;

export const DISCHARGE_NOTIFY_OPTIONS = [
  { field: "notifyGp", label: "GP", contact: "gpName", emptyText: "(no GP on file)" },
  { field: "notifyNextOfKin", label: "Next of kin", contact: "nextOfKinName", emptyText: "(none on file)" },
  {
    field: "notifyEmergencyContact",
    label: "Emergency contact",
    contact: "emergencyContact",
    emptyText: "(none on file)",
  },
] as const;

export type DischargeNotifyOption = (typeof DISCHARGE_NOTIFY_OPTIONS)[number];

export function getDischargeNotifyLabel(
  option: DischargeNotifyOption,
  contacts: DischargeContacts
): string {
  const name = contacts[option.contact];
  return `${option.label} ${name ? `(${name})` : option.emptyText}`;
}

export const todayISO = () => getPatientsToday();

export function getInitialDischargeForm(contacts: DischargeContacts): DischargeFormState {
  return {
    reason: "recovered",
    notes: "",
    dischargeDate: todayISO(),
    scheduleFinalVisit: false,
    finalVisitDate: "",
    finalVisitTime: "",
    notifyGp: !!contacts.gpName,
    notifyNextOfKin: !!contacts.nextOfKinName,
    notifyEmergencyContact: !!contacts.emergencyContact,
    otherNotifications: "",
  };
}

export function buildDischargePayload(
  form: DischargeFormState,
  contacts: DischargeContacts
): DischargePayload {
  const { finalVisitDate, finalVisitTime, ...rest } = form;
  return {
    ...rest,
    notifyGp: form.notifyGp && !!contacts.gpName,
    notifyNextOfKin: form.notifyNextOfKin && !!contacts.nextOfKinName,
    notifyEmergencyContact: form.notifyEmergencyContact && !!contacts.emergencyContact,
    finalVisitDate: form.scheduleFinalVisit ? finalVisitDate : undefined,
    finalVisitTime: form.scheduleFinalVisit ? finalVisitTime : undefined,
  };
}

export function applyDischarge(patient: Patient, payload: DischargePayload): Patient {
  return {
    ...patient,
    status: "discharged",
    nextVisit: null,
    carePlanReviewDate: null,
    dischargeDetails: payload,
  };
}