// Column definitions for the four reports (Blueprint 3.6.3). Each feeds <ProfitabilityTable/>.

import { MarginBadge, MoneyCell, type ProfitabilityColumn } from "@/components/ui";
import type { AreaProfitability, CarerCostRecord, PatientProfitability } from "types";
import {
  formatCurrency,
  getAreaCost,
  getAreaProfit,
  getCarerNet,
  getCarerTotalCost,
  getMarginPct,
  getPatientCost,
  getPatientProfit,
} from "utils";

const money = (value: number) => formatCurrency(value, true);
const name = (value: string) => <span className="font-medium text-cf-ink">{value}</span>;

export const PATIENT_COLUMNS: ProfitabilityColumn<PatientProfitability>[] = [
  { key: "patient", header: "Patient", render: (r) => name(r.patientName) },
  { key: "revenue", header: "Revenue", align: "right", render: (r) => money(r.revenue) },
  { key: "pay", header: "Carer pay", align: "right", render: (r) => money(r.carerPay) },
  { key: "travel", header: "Travel", align: "right", render: (r) => money(r.travelCost) },
  { key: "overheads", header: "Overheads", align: "right", render: (r) => money(r.overheads) },
  { key: "profit", header: "Profit", align: "right", render: (r) => <MoneyCell value={getPatientProfit(r)} /> },
  {
    key: "margin",
    header: "Margin",
    align: "right",
    render: (r) => <MarginBadge pct={getMarginPct(r.revenue, getPatientCost(r))} />,
  },
];

export const AREA_COLUMNS: ProfitabilityColumn<AreaProfitability>[] = [
  { key: "area", header: "Area", render: (r) => name(r.area) },
  { key: "visits", header: "Visits", align: "right", render: (r) => r.visits.toLocaleString("en-GB") },
  { key: "revenue", header: "Revenue", align: "right", render: (r) => money(r.revenue) },
  { key: "pay", header: "Carer pay", align: "right", render: (r) => money(r.carerPay) },
  { key: "travel", header: "Travel", align: "right", render: (r) => money(r.travelCost) },
  { key: "profit", header: "Profit", align: "right", render: (r) => <MoneyCell value={getAreaProfit(r)} /> },
  {
    key: "perVisit",
    header: "Profit / visit",
    align: "right",
    render: (r) => formatCurrency(r.visits > 0 ? getAreaProfit(r) / r.visits : 0),
  },
  { key: "travelMins", header: "Avg travel", align: "right", render: (r) => `${r.avgTravelMins} min` },
  {
    key: "margin",
    header: "Margin",
    align: "right",
    render: (r) => <MarginBadge pct={getMarginPct(r.revenue, getAreaCost(r))} />,
  },
];

export const CARER_COLUMNS: ProfitabilityColumn<CarerCostRecord>[] = [
  { key: "carer", header: "Carer", render: (r) => name(r.carerName) },
  { key: "hours", header: "Hours", align: "right", render: (r) => r.hoursWorked },
  { key: "pay", header: "Pay", align: "right", render: (r) => money(r.pay) },
  { key: "travel", header: "Travel", align: "right", render: (r) => money(r.travel) },
  { key: "expenses", header: "Expenses", align: "right", render: (r) => money(r.expenses) },
  { key: "total", header: "Total cost", align: "right", render: (r) => money(getCarerTotalCost(r)) },
  { key: "revenue", header: "Revenue generated", align: "right", render: (r) => money(r.revenueGenerated) },
  { key: "net", header: "Net", align: "right", render: (r) => <MoneyCell value={getCarerNet(r)} /> },
  {
    key: "margin",
    header: "Margin",
    align: "right",
    render: (r) => <MarginBadge pct={getMarginPct(r.revenueGenerated, getCarerTotalCost(r))} />,
  },
];