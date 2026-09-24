"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import { useDashboardStats } from "lib";
import { buildStatCards, getVisibleStatDefinitions } from "utils";
import { Button } from '@/components/ui';

interface DashboardStatSectionProps {
  role: string;
}

const GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

function StatCardSkeleton() {
  return (
    <div className="w-full rounded-xl cf-glass-panel animate-pulse">
      <div className="flex flex-col gap-4 py-4 px-4">
        <div className="size-8 rounded-lg bg-cf-ink-40/20" />
        <div className="h-3 w-24 rounded bg-cf-ink-40/20" />
        <div className="h-9 w-20 rounded bg-cf-ink-40/20" />
      </div>
    </div>
  );
}

function DashboardStatSection({ role }: DashboardStatSectionProps) {
  const { data, isLoading, error, refetch } = useDashboardStats();

  const visibleCount = useMemo(
    () => getVisibleStatDefinitions(role).length,
    [role]
  );

  const cards = useMemo(
    () => (data ? buildStatCards(data, role) : []),
    [data, role]
  );

  if (visibleCount === 0) return null;

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 ${
    GRID_COLS[Math.min(visibleCount, 4)]
  } gap-4`;

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: visibleCount }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl cf-glass-panel p-4 flex items-center justify-between text-sm">
        <span className="text-cf-ink-40">Couldn&apos;t load dashboard stats.</span>
        <Button onClick={refetch} className="font-semibold text-cf-ink underline">
          Retry
        </Button>
      </div>
    );
  }

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