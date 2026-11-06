"use client";

import { motion, type Variants } from "framer-motion";
import { Activity, AlertCircle, CalendarDays, CheckCircle2, Clock } from "lucide-react";
import type { ReactNode } from "react";

import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import { StatCard } from "shared";
import type { DashboardVisitSummary } from "types";

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

function StatItem({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={cardVariants} className="h-full [&>*]:h-full">
      {children}
    </motion.div>
  );
}

interface DashboardStatSectionProps {
  summary: DashboardVisitSummary;
  /** 0-100 */
  completionRate: number;
  /** Visits that have not started yet */
  upcoming: number;
}

/** Today's numbers: scheduled, completed, in progress, late and missed visits. */
export function DashboardStatSection({ summary, completionRate, upcoming }: DashboardStatSectionProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      variants={gridVariants}
      initial="hidden"
      animate="show"
    >
      <StatItem>
        <StatCard
          label="Visits Today"
          value={summary.total.toLocaleString("en-GB")}
          Icon={CalendarDays}
          description="Total scheduled today"
        >
          <p className="text-xs text-cf-ink-60">{upcoming} still to start</p>
        </StatCard>
      </StatItem>

      <StatItem>
        <StatCard
          label="Completed"
          value={summary.completed.toLocaleString("en-GB")}
          Icon={CheckCircle2}
          description="Visits finished today"
        >
          <Progress value={completionRate} aria-label="Share of today's visits completed" className="gap-0">
            <ProgressTrack>
              <ProgressIndicator className="bg-brand-500" />
            </ProgressTrack>
          </Progress>
          <p className="mt-1.5 text-xs text-cf-ink-60">{completionRate}% of today&apos;s visits</p>
        </StatCard>
      </StatItem>

      <StatItem>
        <StatCard
          label="In Progress"
          value={summary.inProgress.toLocaleString("en-GB")}
          Icon={Activity}
          description="Carers with a client now"
        >
          <p className="text-xs text-cf-ink-60">Carers with a client now</p>
        </StatCard>
      </StatItem>

      <StatItem>
        <StatCard
          label="Late"
          value={summary.late.toLocaleString("en-GB")}
          Icon={Clock}
          description="Carers not checked in"
        >
          <p className={summary.late > 0 ? "text-xs font-medium text-cf-amber-500" : "text-xs text-brand-600"}>
            {summary.late > 0 ? "Check carers have arrived" : "Everyone on time"}
          </p>
        </StatCard>
      </StatItem>

      <StatItem>
        <StatCard
          label="Missed"
          value={summary.missed.toLocaleString("en-GB")}
          Icon={AlertCircle}
          description="Visits with no check-in"
        >
          <p className={summary.missed > 0 ? "text-xs font-medium text-destructive" : "text-xs text-brand-600"}>
            {summary.missed > 0 ? "Needs follow-up" : "None today"}
          </p>
        </StatCard>
      </StatItem>
    </motion.div>
  );
}