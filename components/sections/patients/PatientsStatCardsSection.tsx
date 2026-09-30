"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { StatCard } from "shared";
import { usePatientStats } from "hooks";
import {
  buildPatientStatCards,
  getVisiblePatientStatDefinitions,
  getPatientStatGridClass,
} from "utils";

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

function PatientStatSection() {
  const { data, isLoading, error, refetch } = usePatientStats();

  const visibleCount = useMemo(() => getVisiblePatientStatDefinitions().length, []);

  const cards = useMemo(() => (data ? buildPatientStatCards(data) : []), [data]);

  if (visibleCount === 0) return null;

  const gridClass = getPatientStatGridClass(visibleCount);

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
        <span className="text-cf-ink-40">Couldn&apos;t load patient stats.</span>
        <button onClick={refetch} className="font-semibold text-cf-ink underline">
          Retry
        </button>
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

export default PatientStatSection;