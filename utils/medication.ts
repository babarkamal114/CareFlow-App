import type {
  ControlledStock, DoseState, Medication, MedicationPatient, PrnFollowUpState, PrnRecord, RoundFilters, RoundRow, ScheduledDose,
} from "types";

export const DOSE_GRACE_MINUTES = 30;
export const MED_RECENT_CHANGE_DAYS = 7;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayDiff = (a: Date, b: Date) => Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
const minutesBetween = (later: Date, earlier: Date) => Math.floor((later.getTime() - earlier.getTime()) / 60000);

export const formatMedTime = (d: Date): string => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

/** "Today 12:10", "Yesterday 15:10", otherwise "17 Oct 15:10". */
export function formatMedDateTime(d: Date, now: Date): string {
  const diff = dayDiff(now, d);
  if (diff === 0) return `Today ${formatMedTime(d)}`;
  if (diff === 1) return `Yesterday ${formatMedTime(d)}`;
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${formatMedTime(d)}`;
}

export const formatMedDate = (d: Date): string =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const getDrugLabel = (m: Medication): string => `${m.drugName} ${m.strength}`;

// ---- Round ----

export function getDoseState(dose: ScheduledDose, now: Date): DoseState {
  if (dose.record) return dose.record.status;
  const late = minutesBetween(now, dose.scheduledAt);
  if (late > DOSE_GRACE_MINUTES) return "missed";
  if (late >= 0) return "due";
  return "upcoming";
}

export const getMinutesOverdue = (dose: ScheduledDose, now: Date): number =>
  Math.max(0, minutesBetween(now, dose.scheduledAt));

export function buildRoundRows(doses: ScheduledDose[], meds: Medication[], patients: MedicationPatient[], now: Date): RoundRow[] {
  const medById = new Map(meds.map((m) => [m.id, m]));
  const patientById = new Map(patients.map((p) => [p.id, p]));
  const rows: RoundRow[] = [];
  for (const dose of doses) {
    const medication = medById.get(dose.medicationId);
    const patient = patientById.get(dose.patientId);
    if (!medication || !patient || !medication.active) continue;
    rows.push({ dose, medication, patient, state: getDoseState(dose, now) });
  }
  return rows.sort((a, b) => a.dose.scheduledAt.getTime() - b.dose.scheduledAt.getTime() || a.patient.name.localeCompare(b.patient.name));
}

export function summarizeRound(rows: RoundRow[]) {
  const count = (states: DoseState[]) => rows.filter((r) => states.includes(r.state)).length;
  return {
    total: rows.length,
    administered: count(["administered", "self-administered"]),
    due: count(["due"]),
    missed: count(["missed"]),
    upcoming: count(["upcoming"]),
    exceptions: count(["refused", "omitted", "not-available"]),
  };
}

const DONE_STATES: DoseState[] = ["administered", "self-administered", "refused", "omitted", "not-available"];

export function filterRoundRows(rows: RoundRow[], f: RoundFilters): RoundRow[] {
  const q = f.search.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.patientId !== "all" && r.patient.id !== f.patientId) return false;
    if (f.status === "attention" && r.state !== "due" && r.state !== "missed") return false;
    if (f.status === "upcoming" && r.state !== "upcoming") return false;
    if (f.status === "done" && !DONE_STATES.includes(r.state)) return false;
    return !q || r.patient.name.toLowerCase().includes(q) || r.medication.drugName.toLowerCase().includes(q);
  });
}

/** A GP change or new medication is highlighted for 7 days so carers notice it at the next visit. */
export const isRecentlyChanged = (m: Medication, now: Date): boolean =>
  !!m.changedAt && dayDiff(now, m.changedAt) <= MED_RECENT_CHANGE_DAYS && dayDiff(now, m.changedAt) >= 0;

// ---- PRN protocol ----

/** Follow-up check is due 30-60 minutes after the dose (Blueprint 3.1.4). */
export function getPrnFollowUpState(rec: PrnRecord, now: Date): PrnFollowUpState {
  if (rec.followUp) return "done";
  const mins = minutesBetween(now, rec.administeredAt);
  if (mins < 30) return "waiting";
  return mins <= 60 ? "due" : "overdue";
}

export function getPrnUsage(records: PrnRecord[], medicationId: string, now: Date) {
  const mine = records.filter((r) => r.medicationId === medicationId).sort((a, b) => b.administeredAt.getTime() - a.administeredAt.getTime());
  const dayAgo = now.getTime() - 24 * 3600000;
  return {
    lastAdministeredAt: mine[0]?.administeredAt ?? null,
    countLast24h: mine.filter((r) => r.administeredAt.getTime() >= dayAgo).length,
  };
}

// ---- Controlled drugs ----

/** Recorded balance minus the last physical count. 0 = reconciled. */
export const getStockDiscrepancy = (s: ControlledStock): number => s.balance - s.lastPhysicalCount;

// ---- Profiles ----

export function groupMedicationsByPatient(meds: Medication[], patients: MedicationPatient[], search: string) {
  const q = search.trim().toLowerCase();
  return patients
    .map((patient) => ({
      patient,
      medications: meds.filter((m) => m.patientId === patient.id && m.active && (!q || m.drugName.toLowerCase().includes(q) || patient.name.toLowerCase().includes(q))),
    }))
    .filter((g) => g.medications.length > 0);
}
