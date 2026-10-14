'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, UserX, XCircle } from 'lucide-react';
import { StatCard } from 'shared';
import type { ScheduleVisit } from 'types';
import {
  countUnassignedByWindow,
  countVisitsByStatus,
  getUnassignedVisits,
  getVisitsForDate,
} from 'utils';

interface ScheduleStatCardsSectionProps {
  visits: ScheduleVisit[];
  /** ISO date treated as "today" (a fixed date while we use mock data). */
  todayIso: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export function ScheduleStatCardsSection({ visits, todayIso }: ScheduleStatCardsSectionProps) {
  const today = countVisitsByStatus(getVisitsForDate(visits, todayIso));
  const unassigned = getUnassignedVisits(visits);
  const windows = countUnassignedByWindow(visits, todayIso);
  const overdue = unassigned.filter((visit) => visit.date < todayIso).length;
  const completedPercent = today.total > 0 ? Math.round((today.completed / today.total) * 100) : 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      <motion.div variants={item}>
        <StatCard
          label="Total Visits"
          value={today.total.toLocaleString('en-GB')}
          Icon={Calendar}
          description="Scheduled for today"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p className="mt-1 text-xs text-cf-ink-60">{today.scheduled} still to start today</p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="Completed"
          value={today.completed.toLocaleString('en-GB')}
          Icon={CheckCircle}
          description="Visits completed today"
          showScore={true}
          score={completedPercent}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p className="mt-1 text-xs text-cf-ink-60">{completedPercent}% of today&apos;s visits</p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="In Progress"
          value={today.inProgress.toLocaleString('en-GB')}
          Icon={Clock}
          description="Currently ongoing visits"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p className="mt-1 text-xs text-cf-ink-60">Carers checked in now</p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="Missed / Cancelled"
          value={today.missedOrCancelled.toLocaleString('en-GB')}
          Icon={XCircle}
          description="Visits missed or cancelled today"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p
            className={`mt-1 text-xs font-medium ${
              today.missedOrCancelled > 0 ? 'text-error' : 'text-success'
            }`}
          >
            {today.missedOrCancelled > 0 ? 'Needs follow-up' : 'None today'}
          </p>
        </StatCard>
      </motion.div>

      <motion.div variants={item}>
        <StatCard
          label="Unassigned"
          value={unassigned.length.toLocaleString('en-GB')}
          Icon={UserX}
          description="Visits without a carer"
          showScore={false}
          showTrend={false}
          hasCqcScore={false}
          hasValueBadge={false}
        >
          <p
            className={`mt-1 text-xs font-medium ${
              unassigned.length > 0 ? 'text-error' : 'text-success'
            }`}
          >
            {unassigned.length === 0
              ? 'All visits covered'
              : `Today ${windows.today} · Tomorrow ${windows.tomorrow} · Later ${windows.restOfWeek}${
                  overdue > 0 ? ` · ${overdue} overdue` : ''
                }`}
          </p>
        </StatCard>
      </motion.div>
    </motion.div>
  );
}