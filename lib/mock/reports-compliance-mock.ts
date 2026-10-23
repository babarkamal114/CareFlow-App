import type { ReportDataset } from "types";
import { col, ROLES_MANAGERS } from "./reports-dataset-helpers";

export const complianceDatasets: ReportDataset[] = [
  {
    id: "cqc-questions", domain: "compliance", title: "CQC five key questions", description: "Score per key question, calculated from the 8 readiness factors", source: "Blueprint 3.4.1", roles: ROLES_MANAGERS,
    columns: [col("question", "Key question", "text", { groupable: true }), col("score", "Score", "number"), col("rating", "Rating", "status")],
    rows: [
      { question: "Safe", score: 87, rating: "good" }, { question: "Effective", score: 82, rating: "needs-improvement" }, { question: "Caring", score: 86, rating: "good" },
      { question: "Responsive", score: 82, rating: "needs-improvement" }, { question: "Well-led", score: 78, rating: "needs-improvement" },
    ],
    chart: { kind: "bar", xKey: "question", yKeys: ["score"] },
  },
  {
    id: "readiness-factors", domain: "compliance", title: "Readiness score factors", description: "The 8 weighted factors behind the CQC readiness score", source: "Blueprint 3.4.1", roles: ROLES_MANAGERS,
    columns: [col("factor", "Factor", "text", { groupable: true }), col("score", "Score", "number"), col("weight", "Weight %", "number")],
    rows: [
      { factor: "Care plan completeness", score: 88, weight: 15 }, { factor: "Risk assessment coverage", score: 95, weight: 12 }, { factor: "Documentation timeliness", score: 76, weight: 12 },
      { factor: "Incident response times", score: 82, weight: 12 }, { factor: "Training compliance", score: 72, weight: 15 }, { factor: "DBS status", score: 94, weight: 10 },
      { factor: "Supervision records", score: 74, weight: 12 }, { factor: "Medication audit", score: 97, weight: 12 },
    ],
    chart: { kind: "bar", xKey: "factor", yKeys: ["score"] },
  },
  {
    id: "audit-trail", domain: "compliance", title: "Audit trail", description: "Who did what, when — searchable by user, patient, date and action", source: "Blueprint 3.4.2", roles: ROLES_MANAGERS,
    columns: [col("date", "Date", "date", { dateKey: true }), col("user", "User", "text", { groupable: true }), col("action", "Action", "text", { groupable: true }), col("entity", "Type", "text", { groupable: true }), col("patient", "Patient", "text", { groupable: true })],
    rows: [
      { date: "2026-10-19", user: "Sarah W.", action: "Care plan reviewed", entity: "Plan", patient: "Margaret Johnson" }, { date: "2026-10-19", user: "Lucy C.", action: "Visit completed", entity: "Visit", patient: "Arthur Wilson" },
      { date: "2026-10-19", user: "Priya P.", action: "Medication administered", entity: "MAR", patient: "Robert Ahmed" }, { date: "2026-10-19", user: "Sarah W.", action: "Incident reported", entity: "Incident", patient: "Edna Morris" },
      { date: "2026-10-19", user: "Emma C.", action: "Risk assessment updated", entity: "Risk", patient: "Dorothy Chen" }, { date: "2026-10-19", user: "Emma C.", action: "Digital signature added", entity: "Signature", patient: "Barbara Williams" },
      { date: "2026-10-18", user: "Sarah W.", action: "Visit completed", entity: "Visit", patient: "Dorothy Chen" }, { date: "2026-10-18", user: "Emma C.", action: "Care plan updated", entity: "Plan", patient: "Edna Morris" },
      { date: "2026-10-17", user: "Sarah W.", action: "Digital signature added", entity: "Signature", patient: "Arthur Wilson" }, { date: "2026-10-16", user: "Emma C.", action: "Incident reported", entity: "Incident", patient: "James Okafor" },
      { date: "2026-10-15", user: "Priya P.", action: "Risk assessment updated", entity: "Risk", patient: "Susan Taylor" }, { date: "2026-10-14", user: "Emma C.", action: "Care plan reviewed", entity: "Plan", patient: "Patricia Smith" },
    ],
    chart: { kind: "table", xKey: "action", yKeys: [] },
  },
  {
    id: "continuity-of-care", domain: "compliance", title: "Continuity of care", description: "How often the same carer visits each patient", source: "Blueprint 8.1.3", roles: ROLES_MANAGERS,
    columns: [col("patient", "Patient", "text", { groupable: true }), col("carers", "Different carers", "number"), col("sameCarer", "Same-carer visits", "percent"), col("visits", "Visits", "number")],
    rows: [
      { patient: "Margaret Johnson", carers: 2, sameCarer: 86, visits: 28 }, { patient: "Robert Ahmed", carers: 3, sameCarer: 71, visits: 21 }, { patient: "Edna Morris", carers: 2, sameCarer: 90, visits: 28 },
      { patient: "Dorothy Chen", carers: 4, sameCarer: 58, visits: 24 }, { patient: "Henry Smith", carers: 2, sameCarer: 82, visits: 21 }, { patient: "Arthur Wilson", carers: 3, sameCarer: 74, visits: 26 },
    ],
    chart: { kind: "bar", xKey: "patient", yKeys: ["sameCarer"] },
  },
  {
    id: "complaints-log", domain: "compliance", title: "Complaints log", description: "Complaints received, investigated and resolved", source: "Blueprint 3.4.4 / 8.1.3", roles: ROLES_MANAGERS,
    columns: [col("ref", "Ref", "text"), col("received", "Received", "date", { dateKey: true }), col("complainant", "Complainant", "text", { groupable: true }), col("status", "Status", "status", { groupable: true }), col("days", "Days to resolve", "number")],
    rows: [
      { ref: "CMP-014", received: "2026-10-12", complainant: "Family member", status: "investigating", days: 7 }, { ref: "CMP-013", received: "2026-09-28", complainant: "Patient", status: "resolved", days: 9 },
      { ref: "CMP-012", received: "2026-09-04", complainant: "Family member", status: "resolved", days: 12 }, { ref: "CMP-011", received: "2026-08-19", complainant: "Local authority", status: "resolved", days: 6 },
    ],
    chart: { kind: "table", xKey: "ref", yKeys: [] },
  },
];
