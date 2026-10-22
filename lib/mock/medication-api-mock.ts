import type {
  AdministrationStatus, AuditReport, ControlledEntry, ControlledEntryFormData, ControlledStock, HistoryDose, Medication,
  MedicationFormData, MedicationPatient, PrnFollowUpFormData, PrnFormData, PrnRecord, RecordDoseFormData, ScheduledDose,
} from "types";
import {
  MEDICATION_MOCK_NOW, buildDosesForMedication, buildHistory, buildTodayDoses, mockAuditReports, mockControlledEntries,
  mockControlledStock, mockMedicationPatients, mockMedications, mockPrnRecords,
} from "./medication-mock";

interface Db {
  medications: Medication[]; doses: ScheduledDose[]; history: HistoryDose[]; prn: PrnRecord[];
  stock: ControlledStock[]; entries: ControlledEntry[]; reports: AuditReport[];
}

let db: Db | null = null;
const store = (): Db =>
  (db ??= {
    medications: structuredClone(mockMedications), doses: buildTodayDoses(mockMedications), history: buildHistory(mockMedications),
    prn: structuredClone(mockPrnRecords), stock: structuredClone(mockControlledStock), entries: structuredClone(mockControlledEntries),
    reports: structuredClone(mockAuditReports),
  });

const wait = (ms = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const copy = <T>(value: T): T => structuredClone(value);
const now = () => new Date(MEDICATION_MOCK_NOW);
const parseLocal = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// ---- Reads ----
export async function getMedicationPatients(): Promise<MedicationPatient[]> { await wait(); return copy(mockMedicationPatients); }
export async function getMedications(): Promise<Medication[]> { await wait(); return copy(store().medications); }
export async function getRoundDoses(): Promise<ScheduledDose[]> { await wait(); return copy(store().doses); }
export async function getHistoryDoses(): Promise<HistoryDose[]> { await wait(); return copy(store().history); }
export async function getPrnRecords(): Promise<PrnRecord[]> { await wait(); return copy(store().prn); }
export async function getControlledData(): Promise<{ stock: ControlledStock[]; entries: ControlledEntry[] }> {
  await wait();
  return copy({ stock: store().stock, entries: store().entries });
}
export async function getAuditReports(): Promise<AuditReport[]> { await wait(); return copy(store().reports); }

// ---- Controlled-drug helper: every administration / receipt / disposal moves the recorded AND physical balance ----
function moveStock(s: Db, med: Medication, delta: number, kind: ControlledEntry["kind"], by: string, witness: string, note?: string) {
  const stock = s.stock.find((x) => x.medicationId === med.id);
  if (!stock) return;
  stock.balance += delta;
  stock.lastPhysicalCount += delta;
  s.entries.push({
    id: `ce-${s.entries.length + 1}`, medicationId: med.id, patientId: med.patientId, kind, quantity: Math.abs(delta),
    balanceAfter: stock.balance, recordedBy: by, witness, at: now(), note,
  });
}

// ---- Writes ----
export async function recordDose(input: { doseId: string; data: RecordDoseFormData; recordedBy: string }): Promise<ScheduledDose> {
  await wait(300);
  const s = store();
  const dose = s.doses.find((d) => d.id === input.doseId);
  const med = s.medications.find((m) => m.id === dose?.medicationId);
  if (!dose || !med) throw new Error("Dose not found");
  const { data } = input;
  dose.record = {
    status: data.status as AdministrationStatus, reasonCode: data.reasonCode || undefined, note: data.note || undefined,
    doseGiven: data.doseGiven || undefined, recordedBy: input.recordedBy, recordedAt: now(),
    witness: data.witness || undefined, barcodeVerified: data.barcode !== "",
  };
  if (med.type === "controlled" && data.status === "administered") {
    moveStock(s, med, -1, "administration", input.recordedBy, data.witness, "Recorded from the medication round");
  }
  return copy(dose);
}

export async function saveMedication(input: { id?: string; data: MedicationFormData }): Promise<Medication> {
  await wait(300);
  const s = store();
  const d = input.data;
  const isPrn = d.type === "prn" || d.frequency === "as-required";
  const fields = {
    patientId: d.patientId, drugName: d.drugName.trim(), strength: d.strength.trim(), route: d.route as Medication["route"],
    type: (isPrn ? "prn" : d.type) as Medication["type"], frequency: (isPrn ? "as-required" : d.frequency) as Medication["frequency"],
    times: isPrn ? [] : [...d.times].sort(), prescriber: d.prescriber.trim(), startDate: parseLocal(d.startDate),
    endDate: d.endDate ? parseLocal(d.endDate) : undefined, indication: d.indication.trim(), instructions: d.instructions.trim() || undefined,
    schedule: d.type === "controlled" && d.schedule ? d.schedule : undefined,
    prnMinIntervalHours: isPrn && d.prnMinIntervalHours !== "" ? d.prnMinIntervalHours : undefined,
    prnMaxPer24h: isPrn && d.prnMaxPer24h !== "" ? d.prnMaxPer24h : undefined,
  };

  let med = s.medications.find((m) => m.id === input.id);
  if (med) {
    const note = med.strength !== fields.strength ? `Dose changed from ${med.strength} to ${fields.strength}`
      : med.times.join() !== fields.times.join() ? "Administration times changed" : "Details updated";
    Object.assign(med, fields, { changedAt: now(), changeNote: note });
  } else {
    const id = `med-${s.medications.length + 1}`;
    med = { id, barcode: `501234${String(s.medications.length + 1).padStart(7, "0")}`, active: true, changedAt: now(), changeNote: "New medication added", ...fields };
    s.medications.push(med);
    if (med.type === "controlled") {
      s.stock.push({ medicationId: id, balance: 0, unit: "units", lastCheckedAt: now(), lastCheckedBy: "—", lastPhysicalCount: 0 });
    }
  }
  // refresh today's still-unrecorded doses for this medication
  const medId = med.id;
  s.doses = s.doses.filter((x) => x.medicationId !== medId || x.record !== null);
  for (const nd of buildDosesForMedication(med)) {
    if (!s.doses.some((x) => x.id === nd.id)) s.doses.push(nd);
  }
  s.doses.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  return copy(med);
}

export async function discontinueMedication(id: string): Promise<void> {
  await wait(250);
  const s = store();
  const med = s.medications.find((m) => m.id === id);
  if (med) med.active = false;
  s.doses = s.doses.filter((d) => d.medicationId !== id || d.record !== null);
}

export async function recordPrn(input: { data: PrnFormData; recordedBy: string }): Promise<PrnRecord> {
  await wait(300);
  const s = store();
  const med = s.medications.find((m) => m.id === input.data.medicationId);
  if (!med) throw new Error("Medication not found");
  const rec: PrnRecord = {
    id: `prn-${s.prn.length + 1}`, medicationId: med.id, patientId: med.patientId, administeredAt: now(),
    reason: input.data.reason.trim(), doseGiven: input.data.doseGiven.trim(), recordedBy: input.recordedBy,
  };
  s.prn.push(rec);
  return copy(rec);
}

export async function recordPrnFollowUp(input: { id: string; data: PrnFollowUpFormData; recordedBy: string }): Promise<PrnRecord> {
  await wait(250);
  const rec = store().prn.find((r) => r.id === input.id);
  if (!rec) throw new Error("PRN record not found");
  rec.followUp = {
    checkedAt: now(), effectiveness: input.data.effectiveness as NonNullable<PrnRecord["followUp"]>["effectiveness"],
    note: input.data.note.trim() || undefined, recordedBy: input.recordedBy,
  };
  return copy(rec);
}

export async function recordControlledEntry(input: { medicationId: string; data: ControlledEntryFormData; recordedBy: string }): Promise<void> {
  await wait(300);
  const s = store();
  const med = s.medications.find((m) => m.id === input.medicationId);
  const stock = s.stock.find((x) => x.medicationId === input.medicationId);
  if (!med || !stock) throw new Error("Controlled drug not found");
  const { data } = input;
  const qty = Number(data.quantity);
  const note = data.note.trim() || undefined;

  if (data.kind === "receipt") moveStock(s, med, qty, "receipt", input.recordedBy, data.witness, note);
  else if (data.kind === "disposal") moveStock(s, med, -qty, "disposal", input.recordedBy, data.witness, note);
  else {
    stock.lastPhysicalCount = qty;
    stock.lastCheckedAt = now();
    stock.lastCheckedBy = input.recordedBy;
    const before = stock.balance;
    if (data.adjustBalance) stock.balance = qty;
    s.entries.push({
      id: `ce-${s.entries.length + 1}`, medicationId: med.id, patientId: med.patientId, kind: "stock-check", quantity: qty,
      balanceAfter: before, recordedBy: input.recordedBy, witness: data.witness, at: now(),
      note: data.adjustBalance && qty !== before ? `${note ?? ""} (balance adjusted to ${qty})`.trim() : note,
    });
  }
}

export async function generateAuditReport(): Promise<AuditReport> {
  await wait(500);
  const s = store();
  const scheduled = s.history.length;
  const given = s.history.filter((h) => h.status === "administered" || h.status === "self-administered").length;
  const report: AuditReport = {
    id: `rep-${s.reports.length + 1}`, period: "Last 30 days to 18 Oct 2026", generatedAt: now(),
    administrationRate: Math.round((given / Math.max(1, scheduled)) * 1000) / 10, scheduled, generatedBy: "manual",
  };
  s.reports.unshift(report);
  return copy(report);
}
