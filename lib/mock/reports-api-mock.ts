import type {
  AiInsight, ReportBuilderConfig, LibraryReport, ReportActivity, ReportDataset, ReportKpi, ReportSchedule, ReportTemplate, ReportScheduleFormData,
} from "types";
import { computeReportNextRun } from "utils";
import { parseRecipients } from "../validations/reports/schedule";
import {
  REPORTS_CURRENT_USER, REPORTS_MOCK_NOW, mockAiInsights, mockLibraryReports, mockReportActivity, mockReportDatasets, mockReportKpis,
  mockReportSchedules, mockReportTemplates,
} from "./reports-mock";

interface Db { schedules: ReportSchedule[]; templates: ReportTemplate[]; insights: AiInsight[]; activity: ReportActivity[] }
let db: Db | null = null;
const store = (): Db =>
  (db ??= { schedules: structuredClone(mockReportSchedules), templates: structuredClone(mockReportTemplates), insights: structuredClone(mockAiInsights), activity: structuredClone(mockReportActivity) });

const wait = (ms = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const copy = <T>(v: T): T => structuredClone(v);
const now = () => new Date(REPORTS_MOCK_NOW);

function pushActivity(action: ReportActivity["action"], target: string, detail?: string) {
  const s = store();
  s.activity.unshift({ id: `act-${s.activity.length + 1}`, at: now(), user: REPORTS_CURRENT_USER, action, target, detail });
}

// ---- Reads ----
export async function getReportKpis(): Promise<ReportKpi[]> { await wait(); return copy(mockReportKpis); }
export async function getReportDataset(id: string): Promise<ReportDataset> {
  await wait(250);
  const ds = mockReportDatasets.find((d) => d.id === id);
  if (!ds) throw new Error(`Dataset ${id} not found`);
  return copy(ds);
}
export async function getLibraryReports(): Promise<LibraryReport[]> { await wait(); return copy(mockLibraryReports); }
export async function getReportSchedules(): Promise<ReportSchedule[]> { await wait(); return copy(store().schedules); }
export async function getReportTemplates(): Promise<ReportTemplate[]> { await wait(); return copy(store().templates); }
export async function getAiInsights(): Promise<AiInsight[]> { await wait(); return copy(store().insights); }
export async function getReportActivity(): Promise<ReportActivity[]> { await wait(); return copy(store().activity); }

// ---- Writes ----
export async function logReportActivity(input: { action: ReportActivity["action"]; target: string; detail?: string }): Promise<void> {
  await wait(80);
  pushActivity(input.action, input.target, input.detail);
}

export async function saveReportSchedule(input: { id?: string; data: ReportScheduleFormData }): Promise<ReportSchedule> {
  await wait(300);
  const s = store();
  const d = input.data;
  const frequency = d.frequency as ReportSchedule["frequency"];
  const fields = {
    reportId: d.reportId, frequency, time: d.time, recipients: parseRecipients(d.recipients),
    dayOfWeek: frequency === "weekly" && d.dayOfWeek !== "" ? d.dayOfWeek : undefined,
    dayOfMonth: frequency === "monthly" && d.dayOfMonth !== "" ? d.dayOfMonth : undefined,
  };
  const nextRun = computeReportNextRun(frequency, d.time, fields.dayOfWeek, fields.dayOfMonth, now());
  let sch = s.schedules.find((x) => x.id === input.id);
  if (sch) Object.assign(sch, fields, { nextRun });
  else {
    sch = { id: `sch-${s.schedules.length + 1}`, status: "active", nextRun, ...fields };
    s.schedules.push(sch);
  }
  const title = mockLibraryReports.find((r) => r.id === d.reportId)?.title ?? d.reportId;
  pushActivity("schedule", title, `${frequency}, ${d.time}`);
  return copy(sch);
}

export async function setReportScheduleStatus(input: { id: string; status: ReportSchedule["status"] }): Promise<void> {
  await wait(200);
  const sch = store().schedules.find((x) => x.id === input.id);
  if (sch) sch.status = input.status;
}

export async function deleteReportSchedule(id: string): Promise<void> {
  await wait(200);
  const s = store();
  s.schedules = s.schedules.filter((x) => x.id !== id);
}

export async function saveReportTemplate(input: { name: string; config: ReportBuilderConfig }): Promise<ReportTemplate> {
  await wait(300);
  const s = store();
  const tpl: ReportTemplate = { id: `tpl-${s.templates.length + 1}`, name: input.name.trim(), config: copy(input.config), createdAt: now(), createdBy: REPORTS_CURRENT_USER };
  s.templates.unshift(tpl);
  pushActivity("template", tpl.name, "Saved");
  return copy(tpl);
}

export async function deleteReportTemplate(id: string): Promise<void> {
  await wait(200);
  const s = store();
  s.templates = s.templates.filter((t) => t.id !== id);
}

export async function reviewAiInsight(input: { id: string; status: "accepted" | "dismissed" }): Promise<AiInsight> {
  await wait(250);
  const ins = store().insights.find((i) => i.id === input.id);
  if (!ins) throw new Error("Insight not found");
  ins.status = input.status;
  pushActivity("insight", ins.title, input.status === "accepted" ? "Accepted: task created" : "Dismissed");
  return copy(ins);
}

export async function getReportCatalog(): Promise<Pick<ReportDataset, "id" | "title" | "domain" | "roles">[]> {
  await wait(150);
  return mockReportDatasets.map(({ id, title, domain, roles }) => ({ id, title, domain, roles }));
}
