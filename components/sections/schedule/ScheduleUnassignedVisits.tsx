'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Loader2, Sparkles } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  ScheduleSelect,
  UnassignedScheduleBlock,
} from '@/components/ui';
import type { ScheduleVisit } from 'types';
import { getVisitUrgency } from 'utils';

const VISIBLE_COUNT = 3;

type SortKey = 'urgency' | 'patient';

const SORT_OPTIONS = [
  { value: 'urgency', label: 'By urgency' },
  { value: 'patient', label: 'By patient' },
];

interface ScheduleUnassignedVisitsProps {
  /** Unassigned visits only, already ordered soonest first. */
  visits: ScheduleVisit[];
  todayIso: string;
  isOptimising: boolean;
  onAssignVisit: (visitId: string) => void;
  onAiAssignAll: () => void;
  onDragVisitStart: (visitId: string) => void;
  onDragVisitEnd: () => void;
}

export function ScheduleUnassignedVisits({
  visits,
  todayIso,
  isOptimising,
  onAssignVisit,
  onAiAssignAll,
  onDragVisitStart,
  onDragVisitEnd,
}: ScheduleUnassignedVisitsProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('urgency');

  // Urgency is driven by date, so the incoming order (soonest first) is the urgency order.
  const sortedVisits = useMemo(
    () =>
      sortBy === 'patient'
        ? [...visits].sort((a, b) => a.patientName.localeCompare(b.patientName))
        : visits,
    [visits, sortBy]
  );

  const totalCount = visits.length;
  const displayedVisits = showAll ? sortedVisits : sortedVisits.slice(0, VISIBLE_COUNT);

  const handleDragStart = (visitId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/x-careflow-visit-id', visitId);
    event.dataTransfer.effectAllowed = 'move';
    onDragVisitStart(visitId);
  };

  return (
    <motion.div
      className="w-full shrink-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-x-2">
            <CardTitle>
              <div className="flex items-center gap-x-1">
                <h2>Unassigned</h2>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={totalCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Badge variant="softDanger" shape="pill">
                      {totalCount}
                    </Badge>
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardTitle>

            {totalCount > 1 && (
              <ScheduleSelect
                aria-label="Sort unassigned visits"
                size="sm"
                className="w-32"
                value={sortBy}
                options={SORT_OPTIONS}
                onValueChange={(value) => setSortBy(value as SortKey)}
              />
            )}
          </div>

          {totalCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAiAssignAll}
              disabled={isOptimising}
              className="mt-3 w-full"
            >
              {isOptimising ? (
                <>
                  <Loader2 className="animate-spin" />
                  Optimising schedule…
                </>
              ) : (
                <>
                  <Sparkles />
                  AI-assign all visits
                </>
              )}
            </Button>
          )}
        </CardHeader>

        <CardContent className="mt-4">
          <motion.div className="space-y-3" layout>
            <AnimatePresence mode="popLayout">
              {displayedVisits.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center text-sm text-cf-ink-60"
                >
                  All visits are assigned
                </motion.p>
              )}
              {displayedVisits.map((visit, index) => (
                <motion.div
                  key={visit.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 60, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.05 }}
                >
                  <UnassignedScheduleBlock
                    visit={visit}
                    urgency={getVisitUrgency(visit, todayIso)}
                    draggable
                    onDragStart={handleDragStart(visit.id)}
                    onDragEnd={onDragVisitEnd}
                    onAssignClick={(target) => onAssignVisit(target.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>

        {totalCount > VISIBLE_COUNT && (
          <CardFooter className="mt-4 flex items-center justify-center bg-cf-surface">
            <Button variant="ghost" onClick={() => setShowAll((prev) => !prev)} className="gap-1">
              <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown />
              </motion.span>
              {showAll ? 'View less' : `View all ${totalCount}`}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}