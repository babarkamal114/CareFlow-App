import type {
  AdministrationRecord, AuditReport, ControlledEntry, ControlledStock, HistoryDose, Medication, MedicationPatient,
  PrnRecord, ReasonCode, ScheduledDose,
} from "types";

export const MEDICATION_MOCK_NOW = new Date(2026, 9, 19, 12, 20);
export const MEDICATION_CURRENT_USER = "Emma C.";

export const medMockAt = (daysAgo: number, hhmm: string): Date => {
  const d = new Date(MEDICATION_MOCK_NOW);
  d.setDate(d.getDate() - daysAgo);
  const [h, m] = hhmm.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const mockMedicationPatients: MedicationPatient[] = [
  { id: "p-1", name: "Margaret Johnson", initials: "MJ", allergies: ["Penicillin"] },
  { id: "p-2", name: "Robert Ahmed", initials: "RA", allergies: [] },
  { id: "p-3", name: "Edna Morris", initials: "EM", allergies: ["Aspirin"] },
  { id: "p-4", name: "Dorothy Chen", initials: "DC", allergies: ["Sulfonamides"] },
  { id: "p-5", name: "Henry Smith", initials: "HS", allergies: [] },
  { id: "p-6", name: "Arthur Wilson", initials: "AW", allergies: ["Latex"] },
  { id: "p-7", name: "Barbara Williams", initials: "BW", allergies: [] },
  { id: "p-8", name: "Patricia Smith", initials: "PS", allergies: ["Codeine"] },
];

let n = 0;
function med(
  patientId: string, drugName: string, strength: string, route: Medication["route"], type: Medication["type"],
  frequency: Medication["frequency"], times: string[], prescriber: string, indication: string, extra: Partial<Medication> = {},
): Medication {
  n += 1;
  return {
    id: `med-${n}`, patientId, drugName, strength, route, type, frequency, times, prescriber, indication,
    startDate: new Date(2026, 0, 12), barcode: `501234${String(n).padStart(7, "0")}`, active: true, ...extra,
  };
}

export const mockMedications: Medication[] = [
  med("p-1", "Levothyroxine", "75mcg", "oral", "regular", "once-daily", ["08:00"], "Dr Patel", "Underactive thyroid", { instructions: "Give 30 minutes before breakfast" }),
  med("p-1", "Co-codamol", "30/500mg", "oral", "prn", "as-required", [], "Dr Patel", "Hip pain", { prnMinIntervalHours: 4, prnMaxPer24h: 4 }),
  med("p-2", "Metformin", "500mg", "oral", "regular", "twice-daily", ["08:00", "18:00"], "Dr Okafor", "Type 2 diabetes", { instructions: "Give with food" }),
  med("p-2", "Warfarin", "Per INR (1–5mg)", "oral", "variable-dose", "once-daily", ["21:00"], "Anticoagulant clinic", "Atrial fibrillation", { changedAt: medMockAt(3, "10:00"), changeNote: "Dose changed after INR 3.4 — now 3mg" }),
  med("p-2", "Aspirin", "75mg", "oral", "regular", "once-daily", ["08:00"], "Dr Okafor", "Cardiac protection"),
  med("p-2", "Paracetamol", "500mg", "oral", "prn", "as-required", [], "Dr Okafor", "Headache / pain", { prnMinIntervalHours: 4, prnMaxPer24h: 4 }),
  med("p-3", "Oxycodone", "5mg capsules", "oral", "controlled", "twice-daily", ["08:00", "20:00"], "Dr Patel", "Cancer pain", { schedule: "2" }),
  med("p-3", "Lactulose", "15ml", "oral", "regular", "twice-daily", ["08:00", "12:00"], "Dr Patel", "Constipation"),
  med("p-4", "Ramipril", "5mg", "oral", "regular", "once-daily", ["08:00"], "Dr Singh", "Hypertension", { changedAt: medMockAt(2, "09:00"), changeNote: "Dose increased from 2.5mg to 5mg by GP" }),
  med("p-4", "Morphine sulfate MR", "10mg tablets", "oral", "controlled", "twice-daily", ["08:00", "20:00"], "Dr Singh", "Chronic pain", { schedule: "2" }),
  med("p-4", "Trimethoprim", "200mg", "oral", "short-course", "twice-daily", ["08:00", "20:00"], "Dr Singh", "Urinary tract infection", { startDate: medMockAt(3, "00:00"), endDate: medMockAt(-1, "00:00") }),
  med("p-5", "Tramadol", "50mg capsules", "oral", "controlled", "twice-daily", ["08:00", "20:00"], "Dr Okafor", "Osteoarthritis pain", { schedule: "3" }),
  med("p-5", "Atorvastatin", "20mg", "oral", "regular", "once-daily", ["20:00"], "Dr Okafor", "High cholesterol"),
  med("p-6", "NovoRapid insulin", "100u/ml (per glucose)", "injection", "variable-dose", "with-meals", ["08:00", "12:30", "18:00"], "Diabetes nurse", "Type 1 diabetes"),
  med("p-6", "Glucogel", "40% gel", "oral", "prn", "as-required", [], "Diabetes nurse", "Hypoglycaemia", { prnMinIntervalHours: 0.25, prnMaxPer24h: 3 }),
  med("p-7", "Sertraline", "50mg", "oral", "regular", "once-daily", ["08:00"], "Dr Singh", "Low mood"),
  med("p-7", "Senna", "7.5mg", "oral", "regular", "once-daily", ["20:00"], "Dr Singh", "Constipation"),
  med("p-8", "Furosemide", "40mg", "oral", "regular", "once-daily", ["08:00"], "Dr Patel", "Heart failure"),
  med("p-8", "Adcal-D3", "1 tablet", "oral", "regular", "twice-daily", ["08:00", "12:00"], "Dr Patel", "Osteoporosis"),
];

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
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const pick = <T,>(list: T[], r: number): T => list[Math.floor(r * 1000) % list.length];
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

// ---- PRN ----
export const mockPrnRecords: PrnRecord[] = [
  { id: "prn-1", medicationId: "med-6", patientId: "p-2", administeredAt: medMockAt(0, "11:40"), reason: "Headache", doseGiven: "500mg", recordedBy: "Priya P." },
  { id: "prn-2", medicationId: "med-2", patientId: "p-1", administeredAt: medMockAt(0, "10:30"), reason: "Hip pain", doseGiven: "1 tablet", recordedBy: "Sarah W." },
  { id: "prn-3", medicationId: "med-6", patientId: "p-2", administeredAt: medMockAt(1, "15:10"), reason: "Back pain", doseGiven: "500mg", recordedBy: "Priya P.",
    followUp: { checkedAt: medMockAt(1, "15:55"), effectiveness: "effective", note: "Settled within 40 minutes", recordedBy: "Priya P." } },
  { id: "prn-4", medicationId: "med-15", patientId: "p-6", administeredAt: medMockAt(2, "07:50"), reason: "Low glucose 3.4 mmol/L", doseGiven: "1 tube", recordedBy: "Sarah W.",
    followUp: { checkedAt: medMockAt(2, "08:30"), effectiveness: "effective", note: "Glucose back to 6.1", recordedBy: "Sarah W." } },
  { id: "prn-5", medicationId: "med-2", patientId: "p-1", administeredAt: medMockAt(1, "20:15"), reason: "Hip pain", doseGiven: "1 tablet", recordedBy: "Lucy C.",
    followUp: { checkedAt: medMockAt(1, "21:00"), effectiveness: "partial", note: "Eased but still uncomfortable", recordedBy: "Lucy C." } },
];

// ---- Controlled drugs ----
export const mockControlledStock: ControlledStock[] = [
  { medicationId: "med-7", balance: 42, unit: "capsules", lastCheckedAt: medMockAt(1, "20:30"), lastCheckedBy: "Sarah W.", lastPhysicalCount: 42 },
  { medicationId: "med-10", balance: 28, unit: "tablets", lastCheckedAt: medMockAt(0, "07:55"), lastCheckedBy: "Priya P.", lastPhysicalCount: 27 },
  { medicationId: "med-12", balance: 56, unit: "capsules", lastCheckedAt: medMockAt(1, "20:30"), lastCheckedBy: "Sarah W.", lastPhysicalCount: 56 },
];

const ce = (id: number, medicationId: string, patientId: string, kind: ControlledEntry["kind"], quantity: number, balanceAfter: number, at: Date, recordedBy: string, witness: string, note?: string): ControlledEntry =>
  ({ id: `ce-${id}`, medicationId, patientId, kind, quantity, balanceAfter, recordedBy, witness, at, note });

export const mockControlledEntries: ControlledEntry[] = [
  ce(1, "med-7", "p-3", "receipt", 56, 56, medMockAt(7, "10:15"), "Emma C.", "Sarah W.", "Delivered by pharmacy"),
  ce(2, "med-10", "p-4", "receipt", 56, 56, medMockAt(7, "10:20"), "Emma C.", "Sarah W.", "Delivered by pharmacy"),
  ce(3, "med-12", "p-5", "receipt", 56, 56, medMockAt(7, "10:25"), "Emma C.", "Sarah W.", "Delivered by pharmacy"),
  ce(4, "med-7", "p-3", "stock-check", 43, 43, medMockAt(1, "20:30"), "Sarah W.", "Priya P."),
  ce(5, "med-10", "p-4", "stock-check", 28, 29, medMockAt(0, "07:55"), "Priya P.", "Sarah W.", "Counted 28 against 29 recorded — 1 tablet unaccounted for, under review"),
  ce(6, "med-7", "p-3", "administration", 1, 42, medMockAt(0, "08:08"), "Sarah W.", "Priya P."),
  ce(7, "med-10", "p-4", "administration", 1, 28, medMockAt(0, "08:08"), "Sarah W.", "Priya P."),
  ce(8, "med-12", "p-5", "administration", 1, 56, medMockAt(0, "08:08"), "Sarah W.", "Priya P."),
];

// ---- Monthly audit reports (auto-generated on the 1st of each month) ----
export const mockAuditReports: AuditReport[] = [
  { id: "rep-3", period: "September 2026", generatedAt: new Date(2026, 9, 1, 6, 0), administrationRate: 94.6, scheduled: 884, generatedBy: "auto" },
  { id: "rep-2", period: "August 2026", generatedAt: new Date(2026, 8, 1, 6, 0), administrationRate: 93.8, scheduled: 852, generatedBy: "auto" },
  { id: "rep-1", period: "July 2026", generatedAt: new Date(2026, 7, 1, 6, 0), administrationRate: 92.1, scheduled: 870, generatedBy: "auto" },
];
