import type {
  AreaProfitability,
  CarerCostRecord,
  DayType,
  FundingSource,
  Invoice,
  InvoiceFilters,
  InvoiceStatus,
  PatientProfitability,
  PnlMonth,
  RateCardEntry,
  RevenueByFunding,
  RevenueSummary,
  VisitDuration,
} from "types";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const gbpWhole = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const formatCurrency = (amount: number, whole = false): string =>
  (whole ? gbpWhole : gbp).format(amount);

export const formatShortDate = (date: Date | string | null | undefined): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatPercent = (value: number): string => `${Math.round(value)}%`;

const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// ---- Invoices ----

export const getInvoiceBalance = (invoice: Invoice): number => round2(invoice.subtotal - invoice.amountPaid);

export function getInvoiceDisplayStatus(invoice: Invoice, asOf: Date = new Date()): InvoiceStatus {
  if (invoice.status === "draft") return "draft";
  if (getInvoiceBalance(invoice) <= 0) return "paid";
  if (startOfDay(invoice.dueDate) < startOfDay(asOf)) return "overdue";
  return invoice.status === "overdue" ? "overdue" : invoice.status;
}

export function getDaysOverdue(invoice: Invoice, asOf: Date = new Date()): number {
  if (getInvoiceDisplayStatus(invoice, asOf) !== "overdue") return 0;
  return Math.max(0, Math.floor((startOfDay(asOf).getTime() - startOfDay(invoice.dueDate).getTime()) / 86400000));
}

export function filterInvoices(invoices: Invoice[], filters: InvoiceFilters, asOf: Date = new Date()): Invoice[] {
  const q = filters.search.trim().toLowerCase();
  return invoices.filter((inv) => {
    if (filters.status !== "all" && getInvoiceDisplayStatus(inv, asOf) !== filters.status) return false;
    if (filters.funding !== "all" && inv.fundingSource !== filters.funding) return false;
    if (!q) return true;
    return inv.number.toLowerCase().includes(q) || inv.patientName.toLowerCase().includes(q);
  });
}

export function countInvoicesByStatus(invoices: Invoice[], asOf: Date = new Date()): Record<InvoiceStatus | "all", number> {
  const counts: Record<InvoiceStatus | "all", number> = {
    all: invoices.length, draft: 0, sent: 0, "partially-paid": 0, paid: 0, overdue: 0,
  };
  invoices.forEach((inv) => { counts[getInvoiceDisplayStatus(inv, asOf)] += 1; });
  return counts;
}

// ---- Revenue dashboard (3.6.2) ----

export function summarizeRevenue(invoices: Invoice[], asOf: Date = new Date()): RevenueSummary {
  const issued = invoices.filter((inv) => inv.status !== "draft");
  const invoiced = issued.reduce((s, inv) => s + inv.subtotal, 0);
  const collected = issued.reduce((s, inv) => s + inv.amountPaid, 0);
  const overdue = issued
    .filter((inv) => getInvoiceDisplayStatus(inv, asOf) === "overdue")
    .reduce((s, inv) => s + getInvoiceBalance(inv), 0);
  return {
    invoiced: round2(invoiced),
    collected: round2(collected),
    outstanding: round2(invoiced - collected),
    overdue: round2(overdue),
  };
}

const FUNDING_ORDER: FundingSource[] = ["local-authority", "nhs-chc", "private"];

export function getRevenueByFunding(invoices: Invoice[], asOf: Date = new Date()): RevenueByFunding[] {
  return FUNDING_ORDER.map((fundingSource) => ({
    fundingSource,
    ...summarizeRevenue(invoices.filter((inv) => inv.fundingSource === fundingSource), asOf),
  }));
}

export const getCollectionRate = (s: RevenueSummary): number =>
  s.invoiced > 0 ? (s.collected / s.invoiced) * 100 : 0;

// ---- Rates (3.6.1) ----

export function findRate(rates: RateCardEntry[], durationMins: VisitDuration, dayType: DayType): number {
  return rates.find((r) => r.durationMins === durationMins && r.dayType === dayType)?.rate ?? 0;
}

// ---- Reports (3.6.3) ----

export const getMarginPct = (revenue: number, cost: number): number =>
  revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;

export const getPatientCost = (p: PatientProfitability): number => p.carerPay + p.travelCost + p.overheads;
export const getPatientProfit = (p: PatientProfitability): number => round2(p.revenue - getPatientCost(p));

export const getAreaCost = (a: AreaProfitability): number => a.carerPay + a.travelCost;
export const getAreaProfit = (a: AreaProfitability): number => round2(a.revenue - getAreaCost(a));

export const getCarerTotalCost = (c: CarerCostRecord): number => c.pay + c.travel + c.expenses;
export const getCarerNet = (c: CarerCostRecord): number => round2(c.revenueGenerated - getCarerTotalCost(c));

export const getPnlDirectCosts = (m: PnlMonth): number => m.carerPay + m.travelCosts + m.expenses;
export const getPnlGrossMargin = (m: PnlMonth): number => round2(m.revenue - getPnlDirectCosts(m));
export const getPnlMarginPct = (m: PnlMonth): number => getMarginPct(m.revenue, getPnlDirectCosts(m));