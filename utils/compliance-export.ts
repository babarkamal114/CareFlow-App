import type { AuditLog, CqcQuestionScore, PackRecord, PackSection, ReadinessFactor, Regulation } from "types";
import { formatLongDate, formatStamp } from "./compliance";

const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const toCsv = (headers: string[], rows: (string | number)[][]) =>
  [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");

export function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8"): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const buildReadinessCsv = (factors: ReadinessFactor[], questions: CqcQuestionScore[], overall: number): string =>
  [
    toCsv(["Factor", "Score", "Weight", "Feeds CQC questions", "Evidence"],
      factors.map((f) => [f.label, f.score, f.weight, f.questions.join(" / "), f.detail])),
    "",
    toCsv(["CQC key question", "Score"], [...questions.map((q) => [q.label, q.score]), ["Overall readiness", overall]]),
  ].join("\n");

export const buildRegulationsCsv = (regs: Regulation[]): string =>
  toCsv(["Regulation", "Title", "CQC question", "Status", "Score %", "Last inspected", "Open actions"],
    regs.map((r) => [r.reg, r.title, r.category, r.status, r.progress, r.lastInspected, r.actions.length]));

export const buildAuditCsv = (logs: AuditLog[], asOf: Date): string =>
  toCsv(["When", "Action", "Details", "User", "Type", "Patient", "Device", "IP address"],
    logs.map((l) => [formatStamp(l.timestamp, asOf), l.action, l.details, l.user, l.entity, l.patient ?? "", l.device ?? "", l.ipAddress ?? ""]));

export const buildAuditEntryText = (l: AuditLog, asOf: Date): string =>
  [
    "CareFlow audit record", "=====================", `Action:     ${l.action}`, `Details:    ${l.details}`,
    `Performed:  ${l.user}`, `When:       ${formatStamp(l.timestamp, asOf)}`, `Type:       ${l.entity}`,
    `Patient:    ${l.patient ?? "-"}`, `Location:   ${l.location ?? "-"}`, `Device:     ${l.device ?? "-"}`,
    `IP address: ${l.ipAddress ?? "-"}`, "", `Notes: ${l.notes ?? "-"}`, "",
    "This record is immutable. Changes appear as versioned updates.",
  ].join("\n");

export function buildPackSummary(record: PackRecord, sections: PackSection[], overall: number): string {
  const included = sections.filter((s) => record.sections.includes(s.id));
  return [
    "CareFlow — CQC Inspection Pack", "==============================",
    `Generated: ${formatLongDate(record.generatedAt)}`, `Pages: ${record.pageCount}`, `CQC readiness score: ${overall}/100`, "",
    "Contents:", ...included.map((s, i) => `${i + 1}. ${s.label} (${s.pages} pages) — ${s.description}`),
  ].join("\n");
}
