// app/(dashboard)/finance/_components/InvoicesTable.tsx
// Main invoices list with status filter tabs (All / Paid / Pending / Overdue).
// Now includes a "Billed to" column since the payer isn't always the patient —
// LA-funded and CHC-funded invoices are billed to the council/NHS body instead.
// Animated with Framer Motion: staggered row entrance + animated tab underline.

"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ── Types ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = "Paid" | "Pending" | "Overdue"
export type PayerType = "Private" | "LA" | "CHC"

export interface Invoice {
  id: string
  clientName: string // the patient receiving care
  invoiceNumber: string
  amount: number
  dueDate: string // display string, e.g. "12 Apr"
  status: InvoiceStatus
  payerType: PayerType
  payerName?: string // e.g. "Southampton City Council" — only set for LA/CHC
}

interface InvoicesTableProps {
  invoices: Invoice[]
  onInvoiceClick?: (invoice: Invoice) => void
}

const TABS: Array<"All" | InvoiceStatus> = ["All", "Paid", "Pending", "Overdue"]

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: "bg-[#E6FAF4] text-[#00875A]",
  Pending: "bg-[#FFF4E5] text-[#916408]",
  Overdue: "bg-[#FDEDED] text-[#A82B2B]",
}

const PAYER_STYLES: Record<PayerType, string> = {
  Private: "bg-[#F0F1F5] text-[#5C5F6A]",
  LA: "bg-[#EBF2FC] text-[#2258A6]",
  CHC: "bg-[#F3EEFC] text-[#6B3FB8]",
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  )
}

// "Billed to" cell — shows patient name for Private pay, or the funding
// body's name (with a small payer-type tag) for LA/CHC invoices.
function BilledToCell({ invoice }: { invoice: Invoice }) {
  if (invoice.payerType === "Private") {
    return <span className="text-[#5C5F6A]">{invoice.clientName}</span>
  }
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-[#111318]">{invoice.payerName}</span>
      <span
        className={cn(
          "inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
          PAYER_STYLES[invoice.payerType]
        )}
      >
        {invoice.payerType === "LA" ? "Local Authority" : "NHS CHC"}
      </span>
    </div>
  )
}

function gbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Main export ───────────────────────────────────────────────────────────
export default function InvoicesTable({ invoices, onInvoiceClick }: InvoicesTableProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All")

  const filtered = useMemo(
    () =>
      activeTab === "All"
        ? invoices
        : invoices.filter((inv) => inv.status === activeTab),
    [invoices, activeTab]
  )

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Invoices</h2>
        <div className="relative flex items-center gap-3 text-xs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative pb-1 font-medium text-[#8B8FA8] transition-colors hover:text-[#111318]",
                activeTab === tab && "text-[#00C48C]"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="invoice-tab-underline"
                  className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-[#00C48C]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <Table variant="data">
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Billed to</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((invoice, i) => (
              <motion.tr
                key={invoice.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={cn(
                  "cursor-pointer border-b border-[#F0F1F5] transition-colors last:border-0 hover:bg-[#FAFBFC]"
                )}
                onClick={() => onInvoiceClick?.(invoice)}
              >
                <TableCell className="font-medium text-[#111318]">
                  {invoice.clientName}
                </TableCell>
                <TableCell>
                  <BilledToCell invoice={invoice} />
                </TableCell>
                <TableCell className="text-[#5C5F6A]">{invoice.invoiceNumber}</TableCell>
                <TableCell>{gbp(invoice.amount)}</TableCell>
                <TableCell
                  className={cn(
                    invoice.status === "Overdue" ? "font-medium text-[#A82B2B]" : "text-[#5C5F6A]"
                  )}
                >
                  {invoice.dueDate}
                </TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell>
                  <MoreHorizontal size={16} className="text-[#A0A3B1]" />
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </Card>
  )
}
