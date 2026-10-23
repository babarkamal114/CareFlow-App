import type { ReportDataset } from "types";
import { col, ROLES_FINANCE } from "./reports-dataset-helpers";

export const financeDatasets: ReportDataset[] = [
  {
    id: "revenue-overview", domain: "finance", title: "Revenue overview", description: "Invoiced, collected, outstanding and overdue", source: "Blueprint 5.5", roles: ROLES_FINANCE,
    columns: [col("measure", "Measure", "text", { groupable: true }), col("amount", "Amount", "currency")],
    rows: [{ measure: "Invoiced", amount: 42500 }, { measure: "Collected", amount: 21400 }, { measure: "Outstanding", amount: 21100 }, { measure: "Overdue", amount: 8000 }],
    chart: { kind: "bar", xKey: "measure", yKeys: ["amount"] },
  },
  {
    id: "revenue-ageing", domain: "finance", title: "Outstanding invoices by age", description: "Ageing analysis of unpaid invoices", source: "Blueprint 5.5", roles: ROLES_FINANCE,
    columns: [col("bucket", "Age", "text", { groupable: true }), col("amount", "Outstanding", "currency"), col("invoices", "Invoices", "number")],
    rows: [{ bucket: "Not yet due", amount: 13100, invoices: 9 }, { bucket: "1–14 days late", amount: 4200, invoices: 3 }, { bucket: "15–30 days late", amount: 2300, invoices: 2 }, { bucket: "31–60 days late", amount: 1000, invoices: 1 }, { bucket: "60+ days late", amount: 500, invoices: 1 }],
    chart: { kind: "bar", xKey: "bucket", yKeys: ["amount"] },
  },
  {
    id: "revenue-by-funding", domain: "finance", title: "Revenue by funding source", description: "Invoiced and collected by funder", source: "Blueprint 3.6.2", roles: ROLES_FINANCE,
    columns: [col("source", "Funding source", "text", { groupable: true }), col("invoiced", "Invoiced", "currency"), col("collected", "Collected", "currency")],
    rows: [{ source: "Local Authority", invoiced: 21900, collected: 11200 }, { source: "NHS CHC", invoiced: 12600, collected: 6900 }, { source: "Private", invoiced: 8000, collected: 3300 }],
    chart: { kind: "donut", xKey: "source", yKeys: ["invoiced"] },
  },
  {
    id: "budget-vs-actual", domain: "finance", title: "Budget vs actual", description: "Planned against actual hours and revenue", source: "Blueprint 5.5", roles: ROLES_FINANCE,
    columns: [col("month", "Month", "text", { groupable: true }), col("plannedHours", "Planned hours", "number"), col("actualHours", "Actual hours", "number"), col("plannedRevenue", "Planned revenue", "currency"), col("actualRevenue", "Actual revenue", "currency")],
    rows: [{ month: "Jul", plannedHours: 1480, actualHours: 1452, plannedRevenue: 36000, actualRevenue: 35600 }, { month: "Aug", plannedHours: 1560, actualHours: 1588, plannedRevenue: 37500, actualRevenue: 38100 }, { month: "Sep", plannedHours: 1640, actualHours: 1655, plannedRevenue: 40000, actualRevenue: 40400 }, { month: "Oct", plannedHours: 1700, actualHours: 1721, plannedRevenue: 42000, actualRevenue: 42500 }],
    chart: { kind: "bar", xKey: "month", yKeys: ["plannedRevenue", "actualRevenue"] },
  },
  {
    id: "cash-flow", domain: "finance", title: "Cash flow projection", description: "Expected receipts from outstanding invoices and payment history", source: "Blueprint 5.5", roles: ROLES_FINANCE,
    columns: [col("week", "Week", "text", { groupable: true }), col("expected", "Expected receipts", "currency"), col("cumulative", "Cumulative", "currency")],
    rows: [3200, 5400, 4100, 6200, 2800, 3900, 2500, 1800].reduce<{ week: string; expected: number; cumulative: number }[]>((acc, expected, i) => [...acc, { week: `Wk ${43 + i}`, expected, cumulative: (acc[i - 1]?.cumulative ?? 0) + expected }], []),
    chart: { kind: "line", xKey: "week", yKeys: ["cumulative"] },
  },
  {
    id: "late-paying-funders", domain: "finance", title: "Late-paying funders", description: "Which payers consistently pay late", source: "Blueprint 10.3", roles: ROLES_FINANCE,
    columns: [col("funder", "Funder", "text", { groupable: true }), col("avgDaysLate", "Avg days late", "number"), col("overdue", "Overdue", "currency"), col("invoices", "Invoices", "number")],
    rows: [{ funder: "Local Authority (North)", avgDaysLate: 17, overdue: 6400, invoices: 4 }, { funder: "Local Authority (South)", avgDaysLate: 9, overdue: 1900, invoices: 2 }, { funder: "Private clients", avgDaysLate: 6, overdue: 1600, invoices: 5 }, { funder: "NHS CHC", avgDaysLate: 2, overdue: 0, invoices: 1 }],
    chart: { kind: "bar", xKey: "funder", yKeys: ["avgDaysLate"] },
  },
  {
    id: "pnl-monthly", domain: "finance", title: "Monthly P&L", description: "Revenue, direct costs and gross margin", source: "Blueprint 3.6.3", roles: ROLES_FINANCE,
    columns: [col("month", "Month", "text", { groupable: true }), col("revenue", "Revenue", "currency"), col("directCosts", "Direct costs", "currency"), col("grossMargin", "Gross margin", "currency"), col("marginPct", "Margin", "percent")],
    rows: [["May", 31200, 20270], ["Jun", 33800, 21810], ["Jul", 35600, 22820], ["Aug", 38100, 24340], ["Sep", 40400, 25670], ["Oct", 42500, 26890]].map(([month, revenue, directCosts]) => ({
      month, revenue, directCosts, grossMargin: Number(revenue) - Number(directCosts), marginPct: Math.round(((Number(revenue) - Number(directCosts)) / Number(revenue)) * 1000) / 10,
    })),
    chart: { kind: "line", xKey: "month", yKeys: ["revenue", "grossMargin"] },
  },
];
