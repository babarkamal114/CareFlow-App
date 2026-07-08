// app/(dashboard)/finance/_components/RevenueExpenseChart.tsx
// Simple bar chart — revenue trend over the last N months.
// Styled to match the Dashboard's "Weekly Activity" bar chart card.
// Bars grow in with a spring animation on mount.

"use client"

import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────
export interface RevenueExpensePoint {
  label: string // e.g. "Nov"
  revenuePct: number // 0–100, height relative to the tallest bar in the set
  isCurrent?: boolean // highlights the current month in brand green
}

interface RevenueExpenseChartProps {
  data: RevenueExpensePoint[]
  title?: string
}

// ── Main export ───────────────────────────────────────────────────────────
export default function RevenueExpenseChart({
  data,
  title = "Revenue vs expenses",
}: RevenueExpenseChartProps) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-bold text-[#111318]">{title}</h2>

      <div className="flex h-[110px] items-end gap-2">
        {data.map((point, i) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${point.revenuePct}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                className="w-full rounded-t-sm"
                style={{ backgroundColor: point.isCurrent ? "#00C48C" : "#7FE0C4" }}
              />
            </div>
            <span className="text-[10px] text-[#A0A3B1]">{point.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
