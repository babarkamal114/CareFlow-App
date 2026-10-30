import type { AuditSummary, ControlledEntry, Medication, MedicationPatient, RoundRow } from "types";
import type { AuditGap, RefusalPattern } from "./medication-audit";
import { formatMedDateTime, formatMedTime, getDrugLabel } from "./medication";
import { CONTROLLED_KIND_LABEL, DOSE_STATE_CONFIG, REASON_LABEL } from "./medication-display";

const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const toCsv = (headers: string[], rows: (string | number)[][]) => [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");

export function downloadMedicationFile(filename: string, content: string, mime = "text/csv;charset=utf-8"): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildMedicationAuditCsv(
  summary: AuditSummary, reasons: { label: string; count: number }[], patterns: RefusalPattern[], gaps: AuditGap[], now: Date,
): string {
  return [
    toCsv(["Measure", "Value"], [
      ["Doses scheduled", summary.scheduled], ["Administered", summary.administered], ["Refused", summary.refused], ["Omitted", summary.omitted],
      ["Not available", summary.notAvailable], ["Nothing recorded (gaps)", summary.gaps], ["Administration rate %", summary.rate],
    ]),
    "", toCsv(["Omission / refusal reason", "Count"], reasons.map((r) => [r.label, r.count])),
    "", toCsv(["Patient", "Medication refused", "Times refused", "Last refused"], patterns.map((p) => [p.patientName, p.drug, p.refusals, formatMedDateTime(p.lastRefusal, now)])),
    "", toCsv(["Unexplained gap", "Patient", "Medication"], gaps.map((g) => [formatMedDateTime(g.when, now), g.patientName, g.drug])),
  ].join("\n");
}

export const buildMedicationRoundCsv = (rows: RoundRow[]): string =>
  toCsv(["Due", "Patient", "Medication", "Route", "Status", "Recorded by", "Reason", "Note"],
    rows.map((r) => [
      formatMedTime(r.dose.scheduledAt), r.patient.name, getDrugLabel(r.medication), r.medication.route, DOSE_STATE_CONFIG[r.state].label,
      r.dose.record?.recordedBy ?? "", r.dose.record?.reasonCode ? REASON_LABEL[r.dose.record.reasonCode] : "", r.dose.record?.note ?? "",
    ]));

export function buildControlledLedgerCsv(entries: ControlledEntry[], meds: Medication[], patients: MedicationPatient[], now: Date): string {
  const medById = new Map(meds.map((m) => [m.id, m]));
  const patientById = new Map(patients.map((p) => [p.id, p]));
  return toCsv(["When", "Medication", "Patient", "Entry", "Quantity", "Balance after", "Recorded by", "Witness", "Note"],
    [...entries].sort((a, b) => b.at.getTime() - a.at.getTime()).map((e) => [
      formatMedDateTime(e.at, now), medById.get(e.medicationId) ? getDrugLabel(medById.get(e.medicationId)!) : "", patientById.get(e.patientId)?.name ?? "",
      CONTROLLED_KIND_LABEL[e.kind], e.quantity, e.balanceAfter, e.recordedBy, e.witness, e.note ?? "",
    ]));
}
