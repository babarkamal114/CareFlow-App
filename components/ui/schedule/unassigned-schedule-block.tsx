"use client";

import { motion } from "framer-motion";
import { AlertTriangle, GripVertical } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { ScheduleVisit, VisitUrgency } from "types";
import { URGENCY_BADGE_VARIANT, URGENCY_LABELS, formatShortDate } from "utils";
import { VisitTypeBadge } from "./visit-status-badge";

interface UnassignedScheduleBlockProps {
  visit: ScheduleVisit;
  urgency: VisitUrgency;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  onAssignClick?: (visit: ScheduleVisit) => void;
}

export function UnassignedScheduleBlock({
  visit,
  urgency,
  draggable = false,
  onDragStart,
  onDragEnd,
  onAssignClick,
}: UnassignedScheduleBlockProps) {
  const isOverdue = urgency === "overdue";

  return (
    // Native drag lives on a plain div so its event types stay standard.
    // framer-motion's own drag handlers have different signatures.
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={draggable ? "cursor-grab active:cursor-grabbing" : undefined}
    >
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={draggable ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group relative flex flex-col gap-y-1 rounded-xl border border-l-4 border-cf-border border-l-cf-red-500 bg-cf-surface-muted py-4 pl-4 pr-3 transition-shadow hover:shadow-cf-md"
      >
        <div className="flex items-start justify-between gap-x-2">
          <h3 className="text-cf-h5 font-semibold leading-tight text-cf-ink">
            {visit.patientName}
          </h3>

          <div className="flex shrink-0 items-center gap-x-1.5">
            <Badge variant={URGENCY_BADGE_VARIANT[urgency]} shape="pill">
              <motion.span
                aria-hidden
                className="size-1.5 rounded-full bg-current"
                animate={isOverdue ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : undefined}
                transition={
                  isOverdue ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : undefined
                }
              />
              {URGENCY_LABELS[urgency]}
            </Badge>

            {draggable && (
              <GripVertical
                aria-hidden
                className="size-4 text-cf-ink-40 opacity-0 transition-opacity group-hover:opacity-100"
              />
            )}
          </div>
        </div>

        <p className="text-xs text-cf-ink-60">
          {formatShortDate(visit.date)} · {visit.startTime} - {visit.endTime}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <VisitTypeBadge type={visit.type} />
          {visit.notes && <span className="text-sm text-cf-ink-60">{visit.notes}</span>}
        </div>

        {isOverdue && (
          <div className="mt-0.5 flex items-center gap-x-1 text-xs font-medium text-error">
            <AlertTriangle className="size-3" aria-hidden />
            <span>Needs a carer urgently</span>
          </div>
        )}

        {onAssignClick && (
          <Button
            variant="brandOutline"
            size="xs"
            onClick={() => onAssignClick(visit)}
            className="absolute bottom-3 right-3 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          >
            Assign
          </Button>
        )}
      </motion.div>
    </div>
  );
}