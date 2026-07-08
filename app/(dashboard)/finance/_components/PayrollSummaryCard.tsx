// app/(dashboard)/finance/_components/PayrollSummaryCard.tsx
// Right-sidebar card — quick glance at what's owed per carer this pay period.
// Rows fade/slide in with a stagger on mount, matching the entrance pattern
// used elsewhere on the Finance page (InvoicesTable, NeedsAttentionCard).

"use client"

import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────
export interface PayrollEntry {
  id: string
  carerName: string
  amount: number
  initials: string
  avatarColor: string // tailwind bg class, e.g. "bg-teal-500"
}

interface PayrollSummaryCardProps {
  entries: PayrollEntry[]
  onViewAll?: () => void
}

function gbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Main export ───────────────────────────────────────────────────────────
export default function PayrollSummaryCard({ entries, onViewAll }: PayrollSummaryCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Payroll summary</h2>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-semibold text-[#00C48C] hover:underline">
            View all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${entry.avatarColor}`}
              >
                {entry.initials}
              </span>
              <span className="text-xs text-[#111318]">{entry.carerName}</span>
            </div>
            <span className="text-xs font-semibold text-[#111318]">{gbp(entry.amount)}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
