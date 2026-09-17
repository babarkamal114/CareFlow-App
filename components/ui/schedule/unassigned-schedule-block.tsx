import { motion } from "framer-motion";
import { AlertTriangle, GripVertical } from "lucide-react";
import { borderColorMap, reasonColorMap, typeColorMap } from "utils";

export type VisitUrgency = "overdue" | "urgent" | "soon" | "upcoming";

const urgencyConfig: Record<
  VisitUrgency,
  { label: string; dot: string; badge: string; pulse?: boolean }
> = {
  overdue: {
    label: "Overdue",
    dot: "bg-cf-red-500",
    badge: "bg-error-muted text-error",
    pulse: true,
  },
  urgent: {
    label: "Today",
    dot: "bg-cf-amber-500",
    badge: "bg-warning-muted text-warning",
  },
  soon: {
    label: "Tomorrow",
    dot: "bg-cf-amber-500",
    badge: "bg-cf-amber-50 text-cf-amber-500",
  },
  upcoming: {
    label: "This week",
    dot: "bg-cf-ink-40",
    badge: "bg-cf-surface-muted text-cf-ink-60",
  },
};

interface UnassignedScheduleBlockProps {
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  reason: string;
  typeKey: string;
  reasonKey: string;
  /** Drives the urgency badge + accent. Defaults to "upcoming" when omitted. */
  urgency?: VisitUrgency;
  /** Enables native HTML5 drag so the card can be dropped onto a calendar slot to assign a carer. */
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  /** Fired when the user clicks the quick "Assign" affordance (e.g. to open the assign modal or trigger AI suggestion). */
  onAssignClick?: () => void;
}

export function UnassignedScheduleBlock({
  patientName,
  date,
  startTime,
  endTime,
  type,
  typeKey,
  reason,
  reasonKey,
  urgency = "upcoming",
  draggable = false,
  onDragStart,
  onDragEnd,
  onAssignClick,
}: UnassignedScheduleBlockProps) {
  const typeColor = typeColorMap[typeKey] || typeColorMap.default;
  const urgencyStyle = urgencyConfig[urgency];

  return (
    <motion.div
      draggable={draggable}
      onDragStart={onDragStart as any}
      onDragEnd={onDragEnd as any}
      whileHover={{ y: -2, boxShadow: "0 8px 20px -8px rgba(15, 23, 42, 0.18)" }}
      whileTap={draggable ? { scale: 0.98, cursor: "grabbing" } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative flex flex-col gap-y-1 py-4 pl-4 pr-3 border border-cf-border rounded-xl border-l-4 border-l-cf-red-500 bg-cf-surface-muted ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-x-2">
        <h1 className="text-lg font-semibold leading-tight">{patientName}</h1>

        <div className="flex items-center gap-x-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-x-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${urgencyStyle.badge}`}
          >
            <motion.span
              className={`h-1.5 w-1.5 rounded-full ${urgencyStyle.dot}`}
              animate={
                urgencyStyle.pulse
                  ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }
                  : undefined
              }
              transition={
                urgencyStyle.pulse
                  ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            />
            {urgencyStyle.label}
          </span>

          {draggable && (
            <GripVertical className="h-4 w-4 text-cf-ink-40 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>

      <div className="flex gap-x-1 text-xs text-cf-ink-60">
        <p>{date}</p>
        <span>-</span>
        <p>
          {startTime} - {endTime}
        </p>
      </div>

      <div className={`flex gap-x-1 text-sm ${typeColor}`}>
        <p>{type}</p>
        <span className="text-cf-ink-60">-</span>
        <p>{reason}</p>
      </div>

      {urgency === "overdue" && (
        <div className="flex items-center gap-x-1 text-xs font-medium text-error mt-0.5">
          <AlertTriangle className="h-3 w-3" />
          <span>Needs a carer urgently</span>
        </div>
      )}

      {onAssignClick && (
        <motion.button
          type="button"
          onClick={onAssignClick}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1, scale: 1.03 }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-cf-brand-600 bg-cf-brand-50 hover:bg-cf-brand-100 rounded-full px-2.5 py-1"
        >
          Assign
        </motion.button>
      )}
    </motion.div>
  );
}
