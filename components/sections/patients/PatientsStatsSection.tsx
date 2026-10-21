'use client';

import { motion } from "framer-motion";
import { AlertTriangle, CalendarClock, UserPlus, Users } from "lucide-react";
import { StatCard } from "shared";
import type { PatientStats } from "types";

interface PatientsStatsSectionProps {
  stats: PatientStats;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

/** Stat cards are always derived from the patient list, so they match the table. */
export function PatientsStatsSection({ stats }: PatientsStatsSectionProps) {
  const { totalPatients, activePatients, newThisMonth, highRiskPatients, reviewsDue } = stats;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={item}>
        <StatCard
          label="Total Patients"
          value={totalPatients.toLocaleString("en-GB")}
          Icon={Users}
          description={`${activePatients} active`}
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p className="mt-1 text-xs text-cf-ink-60">{activePatients} active</p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="New This Month"
          value={newThisMonth.toLocaleString("en-GB")}
          Icon={UserPlus}
          description="Admitted this month"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p className="mt-1 text-xs text-cf-ink-60">Admitted this month</p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="High Risk"
          value={highRiskPatients.toLocaleString("en-GB")}
          Icon={AlertTriangle}
          description="Need closer monitoring"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p
            className={`mt-1 text-xs font-medium ${
              highRiskPatients > 0 ? "text-destructive" : "text-brand-600"
            }`}
          >
            {highRiskPatients > 0 ? "Need closer monitoring" : "None flagged"}
          </p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="Reviews Due"
          value={reviewsDue.toLocaleString("en-GB")}
          Icon={CalendarClock}
          description="Care plan reviews due"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p
            className={`mt-1 text-xs font-medium ${
              reviewsDue > 0 ? "text-cf-amber-500" : "text-brand-600"
            }`}
          >
            {reviewsDue > 0 ? "Due within 7 days or overdue" : "All reviews on track"}
          </p>
        </StatCard>
      </motion.div>
    </motion.div>
  );
}