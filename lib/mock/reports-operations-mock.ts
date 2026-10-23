import type { ReportDataset } from "types";
import { col, ROLES_OPERATIONS } from "./reports-dataset-helpers";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const operationsDatasets: ReportDataset[] = [
  {
    id: "todays-numbers", domain: "operations", title: "Today's visits", description: "Scheduled, completed, in progress, late and missed", source: "Blueprint 5.1", roles: ROLES_OPERATIONS,
    columns: [col("status", "Status", "text", { groupable: true }), col("visits", "Visits", "number")],
    rows: [{ status: "Completed", visits: 31 }, { status: "In progress", visits: 4 }, { status: "Scheduled", visits: 9 }, { status: "Late", visits: 2 }, { status: "Missed", visits: 2 }],
    chart: { kind: "donut", xKey: "status", yKeys: ["visits"] },
  },
  {
    id: "on-time-trend", domain: "operations", title: "On-time rate", description: "Visits started on time, month by month", source: "Blueprint 10.3", roles: ROLES_OPERATIONS,
    columns: [col("month", "Month", "text", { groupable: true }), col("onTime", "On time", "percent"), col("visits", "Visits", "number")],
    rows: [{ month: "Jul", onTime: 92.9, visits: 3410 }, { month: "Aug", onTime: 94.1, visits: 3520 }, { month: "Sep", onTime: 94.8, visits: 3604 }, { month: "Oct", onTime: 96.2, visits: 2420 }],
    chart: { kind: "line", xKey: "month", yKeys: ["onTime"] },
  },
  {
    id: "visit-duration", domain: "operations", title: "Visit duration monitoring", description: "Visits much shorter or longer than scheduled", source: "Blueprint 3.3.2", roles: ROLES_OPERATIONS,
    columns: [col("patient", "Patient", "text", { groupable: true }), col("carer", "Carer", "text", { groupable: true }), col("scheduled", "Scheduled (min)", "number"), col("actual", "Actual (min)", "number"), col("flag", "Flag", "status", { groupable: true })],
    rows: [
      { patient: "Robert Chen", carer: "James O.", scheduled: 60, actual: 32, flag: "short" }, { patient: "Margaret Johnson", carer: "Sarah W.", scheduled: 60, actual: 58, flag: "ok" }, { patient: "Edna Morris", carer: "Priya P.", scheduled: 45, actual: 71, flag: "long" },
      { patient: "Patricia Smith", carer: "Emma D.", scheduled: 60, actual: 61, flag: "ok" }, { patient: "David Wilson", carer: "Michael B.", scheduled: 60, actual: 35, flag: "short" }, { patient: "Susan Taylor", carer: "Laura M.", scheduled: 90, actual: 88, flag: "ok" },
    ],
    chart: { kind: "table", xKey: "patient", yKeys: [] },
  },
  {
    id: "capacity-planning", domain: "operations", title: "Capacity planning", description: "Hours of care needed against carer hours available this week", source: "Blueprint 3.2.1", roles: ROLES_OPERATIONS,
    columns: [col("day", "Day", "text", { groupable: true }), col("needed", "Hours needed", "number"), col("available", "Hours available", "number")],
    rows: DAYS.map((day, i) => ({ day, needed: [96, 98, 94, 100, 97, 72, 64][i], available: [104, 102, 96, 94, 101, 76, 70][i] })),
    chart: { kind: "bar", xKey: "day", yKeys: ["needed", "available"] },
  },
  {
    id: "unassigned-visits", domain: "operations", title: "Unassigned visits", description: "Visits without a carer, by day", source: "Blueprint 3.2.1", roles: ROLES_OPERATIONS,
    columns: [col("day", "Day", "text", { groupable: true }), col("unassigned", "Unassigned visits", "number")],
    rows: DAYS.map((day, i) => ({ day, unassigned: [2, 1, 0, 4, 1, 3, 2][i] })),
    chart: { kind: "bar", xKey: "day", yKeys: ["unassigned"] },
  },
  {
    id: "geofence-flags", domain: "operations", title: "Check-in flags", description: "Check-ins outside the 100m geofence or unusually late", source: "Blueprint 3.3.1 / 3.3.3", roles: ROLES_OPERATIONS,
    columns: [col("date", "Date", "date", { dateKey: true }), col("carer", "Carer", "text", { groupable: true }), col("patient", "Patient", "text", { groupable: true }), col("distance", "Distance (m)", "number"), col("status", "Status", "status", { groupable: true })],
    rows: [
      { date: "2026-10-19", carer: "James O.", patient: "Robert Chen", distance: 240, status: "flagged" }, { date: "2026-10-18", carer: "Emma D.", patient: "Patricia Smith", distance: 135, status: "cleared" },
      { date: "2026-10-16", carer: "Michael B.", patient: "David Wilson", distance: 310, status: "flagged" }, { date: "2026-10-14", carer: "Laura M.", patient: "Susan Taylor", distance: 118, status: "cleared" },
    ],
    chart: { kind: "table", xKey: "carer", yKeys: [] },
  },
];
