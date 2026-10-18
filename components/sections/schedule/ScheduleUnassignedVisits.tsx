// components/sections/schedule/UnassignedVisits.tsx
'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import type { VisitUrgency } from '@/components/ui';
import {UnassignedScheduleBlock} from "@/components/ui"
import { ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';

interface UnassignedVisit {
  id: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  typeKey: string;
  reason: string;
  reasonKey: string;
  /** Days until the visit — drives sorting + urgency. 0 = today, negative = overdue. */
  daysUntil: number;
}

const mockUnassignedVisits: UnassignedVisit[] = [
  {
    id: '1',
    patientName: 'Dorothy Chen',
    date: 'Friday 4 Aug',
    startTime: '11:00',
    endTime: '12:00',
    type: 'Initial Assessment',
    typeKey: 'initial-assessment',
    reason: 'New Patient',
    reasonKey: 'new-patient',
    daysUntil: -1,
  },
  {
    id: '2',
    patientName: 'James Okafor',
    date: 'Friday 4 Aug',
    startTime: '13:00',
    endTime: '14:00',
    type: 'Care Visit',
    typeKey: 'care-visit',
    reason: 'Routine',
    reasonKey: 'routine',
    daysUntil: 0,
  },
  {
    id: '3',
    patientName: 'Edna Morris',
    date: 'Friday 4 Aug',
    startTime: '14:30',
    endTime: '15:30',
    type: 'Medication',
    typeKey: 'medication',
    reason: 'Urgent',
    reasonKey: 'urgent',
    daysUntil: 0,
  },
  {
    id: '4',
    patientName: 'Robert Hayes',
    date: 'Friday 4 Aug',
    startTime: '10:00',
    endTime: '11:00',
    type: 'Follow-up',
    typeKey: 'follow-up',
    reason: 'Follow-up',
    reasonKey: 'follow-up',
    daysUntil: 1,
  },
  {
    id: '5',
    patientName: 'Sophie Martinez',
    date: 'Friday 4 Aug',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Review',
    typeKey: 'review',
    reason: 'Routine',
    reasonKey: 'routine',
    daysUntil: 4,
  },
];

const VISIBLE_COUNT = 3;

function urgencyFromDaysUntil(daysUntil: number): VisitUrgency {
  if (daysUntil < 0) return 'overdue';
  if (daysUntil === 0) return 'urgent';
  if (daysUntil === 1) return 'soon';
  return 'upcoming';
}

interface UnassignedVisitsProps {
  /** Called when a visit card is dropped onto a calendar slot — parent decides how to open the assign flow. */
  onAssignVisit?: (visitId: string) => void;
  /** Called after the AI scheduler finishes optimising — parent can refresh the calendar / show a toast. */
  onAiScheduled?: (assignedVisitIds: string[]) => void;
}

function UnassignedVisits({ onAssignVisit, onAiScheduled }: UnassignedVisitsProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'urgency' | 'date'>('urgency');
  const [visits, setVisits] = useState<UnassignedVisit[]>(mockUnassignedVisits);
  const [isOptimising, setIsOptimising] = useState(false);
  const [justAssignedIds, setJustAssignedIds] = useState<string[]>([]);

  const sortedVisits = useMemo(() => {
    const copy = [...visits];
    if (sortBy === 'urgency') {
      copy.sort((a, b) => a.daysUntil - b.daysUntil);
    } else {
      copy.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
    }
    return copy;
  }, [visits, sortBy]);

  const totalCount = visits.length;
  const hasMore = totalCount > VISIBLE_COUNT;

  const displayedVisits = showAll ? sortedVisits : sortedVisits.slice(0, VISIBLE_COUNT);

  const toggleShowAll = () => setShowAll((prev) => !prev);

  const handleDragStart = (visitId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/x-careflow-visit-id', visitId);
    event.dataTransfer.effectAllowed = 'move';
  };

  // AI-powered smart scheduling (3.2.2): one click fills every unassigned visit optimally.
  // Coordinators still see + can undo the result — this is a suggestion, not a silent write.
  const handleAiSchedule = async () => {
    if (visits.length === 0) return;
    setIsOptimising(true);
    try {
      // Simulated optimisation call — replace with the real AI scheduler endpoint.
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const assignedIds = visits.map((v) => v.id);
      setJustAssignedIds(assignedIds);
      onAiScheduled?.(assignedIds);
      // Small delay so the "assigned" pulse is visible before the cards leave the list.
      setTimeout(() => {
        setVisits([]);
        setJustAssignedIds([]);
      }, 500);
    } finally {
      setIsOptimising(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-sm h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-sm h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-x-2">
            <CardTitle>
              <div className="flex items-center gap-x-1">
                <h1>Unassigned</h1>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={totalCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Badge variant="pastel-danger" shape="pill">
                      {totalCount}
                    </Badge>
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardTitle>

            {totalCount > 1 && (
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'urgency' | 'date')}>
                <SelectTrigger className="h-7 w-[110px] text-xs border-cf-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgency">By urgency</SelectItem>
                  <SelectItem value="date">By date</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {totalCount > 0 && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAiSchedule}
                disabled={isOptimising}
                className="w-full"
              >
                {isOptimising ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Optimising schedule…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    AI-assign all visits
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="mt-4">
          <motion.div
            className="space-y-3"
            layout
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
          >
            <AnimatePresence mode="popLayout">
              {displayedVisits.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-cf-ink-60 text-center py-6"
                >
                  All visits are assigned 🎉
                </motion.p>
              )}
              {displayedVisits.map((visit, index) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: justAssignedIds.includes(visit.id) ? [1, 1.03, 1] : 1,
                  }}
                  exit={{ opacity: 0, x: 60, scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.05,
                  }}
                  layout
                >
                  <UnassignedScheduleBlock
                    patientName={visit.patientName}
                    date={visit.date}
                    startTime={visit.startTime}
                    endTime={visit.endTime}
                    type={visit.type}
                    reason={visit.reason}
                    typeKey={visit.typeKey}
                    reasonKey={visit.reasonKey}
                    urgency={urgencyFromDaysUntil(visit.daysUntil)}
                    draggable
                    onDragStart={handleDragStart(visit.id)}
                    onAssignClick={() => onAssignVisit?.(visit.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>

        <CardFooter className="flex items-center justify-center mt-4 bg-cf-surface">
          {hasMore ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" onClick={toggleShowAll} className="gap-1">
                <motion.span
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  
                </motion.span>
                {showAll ? 'View Less' : 'View More'}
              </Button>
            </motion.div>
          ) : (
            totalCount > 0 && (
              <Button variant="ghost" disabled className="text-cf-ink-40">
                No more visits
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default UnassignedVisits;
