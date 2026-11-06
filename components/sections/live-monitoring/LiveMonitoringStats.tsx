"use client";

import { Skeleton } from "ui/skeleton";
import { getLiveMonitoringStatCards } from "ui/live-monitoring/live-monitoring-stat-cards";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import type { LiveMonitoringStatsProps } from "types";

export function LiveMonitoringStats({ counts, isLoading }: LiveMonitoringStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  const cards = getLiveMonitoringStatCards(counts);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}
