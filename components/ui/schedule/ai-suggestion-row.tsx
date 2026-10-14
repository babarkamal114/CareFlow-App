"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui";
import type {
  ScheduleSelectOption,
  ScheduleSuggestion,
  ScheduleVisit,
  VisitIssues,
} from "types";
import { formatShortDate, getScoreBadgeVariant } from "utils";
import { ScheduleSelect } from "./schedule-select";
import { VisitTypeBadge } from "./visit-status-badge";

const NO_CARER = "none";

interface AiSuggestionRowProps {
  visit: ScheduleVisit;
  /** Missing when the optimiser could not find a carer without a blocking conflict. */
  suggestion?: ScheduleSuggestion;
  carerOptions: ScheduleSelectOption[];
  /** Empty string means "leave unassigned". */
  selectedCarerId: string;
  /** Conflicts and preference issues for the carer currently chosen. Shown when it differs from the suggestion. */
  selectedIssues?: VisitIssues;
  onCarerChange: (carerId: string) => void;
}

/** One proposed assignment. The coordinator can accept it or pick a different carer. */
export function AiSuggestionRow({
  visit,
  suggestion,
  carerOptions,
  selectedCarerId,
  selectedIssues,
  onCarerChange,
}: AiSuggestionRowProps) {
  const isOverride = suggestion !== undefined && selectedCarerId !== suggestion.carerId;
  const showDetails = suggestion !== undefined && !isOverride;
  const shownConflicts = showDetails ? suggestion.conflicts : (selectedIssues?.conflicts ?? []);
  const shownViolations = showDetails ? suggestion.violations : (selectedIssues?.violations ?? []);
  const options = [{ value: NO_CARER, label: "Leave unassigned" }, ...carerOptions];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-cf-border bg-cf-surface-muted p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-cf-h6 font-semibold text-cf-ink">{visit.patientName}</h3>
            <VisitTypeBadge type={visit.type} />
          </div>
          <p className="text-xs text-cf-ink-60">
            {formatShortDate(visit.date)} · {visit.startTime} - {visit.endTime}
          </p>
        </div>

        <div className="flex w-full flex-col gap-1.5 sm:w-48">
          <ScheduleSelect
            aria-label={`Carer for ${visit.patientName}`}
            size="sm"
            value={selectedCarerId === "" ? NO_CARER : selectedCarerId}
            options={options}
            onValueChange={(value) => onCarerChange(value === NO_CARER ? "" : value)}
          />
          {isOverride && (
            <p className="text-xs text-cf-ink-60">Changed from the suggestion</p>
          )}
        </div>
      </div>

      {suggestion === undefined && (
        <p className="text-xs font-medium text-error">
          No carer is free without a conflict. Choose one manually or leave it unassigned.
        </p>
      )}

      {(showDetails || shownConflicts.length > 0 || shownViolations.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {showDetails && (
            <>
              <Badge variant={getScoreBadgeVariant(suggestion.score)}>
                <Sparkles className="size-3" />
                {suggestion.score}% match
              </Badge>
              {suggestion.reasons.map((reason) => (
                <Badge key={reason} variant="softMuted">
                  {reason}
                </Badge>
              ))}
            </>
          )}
          {shownViolations.map((violation) => (
            <Badge key={violation.type} variant="softWarning">
              {violation.message}
            </Badge>
          ))}
          {shownConflicts.map((conflict, index) => (
            <Badge
              key={`${conflict.type}-${index}`}
              variant={conflict.severity === "error" ? "softDanger" : "softWarning"}
            >
              {conflict.message}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}