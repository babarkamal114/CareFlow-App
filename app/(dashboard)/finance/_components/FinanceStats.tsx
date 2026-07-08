// app/(dashboard)/finance/_components/FinanceStats.tsx
// Four top-level KPI cards: Revenue MTD, Outstanding, Payroll Due, Collection Rate
// Built on the shared StatCard primitive (components/ui/stat-card.tsx) so it
// stays consistent with the design-system tokens (brand/blue/amber/red tones).
// Cards fade/slide in with a stagger, and the big numbers count up on mount.

"use client"

import { motion } from "framer-motion"
import { Wallet, AlertCircle, Banknote, PieChart } from "lucide-react"

import {
  StatCard,
  StatCardHeader,
  StatCardIcon,
  StatCardLabel,
  StatCardValue,
  StatCardTrend,
} from "@/components/ui/stat-card"
import { ProgressRing } from "@/components/ui/progress-ring"
import { CountUp } from "@/components/ui/count-up"

// ── Types ─────────────────────────────────────────────────────────────────
export interface FinanceStatsData {
  revenueMtd: number
  revenueTrendPct: number // e.g. 8.2 means "+8.2% vs last month"
  outstandingAmount: number
  overdueInvoiceCount: number
  payrollDueAmount: number
  payrollDueDate: string // e.g. "18 April"
  collectionRatePct: number // 0–100
}

interface FinanceStatsProps {
  data: FinanceStatsData
}

// ── Currency helper ──────────────────────────────────────────────────────
function gbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount)
}

const cardMotion = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
})

// ── Main export ───────────────────────────────────────────────────────────
export default function FinanceStats({ data }: FinanceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {/* Revenue MTD */}
      <motion.div {...cardMotion(0)}>
        <StatCard>
          <StatCardHeader>
            <StatCardIcon tone="brand">
              <Wallet size={18} />
            </StatCardIcon>
          </StatCardHeader>
          <StatCardLabel>Revenue &middot; MTD</StatCardLabel>
          <StatCardValue>
            <CountUp value={data.revenueMtd} format={gbp} />
          </StatCardValue>
          <StatCardTrend>
            <span className="font-semibold text-[#00C48C]">
              &#8593; {data.revenueTrendPct}%
            </span>
            <span>vs last month</span>
          </StatCardTrend>
        </StatCard>
      </motion.div>

      {/* Outstanding */}
      <motion.div {...cardMotion(0.05)}>
        <StatCard>
          <StatCardHeader>
            <StatCardIcon tone="red">
              <AlertCircle size={18} />
            </StatCardIcon>
          </StatCardHeader>
          <StatCardLabel>Outstanding</StatCardLabel>
          <StatCardValue>
            <CountUp value={data.outstandingAmount} format={gbp} />
          </StatCardValue>
          <StatCardTrend>
            <span className="font-semibold text-[#A82B2B]">
              {data.overdueInvoiceCount} invoices overdue
            </span>
          </StatCardTrend>
        </StatCard>
      </motion.div>

      {/* Payroll due */}
      <motion.div {...cardMotion(0.1)}>
        <StatCard>
          <StatCardHeader>
            <StatCardIcon tone="amber">
              <Banknote size={18} />
            </StatCardIcon>
          </StatCardHeader>
          <StatCardLabel>Payroll due</StatCardLabel>
          <StatCardValue>
            <CountUp value={data.payrollDueAmount} format={gbp} />
          </StatCardValue>
          <StatCardTrend>
            <span>Next run {data.payrollDueDate}</span>
          </StatCardTrend>
        </StatCard>
      </motion.div>

      {/* Collection rate — ring instead of trend text */}
      <motion.div {...cardMotion(0.15)}>
        <StatCard>
          <StatCardHeader>
            <StatCardIcon tone="brand">
              <PieChart size={18} />
            </StatCardIcon>
            <ProgressRing value={data.collectionRatePct} size={34} strokeWidth={3} />
          </StatCardHeader>
          <StatCardLabel>Collection rate</StatCardLabel>
          <StatCardValue>
            <CountUp value={data.collectionRatePct} format={(v) => `${Math.round(v)}%`} />
          </StatCardValue>
        </StatCard>
      </motion.div>
    </div>
  )
}
