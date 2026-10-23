import type { ReportDataset, ReportRow } from "types";
import { col, ROLES_MANAGERS, STAFF_NAMES } from "./reports-dataset-helpers";

const MODULES = [["safeguarding", "Safeguarding"], ["medication", "Medication"], ["firstAid", "First aid"], ["moving", "Moving & handling"], ["fire", "Fire safety"], ["infection", "Infection control"]] as const;
const RESULTS = ["pass", "pass", "pass", "pass", "fail", "expired", "not-started"];
const statusFromDays = (d: number) => (d < 0 ? "expired" : d <= 30 ? "expiring" : "clear");
const DBS = [90, 25, -5, 180, 10, 300, 45, 3, 120, 60, -10, 200];
const RTW = [200, 15, 400, 60, -3, 250, 90, 30, 150, 45, 5, 365];
const SUP = [14, -3, 40, 7, 21];
const worst = (s: string[]) => (s.includes("expired") ? "expired" : s.includes("expiring") ? "expiring" : "clear");

const trainingRows: ReportRow[] = STAFF_NAMES.map((staff, i) => {
  const row: ReportRow = { staff };
  MODULES.forEach(([key], m) => { row[key] = RESULTS[(i + m) % RESULTS.length]; });
  return row;
});

const complianceRows: ReportRow[] = STAFF_NAMES.map((staff, i) => {
  const dbs = statusFromDays(DBS[i % 12]);
  const rtw = statusFromDays(RTW[i % 12]);
  const supervision = SUP[i % 5] < 0 ? "expired" : SUP[i % 5] <= 7 ? "expiring" : "clear";
  return { staff, dbs, rightToWork: rtw, supervision, overall: worst([dbs, rtw, supervision]) };
});

export const workforceDatasets: ReportDataset[] = [
  {
    id: "training-matrix", domain: "workforce", title: "Training matrix", description: "All staff against all mandatory training modules", source: "Blueprint 5.4", roles: ROLES_MANAGERS,
    columns: [col("staff", "Staff", "text", { groupable: true }), ...MODULES.map(([key, label]) => col(key, label, "status"))],
    rows: trainingRows, chart: { kind: "table", xKey: "staff", yKeys: [] },
  },
  {
    id: "staff-compliance", domain: "workforce", title: "Staff compliance status", description: "DBS, right to work and supervision — green, amber or red", source: "Blueprint 3.2.4 / 5.4", roles: ROLES_MANAGERS,
    columns: [col("staff", "Staff", "text", { groupable: true }), col("dbs", "DBS", "status", { groupable: true }), col("rightToWork", "Right to work", "status", { groupable: true }), col("supervision", "Supervision", "status", { groupable: true }), col("overall", "Overall", "status", { groupable: true })],
    rows: complianceRows, chart: { kind: "table", xKey: "staff", yKeys: [] },
  },
  {
    id: "staff-performance", domain: "workforce", title: "Carer performance", description: "Punctuality, completion, note quality and patient feedback", source: "Blueprint 5.4", roles: ROLES_MANAGERS,
    columns: [col("carer", "Carer", "text", { groupable: true }), col("punctuality", "Punctuality", "percent"), col("completion", "Visit completion", "percent"), col("noteQuality", "Note quality (1-5)", "number"), col("feedback", "Patient feedback (1-5)", "number")],
    rows: STAFF_NAMES.slice(0, 8).map((carer, i) => ({
      carer, punctuality: 78 + ((i * 7) % 22), completion: 85 + ((i * 3) % 15),
      noteQuality: Math.round((3 + ((i * 1.7) % 2)) * 10) / 10, feedback: Math.round((3.2 + ((i * 1.3) % 1.8)) * 10) / 10,
    })),
    chart: { kind: "bar", xKey: "carer", yKeys: ["punctuality"] },
  },
  {
    id: "availability", domain: "workforce", title: "Availability and utilisation", description: "Weekly hours available against hours booked", source: "Blueprint 5.4", roles: ROLES_MANAGERS,
    columns: [col("carer", "Carer", "text", { groupable: true }), col("available", "Available hrs", "number"), col("booked", "Booked hrs", "number"), col("utilisation", "Utilisation", "percent")],
    rows: [["Sarah Williams", 40, 37], ["James O'Connor", 40, 34], ["Priya Patel", 32, 31], ["Dorothy Chen", 24, 15], ["Michael Turner", 40, 29], ["Aisha Begum", 36, 33]].map(([carer, available, booked]) => ({ carer, available, booked, utilisation: Math.round((Number(booked) / Number(available)) * 100) })),
    chart: { kind: "bar", xKey: "carer", yKeys: ["available", "booked"] },
  },
  {
    id: "workforce-turnover", domain: "workforce", title: "Workforce health vs industry", description: "Turnover, retention and utilisation against the industry average", source: "Blueprint 10.3", roles: ROLES_MANAGERS,
    columns: [col("measure", "Measure", "text", { groupable: true }), col("agency", "Your agency %", "number"), col("industry", "Industry average %", "number")],
    rows: [{ measure: "Annual turnover", agency: 22, industry: 35 }, { measure: "Retention", agency: 78, industry: 65 }, { measure: "Utilisation", agency: 86, industry: 80 }],
    chart: { kind: "bar", xKey: "measure", yKeys: ["agency", "industry"] },
  },
  {
    id: "carer-costs", domain: "workforce", title: "Carer cost analysis", description: "Total cost per carer against revenue generated", source: "Blueprint 3.6.3", roles: ["owner", "finance-admin"],
    columns: [col("carer", "Carer", "text", { groupable: true }), col("pay", "Pay", "currency"), col("travel", "Travel", "currency"), col("expenses", "Expenses", "currency"), col("revenue", "Revenue", "currency"), col("net", "Net", "currency")],
    rows: [["Sarah Williams", 2220, 180, 45, 4140], ["James O'Connor", 2050, 210, 60, 3600], ["Emma Davies", 1980, 150, 30, 3920], ["Michael Turner", 1760, 260, 85, 2900], ["Laura Mitchell", 2110, 170, 40, 4010], ["Priya Patel", 1650, 320, 120, 2580]]
      .map(([carer, pay, travel, expenses, revenue]) => ({ carer, pay, travel, expenses, revenue, net: Number(revenue) - Number(pay) - Number(travel) - Number(expenses) })),
    chart: { kind: "bar", xKey: "carer", yKeys: ["revenue", "net"] },
  },
];
