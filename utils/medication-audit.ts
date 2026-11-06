import type {
  AuditSummary, HistoryDose, InteractionRule, InteractionWarning, MedAlert, Medication, MedicationPatient, PrnRecord,
  ControlledStock, ReasonCode, RoundRow,
} from "types";
import { getPrnFollowUpState, getStockDiscrepancy, getDrugLabel, isRecentlyChanged, getMinutesOverdue } from "./medication";
import { REASON_LABEL } from "./medication-display";

const GIVEN = ["administered", "self-administered"];
const round1 = (n: number) => Math.round(n * 10) / 10;

export function buildAuditSummary(history: HistoryDose[]): AuditSummary {
  const count = (s: string) => history.filter((h) => h.status === s).length;
  const administered = history.filter((h) => GIVEN.includes(h.status)).length;
  return {
    scheduled: history.length, administered, refused: count("refused"), omitted: count("omitted"),
    notAvailable: count("not-available"), gaps: count("gap"), rate: history.length ? round1((administered / history.length) * 100) : 0,
  };
}

export function buildDailyRates(history: HistoryDose[]): { day: string; rate: number }[] {
  const byDay = new Map<string, { label: string; total: number; given: number }>();
  for (const h of history) {
    const key = `${h.scheduledAt.getFullYear()}-${h.scheduledAt.getMonth()}-${h.scheduledAt.getDate()}`;
    const e = byDay.get(key) ?? { label: h.scheduledAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), total: 0, given: 0 };
    e.total += 1;
    if (GIVEN.includes(h.status)) e.given += 1;
    byDay.set(key, e);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => new Date(a.split("-").map(Number)[0], a.split("-").map(Number)[1], a.split("-").map(Number)[2]).getTime()
      - new Date(b.split("-").map(Number)[0], b.split("-").map(Number)[1], b.split("-").map(Number)[2]).getTime())
    .map(([, e]) => ({ day: e.label, rate: round1((e.given / e.total) * 100) }));
}

export function buildOmissionReasons(history: HistoryDose[]): { reason: ReasonCode; label: string; count: number }[] {
  const counts = new Map<ReasonCode, number>();
  for (const h of history) {
    if (h.reasonCode && !GIVEN.includes(h.status)) counts.set(h.reasonCode, (counts.get(h.reasonCode) ?? 0) + 1);
  }
  return [...counts.entries()].map(([reason, count]) => ({ reason, label: REASON_LABEL[reason], count })).sort((a, b) => b.count - a.count);
}

export interface RefusalPattern { key: string; patientName: string; drug: string; refusals: number; lastRefusal: Date }

/** Medications refused two or more times — repeated refusal can signal side effects or capacity issues. */
export function buildRefusalPatterns(history: HistoryDose[], meds: Medication[], patients: MedicationPatient[]): RefusalPattern[] {
  const medById = new Map(meds.map((m) => [m.id, m]));
  const patientById = new Map(patients.map((p) => [p.id, p]));
  const groups = new Map<string, HistoryDose[]>();
  for (const h of history) if (h.status === "refused") groups.set(h.medicationId, [...(groups.get(h.medicationId) ?? []), h]);
  const out: RefusalPattern[] = [];
  for (const [medId, list] of groups) {
    const m = medById.get(medId);
    if (!m || list.length < 2) continue;
    out.push({
      key: medId, patientName: patientById.get(m.patientId)?.name ?? "Unknown", drug: getDrugLabel(m), refusals: list.length,
      lastRefusal: list.reduce((a, b) => (b.scheduledAt > a ? b.scheduledAt : a), list[0].scheduledAt),
    });
  }
  return out.sort((a, b) => b.refusals - a.refusals);
}

export interface AuditGap { key: string; when: Date; patientName: string; drug: string }

/** Unexplained gaps: a scheduled dose with nothing recorded (flagged by the AI compliance monitor). */
export function findGaps(history: HistoryDose[], meds: Medication[], patients: MedicationPatient[], limit = 8): AuditGap[] {
  const medById = new Map(meds.map((m) => [m.id, m]));
  const patientById = new Map(patients.map((p) => [p.id, p]));
  return history
    .filter((h) => h.status === "gap")
    .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime())
    .slice(0, limit)
    .map((h) => {
      const m = medById.get(h.medicationId);
      return { key: `${h.medicationId}-${h.scheduledAt.getTime()}`, when: h.scheduledAt, patientName: patientById.get(h.patientId)?.name ?? "Unknown", drug: m ? getDrugLabel(m) : "Unknown" };
    });
}

// ---- Interaction / allergy checks (stand-in for NHS dm+d) ----

const has = (name: string, keyword: string) => name.toLowerCase().includes(keyword.toLowerCase());

export function checkInteractions(
  drugName: string, existing: Medication[], allergies: string[], rules: InteractionRule[], allergyAliases: Record<string, string[]>,
): InteractionWarning[] {
  const out: InteractionWarning[] = [];
  const drug = drugName.trim();
  if (drug.length < 3) return out;
  for (const e of existing.filter((m) => m.active)) {
    for (const r of rules) {
      if ((has(drug, r.a) && has(e.drugName, r.b)) || (has(drug, r.b) && has(e.drugName, r.a))) {
        out.push({ kind: "interaction", severity: r.severity, message: r.message, with: e.drugName });
      }
    }
  }
  for (const allergy of allergies) {
    const names = [allergy, ...(allergyAliases[allergy.toLowerCase()] ?? [])];
    if (names.some((a) => has(drug, a))) out.push({ kind: "allergy", severity: "major", message: `Patient is allergic to ${allergy}` });
  }
  return out;
}

// ---- Alerts (derived, so they update the moment a dose is recorded) ----

export interface MedAlertInput {
  rows: RoundRow[]; history: HistoryDose[]; medications: Medication[]; patients: MedicationPatient[];
  prn: PrnRecord[]; stock: ControlledStock[]; rules: InteractionRule[]; now: Date;
}

const SEVERITY_ORDER = { urgent: 0, warning: 1, info: 2 } as const;

export function buildMedicationAlerts(i: MedAlertInput): MedAlert[] {
  const patientName = new Map(i.patients.map((p) => [p.id, p.name]));
  const medById = new Map(i.medications.map((m) => [m.id, m]));
  const alerts: MedAlert[] = [];

  // 1. Missed dose: nothing recorded 30 minutes after the due time (carer nudge + coordinator alert)
  for (const r of i.rows.filter((x) => x.state === "missed")) {
    const mins = getMinutesOverdue(r.dose, i.now);
    alerts.push({
      id: `missed-${r.dose.id}`, kind: "missed-dose", severity: mins > 60 ? "urgent" : "warning", patientId: r.patient.id, targetTab: "round",
      title: `Missed dose: ${getDrugLabel(r.medication)}`,
      description: `${r.patient.name} · due ${r.dose.scheduledAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · ${mins} min overdue`,
    });
  }

  // 2. Omission escalation: 3+ refusals/omissions in a week -> manager
  const weekAgo = i.now.getTime() - 7 * 86400000;
  const exceptions = new Map<string, number>();
  const bump = (patientId: string) => exceptions.set(patientId, (exceptions.get(patientId) ?? 0) + 1);
  i.history.filter((h) => (h.status === "refused" || h.status === "omitted") && h.scheduledAt.getTime() >= weekAgo).forEach((h) => bump(h.patientId));
  i.rows.filter((r) => r.state === "refused" || r.state === "omitted").forEach((r) => bump(r.patient.id));
  for (const [patientId, n] of exceptions) {
    if (n >= 3) {
      alerts.push({
        id: `omit-${patientId}`, kind: "omission-escalation", severity: "urgent", patientId, targetTab: "audit",
        title: `${n} refused or omitted doses this week`,
        description: `${patientName.get(patientId) ?? "Patient"} · 3 or more in a week is escalated to the registered manager`,
      });
    }
  }

  // 3. Interactions on current regimes
  for (const p of i.patients) {
    const meds = i.medications.filter((m) => m.patientId === p.id && m.active);
    meds.forEach((a, ai) => meds.slice(ai + 1).forEach((b) => {
      for (const r of i.rules) {
        if ((has(a.drugName, r.a) && has(b.drugName, r.b)) || (has(a.drugName, r.b) && has(b.drugName, r.a))) {
          alerts.push({
            id: `int-${a.id}-${b.id}`, kind: "interaction", severity: r.severity === "major" ? "urgent" : "warning", patientId: p.id, targetTab: "profiles",
            title: `Interaction: ${a.drugName} + ${b.drugName}`, description: `${p.name} · ${r.message}`,
          });
        }
      }
    }));
  }

  // 4. Recent medication changes (highlighted for carers)
  for (const m of i.medications.filter((x) => x.active && isRecentlyChanged(x, i.now))) {
    alerts.push({
      id: `change-${m.id}`, kind: "medication-change", severity: "info", patientId: m.patientId, targetTab: "profiles",
      title: `Medication changed: ${m.drugName}`, description: `${patientName.get(m.patientId) ?? "Patient"} · ${m.changeNote ?? "Details updated"}`,
    });
  }

  // 5. PRN effectiveness checks
  for (const rec of i.prn) {
    const state = getPrnFollowUpState(rec, i.now);
    const m = medById.get(rec.medicationId);
    if ((state === "due" || state === "overdue") && m) {
      alerts.push({
        id: `prn-${rec.id}`, kind: "prn-followup", severity: state === "overdue" ? "warning" : "info", patientId: rec.patientId, targetTab: "prn",
        title: `PRN follow-up ${state === "overdue" ? "overdue" : "due"}: ${m.drugName}`,
        description: `${patientName.get(rec.patientId) ?? "Patient"} · given for ${rec.reason.toLowerCase()} — record how effective it was`,
      });
    }
  }

  // 6. Controlled drug discrepancies
  for (const s of i.stock) {
    const diff = getStockDiscrepancy(s);
    const m = medById.get(s.medicationId);
    if (diff !== 0 && m) {
      alerts.push({
        id: `stock-${s.medicationId}`, kind: "stock-discrepancy", severity: "urgent", patientId: m.patientId, targetTab: "controlled",
        title: `Controlled drug discrepancy: ${m.drugName}`, description: `Recorded ${s.balance}, counted ${s.lastPhysicalCount} ${s.unit} — investigate and reconcile`,
      });
    }
  }

  return alerts.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

export interface RegimeInteraction { key: string; a: Medication; b: Medication; warning: InteractionWarning }

/** Interactions between medications a patient is already prescribed (shown on the profile card). */
export function findRegimeInteractions(meds: Medication[], rules: InteractionRule[]): RegimeInteraction[] {
  const active = meds.filter((m) => m.active);
  const out: RegimeInteraction[] = [];
  active.forEach((a, i) => active.slice(i + 1).forEach((b) => {
    checkInteractions(a.drugName, [b], [], rules, {}).forEach((warning, w) => out.push({ key: `${a.id}-${b.id}-${w}`, a, b, warning }));
  }));
  return out;
}
