import type {
  AreaProfitability,
  CarerCostRecord,
  DayType,
  FundingSource,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  MonthlyRevenuePoint,
  Payment,
  PaymentMethod,
  PatientProfitability,
  PnlMonth,
  RateCardEntry,
  VisitDuration,
} from "types";

export const FINANCE_MOCK_TODAY = new Date(2026, 9, 8);

function daysFromToday(days: number): Date {
  const d = new Date(FINANCE_MOCK_TODAY);
  d.setDate(d.getDate() + days);
  return d;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const DURATIONS: VisitDuration[] = [15, 30, 45, 60];
const DAY_TYPES: DayType[] = ["weekday", "weekend", "bank-holiday", "unsocial"];
const BASE_HOURLY_RATE = 24;
const DAY_MULTIPLIER: Record<DayType, number> = {
  weekday: 1,
  weekend: 1.25,
  "bank-holiday": 1.5,
  unsocial: 1.35,
};

export const mockRateCard: RateCardEntry[] = DAY_TYPES.flatMap((dayType) =>
  DURATIONS.map((durationMins) => ({
    id: `rate-${dayType}-${durationMins}`,
    durationMins,
    dayType,
    rate: round2(BASE_HOURLY_RATE * (durationMins / 60) * DAY_MULTIPLIER[dayType]),
  })),
);

function rateFor(durationMins: VisitDuration, dayType: DayType): number {
  return mockRateCard.find((r) => r.durationMins === durationMins && r.dayType === dayType)?.rate ?? 0;
}

// ---- Invoices ----
const PATIENTS = [
  "Margaret Johnson",
  "Robert Chen",
  "Patricia Smith",
  "David Wilson",
  "Susan Taylor",
  "Edna Morris",
  "Dorothy Chen",
  "James Okafor",
];

const PAYER_NAMES: Record<FundingSource, string> = {
  private: "Private client",
  "local-authority": "Local Authority",
  "nhs-chc": "NHS Continuing Healthcare",
};

const PAYMENT_TERMS_DAYS: Record<FundingSource, number> = {
  private: 14,
  "local-authority": 30,
  "nhs-chc": 30,
};

interface InvoiceSeed {
  patient: number;
  funding: FundingSource;
  status: InvoiceStatus;
  issuedDaysAgo: number;
  visits: number;
}

const SEEDS: InvoiceSeed[] = [
  { patient: 0, funding: "local-authority", status: "paid", issuedDaysAgo: 40, visits: 14 },
  { patient: 0, funding: "private", status: "paid", issuedDaysAgo: 40, visits: 4 },
  { patient: 1, funding: "local-authority", status: "overdue", issuedDaysAgo: 62, visits: 12 },
  { patient: 2, funding: "nhs-chc", status: "paid", issuedDaysAgo: 35, visits: 10 },
  { patient: 2, funding: "private", status: "partially-paid", issuedDaysAgo: 10, visits: 3 },
  { patient: 3, funding: "private", status: "overdue", issuedDaysAgo: 38, visits: 8 },
  { patient: 4, funding: "local-authority", status: "sent", issuedDaysAgo: 5, visits: 12 },
  { patient: 5, funding: "nhs-chc", status: "partially-paid", issuedDaysAgo: 12, visits: 14 },
  { patient: 6, funding: "private", status: "draft", issuedDaysAgo: 1, visits: 6 },
  { patient: 7, funding: "local-authority", status: "overdue", issuedDaysAgo: 75, visits: 9 },
  { patient: 4, funding: "private", status: "paid", issuedDaysAgo: 28, visits: 6 },
  { patient: 6, funding: "local-authority", status: "sent", issuedDaysAgo: 3, visits: 10 },
];

function buildLines(seed: InvoiceSeed, index: number, periodStart: Date): InvoiceLine[] {
  return Array.from({ length: seed.visits }, (_, i) => {
    const dayType: DayType = i % 9 === 8 ? "unsocial" : i % 7 >= 5 ? "weekend" : "weekday";
    const durationMins = DURATIONS[(i + seed.patient) % DURATIONS.length];
    const visitDate = new Date(periodStart);
    visitDate.setDate(visitDate.getDate() + Math.floor((i * 14) / seed.visits));
    const unitRate = rateFor(durationMins, dayType);
    return {
      id: `line-${index}-${i}`,
      visitDate,
      description: `${durationMins}-min ${dayType.replace("-", " ")} visit`,
      durationMins,
      dayType,
      unitRate,
      amount: unitRate,
    };
  });
}

function buildInvoice(seed: InvoiceSeed, index: number): Invoice {
  const periodEnd = daysFromToday(-(seed.issuedDaysAgo + 1));
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 13);
  const lines = buildLines(seed, index, periodStart);
  const subtotal = round2(lines.reduce((sum, l) => sum + l.amount, 0));
  const issueDate = daysFromToday(-seed.issuedDaysAgo);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + PAYMENT_TERMS_DAYS[seed.funding]);
  const fundersForPatient = new Set(SEEDS.filter((s) => s.patient === seed.patient).map((s) => s.funding));

  return {
    id: `inv-${index + 1}`,
    number: `INV-2026-${1001 + index}`,
    patientId: `p-${seed.patient + 1}`,
    patientName: PATIENTS[seed.patient],
    fundingSource: seed.funding,
    payerName: PAYER_NAMES[seed.funding],
    periodStart,
    periodEnd,
    issueDate,
    dueDate,
    lines,
    subtotal,
    amountPaid: seed.status === "paid" ? subtotal : seed.status === "partially-paid" ? round2(subtotal * 0.5) : 0,
    status: seed.status,
    isSplitBilled: fundersForPatient.size > 1,
  };
}

export const mockInvoices: Invoice[] = SEEDS.map(buildInvoice);

// ---- Payments (one per invoice that has money against it) ----
function methodFor(funding: FundingSource, index: number): PaymentMethod {
  if (funding !== "private") return "bank-transfer";
  return index % 2 === 0 ? "card" : "direct-debit";
}

export const mockPayments: Payment[] = mockInvoices
  .map((inv, i) => ({ inv, i }))
  .filter(({ inv }) => inv.amountPaid > 0)
  .map(({ inv, i }) => {
    const received = new Date(inv.issueDate);
    received.setDate(received.getDate() + 9);
    return {
      id: `pay-${i + 1}`,
      invoiceId: inv.id,
      invoiceNumber: inv.number,
      patientName: inv.patientName,
      fundingSource: inv.fundingSource,
      amount: inv.amountPaid,
      method: methodFor(inv.fundingSource, i),
      receivedDate: received > FINANCE_MOCK_TODAY ? FINANCE_MOCK_TODAY : received,
      reference: `PAY-${2001 + i}`,
    };
  });

// ---- Overview chart ----
export const mockRevenueTrend: MonthlyRevenuePoint[] = [
  { month: "May", invoiced: 31200, collected: 27800 },
  { month: "Jun", invoiced: 33800, collected: 31500 },
  { month: "Jul", invoiced: 35600, collected: 32900 },
  { month: "Aug", invoiced: 38100, collected: 34200 },
  { month: "Sep", invoiced: 40400, collected: 36800 },
  { month: "Oct", invoiced: 42500, collected: 21400 },
];

// ---- Reports ----
export const mockPatientProfitability: PatientProfitability[] = [
  { patientId: "p-1", patientName: "Margaret Johnson", revenue: 2840, carerPay: 1620, travelCost: 190, overheads: 340 },
  { patientId: "p-2", patientName: "Robert Chen", revenue: 1960, carerPay: 1240, travelCost: 310, overheads: 235 },
  { patientId: "p-3", patientName: "Patricia Smith", revenue: 3150, carerPay: 1750, travelCost: 160, overheads: 378 },
  { patientId: "p-4", patientName: "David Wilson", revenue: 1280, carerPay: 880, travelCost: 240, overheads: 154 },
  { patientId: "p-5", patientName: "Susan Taylor", revenue: 1420, carerPay: 1010, travelCost: 380, overheads: 170 },
  { patientId: "p-6", patientName: "Edna Morris", revenue: 2210, carerPay: 1300, travelCost: 150, overheads: 265 },
  { patientId: "p-7", patientName: "Dorothy Chen", revenue: 2650, carerPay: 1480, travelCost: 210, overheads: 318 },
  { patientId: "p-8", patientName: "James Okafor", revenue: 1740, carerPay: 1050, travelCost: 280, overheads: 209 },
];

export const mockAreaProfitability: AreaProfitability[] = [
  { area: "Central", visits: 412, revenue: 14820, carerPay: 8600, travelCost: 620, avgTravelMins: 6 },
  { area: "North", visits: 301, revenue: 10980, carerPay: 6700, travelCost: 980, avgTravelMins: 11 },
  { area: "East", visits: 268, revenue: 9850, carerPay: 6100, travelCost: 1240, avgTravelMins: 14 },
  { area: "South", visits: 198, revenue: 6850, carerPay: 4380, travelCost: 1180, avgTravelMins: 17 },
];

export const mockCarerCosts: CarerCostRecord[] = [
  { carerId: "c-1", carerName: "Sarah Williams", hoursWorked: 148, pay: 2220, travel: 180, expenses: 45, revenueGenerated: 4140 },
  { carerId: "c-2", carerName: "James O'Connor", hoursWorked: 137, pay: 2050, travel: 210, expenses: 60, revenueGenerated: 3600 },
  { carerId: "c-3", carerName: "Emma Davies", hoursWorked: 132, pay: 1980, travel: 150, expenses: 30, revenueGenerated: 3920 },
  { carerId: "c-4", carerName: "Michael Turner", hoursWorked: 117, pay: 1760, travel: 260, expenses: 85, revenueGenerated: 2900 },
  { carerId: "c-5", carerName: "Laura Mitchell", hoursWorked: 141, pay: 2110, travel: 170, expenses: 40, revenueGenerated: 4010 },
  { carerId: "c-6", carerName: "Priya Patel", hoursWorked: 110, pay: 1650, travel: 320, expenses: 120, revenueGenerated: 2580 },
];

export const mockPnlMonths: PnlMonth[] = [
  { month: "May", revenue: 31200, carerPay: 18200, travelCosts: 1450, expenses: 620 },
  { month: "Jun", revenue: 33800, carerPay: 19600, travelCosts: 1520, expenses: 690 },
  { month: "Jul", revenue: 35600, carerPay: 20500, travelCosts: 1610, expenses: 710 },
  { month: "Aug", revenue: 38100, carerPay: 21900, travelCosts: 1700, expenses: 740 },
  { month: "Sep", revenue: 40400, carerPay: 23100, travelCosts: 1790, expenses: 780 },
  { month: "Oct", revenue: 42500, carerPay: 24200, travelCosts: 1880, expenses: 810 },
];