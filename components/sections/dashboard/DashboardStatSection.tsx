"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Activity, AlertCircle, CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import { StatCard, StatCardSkeleton } from "shared"; 
import type { DashboardVisitFilter, DashboardVisitSummary } from "types"; 

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
  completionRate: number;
  upcoming: number;
  isLoading?: boolean;
  activeFilter: DashboardVisitFilter;
  onFilterChange: (filter: DashboardVisitFilter) => void;
}

export function DashboardStatSection({
  summary,
  completionRate,
  upcoming,
  activeFilter,
  onFilterChange,
  isLoading = false,
}: DashboardStatSectionProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-busy="true">
        <p role="status" className="sr-only">Loading today&apos;s numbers</p>
        {Array.from({ length: 5 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  const toggleFilter = (filter: DashboardVisitFilter) =>
    onFilterChange(activeFilter === filter ? "all" : filter);

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
          onSelect={() => onFilterChange("all")} 
          isActive={activeFilter === "all"}
          linkLabel={`Show all ${summary.total} visits today`} 
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
          onSelect={() => toggleFilter("completed")} 
          isActive={activeFilter === "completed"} 
          linkLabel={`Show ${summary.completed} completed visits`}
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
          onSelect={() => toggleFilter("in-progress")} // NEW
          isActive={activeFilter === "in-progress"} // NEW
          linkLabel={`Show ${summary.inProgress} visits in progress`} // NEW
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
          onSelect={() => toggleFilter("late")} 
          isActive={activeFilter === "late"} 
          linkLabel={`Show ${summary.late} late visits`} 
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
          onSelect={() => toggleFilter("missed")}
          isActive={activeFilter === "missed"}
          linkLabel={`Show ${summary.missed} missed visits`}
        >
          <p className={summary.missed > 0 ? "text-xs font-medium text-destructive" : "text-xs text-brand-600"}>
            {summary.missed > 0 ? "Needs follow-up" : "None today"}
          </p>
        </StatCard>
      </StatItem>
    </motion.div>
  );
}