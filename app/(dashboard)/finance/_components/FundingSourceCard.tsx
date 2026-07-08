// app/(dashboard)/finance/_components/FundingSourceCard.tsx
// Revenue split by funding source — ties back to the funding tags already
// shown on the Patients page (Private pay / LA funded / CHC funded).
// Rows fade in with a stagger, matching the rest of the Finance page.

"use client"

import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────
export interface FundingSourceShare {
  label: string // e.g. "Private pay"
  pct: number
  dotColor: string // tailwind text/bg color class
}

interface FundingSourceCardProps {
  sources: FundingSourceShare[]
}

// ── Main export ───────────────────────────────────────────────────────────
export default function FundingSourceCard({ sources }: FundingSourceCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-bold text-[#111318]">Funding source</h2>
      <div className="flex flex-col gap-3">
        {sources.map((source, i) => (
          <motion.div
            key={source.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-2 text-[#5C5F6A]">
              <span className={`size-2 rounded-full ${source.dotColor}`} />
              {source.label}
            </span>
            <span className="font-semibold text-[#111318]">{source.pct}%</span>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
