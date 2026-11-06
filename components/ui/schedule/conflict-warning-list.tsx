import type { LucideIcon } from "lucide-react";
import { CalendarX, Car, GraduationCap, UserX } from "lucide-react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui";
import { cn } from "lib";
import type { VisitConflict, VisitConflictType } from "types";
import { CONFLICT_TYPE_LABELS } from "utils";

const CONFLICT_ICONS: Record<VisitConflictType, LucideIcon> = {
  "double-booking": CalendarX,
  "carer-unavailable": UserX,
  "missing-skill": GraduationCap,
  "travel-time": Car,
};

interface ConflictWarningListProps {
  conflicts: VisitConflict[];
  className?: string;
}

/** Errors (red) block a sensible booking; warnings (amber) need a second look. */
export function ConflictWarningList({
  conflicts,
  className,
}: ConflictWarningListProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {conflicts.map((conflict, index) => {
        const Icon = CONFLICT_ICONS[conflict.type];
        return (
          <Alert
            key={`${conflict.type}-${conflict.relatedVisitId ?? index}`}
            variant={conflict.severity === "error" ? "error" : "warning"}
            className="px-3 py-2.5"
          >
            <AlertIcon>
              <Icon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>{CONFLICT_TYPE_LABELS[conflict.type]}</AlertTitle>
              <AlertDescription>{conflict.message}</AlertDescription>
            </AlertContent>
          </Alert>
        );
      })}
    </div>
  );
}