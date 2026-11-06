// Domain types for the Finance module (Blueprint 3.6). All money is stored in GBP pounds (not pence).

export type FundingSource = "private" | "local-authority" | "nhs-chc";
export type InvoiceStatus = "draft" | "sent" | "partially-paid" | "paid" | "overdue";
export type PaymentMethod = "card" | "direct-debit" | "bank-transfer";
export type BillingPeriodType = "weekly" | "fortnightly" | "monthly";
export type VisitDuration = 15 | 30 | 45 | 60;
export type DayType = "weekday" | "weekend" | "bank-holiday" | "unsocial";
export type FinanceTab = "overview" | "invoices" | "payments" | "rates" | "reports";
export type FinanceReportTab = "patients" | "areas" | "carers" | "pnl";

export interface InvoiceLine {
  id: string;
  visitDate: Date;
  description: string;
  durationMins: VisitDuration;
  dayType: DayType;
  unitRate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  patientId: string;
  patientName: string;
  fundingSource: FundingSource;
  payerName: string;
  periodStart: Date;
  periodEnd: Date;
  issueDate: Date;
  dueDate: Date;
  lines: InvoiceLine[];
  subtotal: number;
  amountPaid: number;
  status: InvoiceStatus;
  /** True when the same patient is billed to more than one funder. */
  isSplitBilled: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  patientName: string;
  fundingSource: FundingSource;
  amount: number;
  method: PaymentMethod;
  receivedDate: Date;
  reference: string;
}

export interface RateCardEntry {
  id: string;
  durationMins: VisitDuration;
  dayType: DayType;
  rate: number;
}

export interface RevenueSummary {
  invoiced: number;
  collected: number;
  outstanding: number;
  overdue: number;
}

export interface RevenueByFunding extends RevenueSummary {
  fundingSource: FundingSource;
}

export interface MonthlyRevenuePoint {
  month: string;
  invoiced: number;
  collected: number;
}

export interface InvoiceFilters {
  search: string;
  status: InvoiceStatus | "all";
  funding: FundingSource | "all";
}

// ---- Reports (3.6.3) ----

export interface PatientProfitability {
  patientId: string;
  patientName: string;
  revenue: number;
  carerPay: number;
  travelCost: number;
  overheads: number;
}

export interface AreaProfitability {
  area: string;
  visits: number;
  revenue: number;
  carerPay: number;
  travelCost: number;
  avgTravelMins: number;
}

export interface CarerCostRecord {
  carerId: string;
  carerName: string;
  hoursWorked: number;
  pay: number;
  travel: number;
  expenses: number;
  revenueGenerated: number;
}

export interface PnlMonth {
  month: string;
  revenue: number;
  carerPay: number;
  travelCosts: number;
  expenses: number;
}

// ---- Forms (validated with zod in lib/validations/finance) ----

export type FinanceFormErrors = Partial<Record<string, string>>;

export interface GenerateInvoicesFormData {
  periodType: BillingPeriodType | "";
  periodStart: string;
  periodEnd: string;
  fundingSources: FundingSource[];
  sendImmediately: boolean;
}

export interface RecordPaymentFormData {
  invoiceId: string;
  amount: number | "";
  method: PaymentMethod | "";
  receivedDate: string;
  reference: string;
}

export interface RateFormData {
  durationMins: VisitDuration | "";
  dayType: DayType | "";
  rate: number | "";
}