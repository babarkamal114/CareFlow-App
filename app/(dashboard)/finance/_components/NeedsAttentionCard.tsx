// app/(dashboard)/finance/_components/NeedsAttentionCard.tsx
// Right-sidebar alert list — finance-flavored version of the Dashboard's
// "Needs Attention" panel (overdue invoices, expiring payment methods, etc).
// Items pulse in with a staggered entrance, and critical items get a
// subtle persistent pulse dot to draw the eye, matching the app's convention
// for live/urgent indicators (see StatsBar's pulsing "in progress" dot).

"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────
export type AttentionSeverity = "critical" | "warning"

export interface AttentionItem {
  id: string
  message: string
  severity: AttentionSeverity
  timeAgo?: string
}

interface NeedsAttentionCardProps {
  items: AttentionItem[]
  onItemClick?: (item: AttentionItem) => void
}

const SEVERITY_COLOR: Record<AttentionSeverity, string> = {
  critical: "text-[#A82B2B]",
  warning: "text-[#916408]",
}

// ── Main export ───────────────────────────────────────────────────────────
export default function NeedsAttentionCard({ items, onItemClick }: NeedsAttentionCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111318]">Needs attention</h2>
        <span className="text-xs font-semibold text-[#A0A3B1]">{items.length} items</span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            whileHover={{ x: 2 }}
            onClick={() => onItemClick?.(item)}
            className="flex items-start gap-2 text-left"
          >
            <span className="relative mt-0.5 flex shrink-0">
              {item.severity === "critical" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A82B2B] opacity-40" />
              )}
              <AlertTriangle size={13} className={cn("relative", SEVERITY_COLOR[item.severity])} />
            </span>
            <div className="flex flex-col">
              <span className={cn("text-xs font-medium", SEVERITY_COLOR[item.severity])}>
                {item.message}
              </span>
              {item.timeAgo && (
                <span className="text-[10px] text-[#A0A3B1]">{item.timeAgo}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  )
}
