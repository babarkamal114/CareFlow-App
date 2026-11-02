import type { AdministrationRecord, HistoryDose, Medication, ReasonCode, ScheduledDose } from "types";
import { pick, rand, startOfDay } from "../utils/medication";
import { MEDICATION_MOCK_NOW, medMockAt } from "./medication-mock";

// ---- Today's round ----
const GRACE_MIN = 30;
type Override = { status?: AdministrationRecord["status"]; reasonCode?: ReasonCode; note?: string; leaveUnrecorded?: boolean };
const TODAY_OVERRIDES: Record<string, Override> = {
  "med-16|08:00": { leaveUnrecorded: true },
  "med-18|08:00": { leaveUnrecorded: true },
  "med-3|08:00": { status: "refused", reasonCode: "nausea", note: "Says it upsets her stomach" },
  "med-9|08:00": { status: "omitted", reasonCode: "gp-instruction", note: "BP low this morning — GP advised to hold" },
};

const isActiveToday = (m: Medication) =>
  m.active && m.type !== "prn" && startOfDay(m.startDate) <= startOfDay(MEDICATION_MOCK_NOW) &&
  (!m.endDate || startOfDay(m.endDate) >= startOfDay(MEDICATION_MOCK_NOW));

/** Unrecorded doses for one medication today (used when a medication is added or edited). */
export function buildDosesForMedication(m: Medication): ScheduledDose[] {
  if (!isActiveToday(m)) return [];
  return m.times.map((time) => ({
    id: `dose-${m.id}-${time.replace(":", "")}`, medicationId: m.id, patientId: m.patientId, scheduledAt: medMockAt(0, time), record: null,
  }));
}

export function buildTodayDoses(meds: Medication[]): ScheduledDose[] {
  const doses: ScheduledDose[] = [];
  for (const m of meds) {
    for (const dose of buildDosesForMedication(m)) {
      const time = dose.scheduledAt.toTimeString().slice(0, 5);
      const o = TODAY_OVERRIDES[`${m.id}|${time}`];
      const minutesAgo = (MEDICATION_MOCK_NOW.getTime() - dose.scheduledAt.getTime()) / 60000;
      if (minutesAgo > GRACE_MIN && !o?.leaveUnrecorded) {
        const status = o?.status ?? "administered";
        dose.record = {
          status, reasonCode: o?.reasonCode, note: o?.note, recordedBy: "Sarah W.", recordedAt: new Date(dose.scheduledAt.getTime() + 8 * 60000),
          doseGiven: status === "administered" && m.type === "variable-dose" ? (m.drugName === "Warfarin" ? "3mg" : "6 units") : undefined,
          witness: m.type === "controlled" && status === "administered" ? "Priya P." : undefined, barcodeVerified: true,
        };
      }
      doses.push(dose);
    }
  }
  return doses.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

// ---- 30 days of history (for the audit) ----
// Yesterday evening: four doses with nothing recorded (matches the "4 missing MAR entries" compliance alert).
const FORCED_GAPS = new Set(["med-3|1|18:00", "med-13|1|20:00", "med-17|1|20:00", "med-8|1|12:00"]);

export function buildHistory(meds: Medication[]): HistoryDose[] {
  const out: HistoryDose[] = [];
  let i = 0;
  for (let day = 1; day <= 30; day++) {
    for (const m of meds) {
      if (m.type === "prn" || !m.active) continue;
      for (const time of m.times) {
        i += 1;
        const at = medMockAt(day, time);
        if (startOfDay(at) < startOfDay(m.startDate)) continue;
        const base = { medicationId: m.id, patientId: m.patientId, scheduledAt: at };
        const key = `${m.id}|${day}|${time}`;
        const r = rand(i * 7 + day * 13);
        if (FORCED_GAPS.has(key)) out.push({ ...base, status: "gap" });
        else if (m.id === "med-3" && time === "18:00" && [2, 3, 5, 6].includes(day)) out.push({ ...base, status: "refused", reasonCode: "nausea" });
        else if (r < 0.012 && day !== 1) out.push({ ...base, status: "gap" });
        else if (r < 0.03) out.push({ ...base, status: "omitted", reasonCode: pick<ReasonCode>(["patient-asleep", "no-stock", "clinical-judgement"], r) });
        else if (r < 0.05) out.push({ ...base, status: "refused", reasonCode: pick<ReasonCode>(["nausea", "patient-unwell", "other"], r) });
        else if (r < 0.055) out.push({ ...base, status: "not-available", reasonCode: "no-stock" });
        else out.push({ ...base, status: "administered" });
      }
    }
  }
  return out;
}
