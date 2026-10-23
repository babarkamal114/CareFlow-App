import type { ReportDataset } from "types";
import { col, ROLES_MANAGERS, ROLES_OPERATIONS } from "./reports-dataset-helpers";

export const clinicalDatasets: ReportDataset[] = [
  {
    id: "mar-audit", domain: "clinical", title: "Medication administration rate", description: "Monthly MAR audit: share of scheduled doses recorded as given", source: "Blueprint 3.1.4 / automation 25", roles: ROLES_MANAGERS,
    columns: [col("month", "Month", "text", { groupable: true }), col("scheduled", "Scheduled", "number"), col("administered", "Administered", "number"), col("rate", "Rate", "percent"), col("refused", "Refused", "number"), col("omitted", "Omitted", "number")],
    rows: [
      { month: "Jul 2026", scheduled: 870, administered: 801, rate: 92.1, refused: 31, omitted: 22 }, { month: "Aug 2026", scheduled: 852, administered: 799, rate: 93.8, refused: 27, omitted: 17 },
      { month: "Sep 2026", scheduled: 884, administered: 836, rate: 94.6, refused: 24, omitted: 15 }, { month: "Oct 2026 (to date)", scheduled: 696, administered: 639, rate: 91.8, refused: 24, omitted: 17 },
    ],
    chart: { kind: "line", xKey: "month", yKeys: ["rate"] },
  },
  {
    id: "incidents-by-type", domain: "clinical", title: "Incidents by type", description: "Incident trend by category this quarter", source: "Blueprint 3.1.6", roles: ROLES_OPERATIONS,
    columns: [col("type", "Type", "text", { groupable: true }), col("count", "Incidents", "number")],
    rows: [{ type: "Fall", count: 6 }, { type: "Missed visit", count: 4 }, { type: "Bruise / skin", count: 3 }, { type: "Medication error", count: 2 }, { type: "Behavioural", count: 2 }, { type: "Safeguarding", count: 1 }],
    chart: { kind: "bar", xKey: "type", yKeys: ["count"] },
  },
  {
    id: "incidents-by-severity", domain: "clinical", title: "Incidents by severity", description: "Minor, moderate, severe and catastrophic", source: "Blueprint 3.1.6", roles: ROLES_OPERATIONS,
    columns: [col("severity", "Severity", "text", { groupable: true }), col("count", "Incidents", "number")],
    rows: [{ severity: "Minor", count: 9 }, { severity: "Moderate", count: 6 }, { severity: "Severe", count: 2 }, { severity: "Catastrophic", count: 0 }],
    chart: { kind: "donut", xKey: "severity", yKeys: ["count"] },
  },
  {
    id: "incidents-by-hour", domain: "clinical", title: "Incidents by time of day", description: "Spot patterns such as falls on night shifts", source: "Blueprint 6.9", roles: ROLES_OPERATIONS,
    columns: [col("slot", "Time of day", "text", { groupable: true }), col("count", "Incidents", "number")],
    rows: [{ slot: "00:00–06:00", count: 5 }, { slot: "06:00–12:00", count: 4 }, { slot: "12:00–18:00", count: 3 }, { slot: "18:00–24:00", count: 5 }],
    chart: { kind: "bar", xKey: "slot", yKeys: ["count"] },
  },
  {
    id: "nutrition-hydration", domain: "clinical", title: "Nutrition and hydration", description: "Average meals eaten and fluid intake across all patients", source: "Blueprint 3.1.5 / 8.1.2", roles: ROLES_MANAGERS,
    columns: [col("week", "Week", "text", { groupable: true }), col("food", "Meals eaten", "percent"), col("fluid", "Fluid (ml/day)", "number")],
    rows: [{ week: "Wk 38", food: 88, fluid: 1480 }, { week: "Wk 39", food: 87, fluid: 1450 }, { week: "Wk 40", food: 85, fluid: 1420 }, { week: "Wk 41", food: 82, fluid: 1390 }, { week: "Wk 42", food: 80, fluid: 1340 }, { week: "Wk 43", food: 79, fluid: 1310 }],
    chart: { kind: "line", xKey: "week", yKeys: ["food"] },
  },
  {
    id: "patient-outcomes", domain: "clinical", title: "Patient outcomes", description: "Progress against measurable care plan goals", source: "Blueprint 5.6 / 3.1.2", roles: ROLES_MANAGERS,
    columns: [col("patient", "Patient", "text", { groupable: true }), col("goal", "Goal", "text"), col("progress", "Progress", "percent"), col("status", "Status", "status", { groupable: true })],
    rows: [
      { patient: "Margaret Johnson", goal: "Maintain current weight", progress: 92, status: "good" }, { patient: "Edna Morris", goal: "Walk to the kitchen independently", progress: 64, status: "needs-improvement" },
      { patient: "Henry Smith", goal: "Reduce falls to zero", progress: 71, status: "needs-improvement" }, { patient: "Arthur Wilson", goal: "Glucose in range 80% of readings", progress: 86, status: "good" },
      { patient: "Dorothy Chen", goal: "Eat 3 meals a day", progress: 48, status: "requires-action" }, { patient: "Robert Ahmed", goal: "Fluid intake 1.5L a day", progress: 55, status: "requires-action" },
    ],
    chart: { kind: "bar", xKey: "patient", yKeys: ["progress"] },
  },
];
