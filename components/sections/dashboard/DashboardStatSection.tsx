"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import { getDashboardStatCards, getStatGridColumns } from "utils";

interface DashboardStatSectionProps {
  role: string;
}

const GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

function DashboardStatSection({ role }: DashboardStatSectionProps) {
  const cards = getDashboardStatCards(role);

  if (cards.length === 0) return null;

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 ${
    GRID_COLS[getStatGridColumns(cards.length)]
  } gap-4`;

  return (
    <div className={gridClass}>
      {cards.map(({ id, props }, i) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
        >
          <StatCard {...props} />
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStatSection;
