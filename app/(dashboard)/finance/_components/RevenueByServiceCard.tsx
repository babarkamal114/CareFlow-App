// app/(dashboard)/finance/_components/RevenueByServiceCard.tsx
// Horizontal progress bars showing revenue share per service type.
// Mirrors the visual pattern of app/(dashboard)/_components/CQCBreakdown.tsx,
// with bars animating in on mount instead of a plain CSS transition.

"use client"

import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────
export interface ServiceRevenueShare {
  label: string // e.g. "Personal care"
  pct: number // 0–100
  color?: string // defaults to brand blue
}

interface RevenueByServiceCardProps {
  services: ServiceRevenueShare[]
}

function ServiceRow({ label, pct, color = "#3574D4", delay }: ServiceRevenueShare & { delay: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#5C5F6A]">{label}</span>
        <span className="text-xs font-semibold text-[#111318]">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F1F5]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function RevenueByServiceCard({ services }: RevenueByServiceCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-bold text-[#111318]">Revenue by service</h2>
      <div className="space-y-3.5">
        {services.map((service, i) => (
          <ServiceRow key={service.label} {...service} delay={i * 0.08} />
        ))}
      </div>
    </Card>
  )
}
