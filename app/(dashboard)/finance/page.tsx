// app/(dashboard)/finance/page.tsx
// Finance page — mirrors the Dashboard's layout rhythm:
// header -> KPI row -> [main table + sidebar cards] -> chart row.
// Data below is static sample data; swap for real fetches when the API is ready.

import FinanceHeader from "./_components/FinanceHeader"
import FinanceStats from "./_components/FinanceStats"
import InvoicesTable, { type Invoice } from "./_components/InvoicesTable"
import NeedsAttentionCard, { type AttentionItem } from "./_components/NeedsAttentionCard"
import PayrollSummaryCard, { type PayrollEntry } from "./_components/PayrollSummaryCard"
import RevenueExpenseChart, {
  type RevenueExpensePoint,
} from "./_components/RevenueExpenseChart"
import RevenueByServiceCard, {
  type ServiceRevenueShare,
} from "./_components/RevenueByServiceCard"
import FundingSourceCard, { type FundingSourceShare } from "./_components/FundingSourceCard"

// ── Sample data ─────────────────────────────────────────────────────────
// payerType/payerName reflect who's actually billed — a patient (Private),
// a local authority (LA, e.g. a council), or NHS Continuing Healthcare (CHC).
const invoices: Invoice[] = [
  { id: "1", clientName: "Margaret Johnson", invoiceNumber: "INV-1042", amount: 620, dueDate: "12 Apr", status: "Paid", payerType: "Private" },
  { id: "2", clientName: "Dorothy Chen", invoiceNumber: "INV-1039", amount: 980, dueDate: "2 Apr", status: "Overdue", payerType: "LA", payerName: "Southampton City Council" },
  { id: "3", clientName: "Robert Ahmed", invoiceNumber: "INV-1044", amount: 410, dueDate: "16 Apr", status: "Pending", payerType: "Private" },
  { id: "4", clientName: "Arthur Wilson", invoiceNumber: "INV-1030", amount: 1150, dueDate: "3 Apr", status: "Paid", payerType: "CHC", payerName: "NHS Hampshire ICB" },
]

const attentionItems: AttentionItem[] = [
  { id: "1", severity: "critical", message: "Dorothy Chen invoice 4 days overdue", timeAgo: "1h" },
  { id: "2", severity: "warning", message: "Joan Lewis payment method expiring", timeAgo: "Today" },
  { id: "3", severity: "warning", message: "2 CHC claims pending submission", timeAgo: "2d" },
]

const payrollEntries: PayrollEntry[] = [
  { id: "1", carerName: "Sarah W.", amount: 2140, initials: "SW", avatarColor: "bg-teal-500" },
  { id: "2", carerName: "Priya P.", amount: 1980, initials: "PP", avatarColor: "bg-violet-500" },
  { id: "3", carerName: "James O.", amount: 1410, initials: "JO", avatarColor: "bg-emerald-500" },
]

const revenueExpenseData: RevenueExpensePoint[] = [
  { label: "Nov", revenuePct: 55 },
  { label: "Dec", revenuePct: 62 },
  { label: "Jan", revenuePct: 58 },
  { label: "Feb", revenuePct: 70 },
  { label: "Mar", revenuePct: 66 },
  { label: "Apr", revenuePct: 80, isCurrent: true },
]

const serviceRevenue: ServiceRevenueShare[] = [
  { label: "Personal care", pct: 70 },
  { label: "Medication", pct: 45 },
  { label: "Nutrition", pct: 30 },
]

const fundingSources: FundingSourceShare[] = [
  { label: "Private pay", pct: 61, dotColor: "bg-[#00C48C]" },
  { label: "LA funded", pct: 27, dotColor: "bg-[#3574D4]" },
  { label: "CHC funded", pct: 12, dotColor: "bg-[#F59E0B]" },
]

// ── Main export ───────────────────────────────────────────────────────────
export default function FinancePage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <FinanceHeader />

      <FinanceStats
        data={{
          revenueMtd: 42380,
          revenueTrendPct: 8.2,
          outstandingAmount: 8230,
          overdueInvoiceCount: 3,
          payrollDueAmount: 28400,
          payrollDueDate: "18 April",
          collectionRatePct: 81,
        }}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        <InvoicesTable invoices={invoices} />
        <div className="flex flex-col gap-5">
          <NeedsAttentionCard items={attentionItems} />
          <PayrollSummaryCard entries={payrollEntries} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RevenueExpenseChart data={revenueExpenseData} />
        <RevenueByServiceCard services={serviceRevenue} />
        <FundingSourceCard sources={fundingSources} />
      </div>
    </div>
  )
}
