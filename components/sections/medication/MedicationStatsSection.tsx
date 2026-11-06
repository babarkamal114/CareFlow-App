"use client";

import { Skeleton } from "@/components/ui";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import type { summarizeRound } from "utils";
import { getMedicationStatCards } from "@/components/ui";

interface MedicationStatsSectionProps { summary: ReturnType<typeof summarizeRound>; escalationCount: number; isLoading: boolean }

export function MedicationStatsSection({ summary, escalationCount, isLoading }: MedicationStatsSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
      </div>
    );
  }
  const cards = getMedicationStatCards(summary, escalationCount);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -3 }}>
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}
