"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import type { ScheduleFilters } from "types";
import {
  DEFAULT_SCHEDULE_FILTERS,
  SCHEDULE_AREA_OPTIONS,
  VISIT_STATUS_OPTIONS,
  hasActiveFilters,
  toSelectOptions,
  withAllOption,
} from "utils";
import { ScheduleSelect } from "./schedule-select";

interface ScheduleFilterBarProps {
  filters: ScheduleFilters;
  carers: { id: string; name: string }[];
  patients: { id: string; name: string }[];
  onFiltersChange: (filters: ScheduleFilters) => void;
}

export function ScheduleFilterBar({
  filters,
  carers,
  patients,
  onFiltersChange,
}: ScheduleFilterBarProps) {
  const carerOptions = useMemo(
    () => withAllOption(toSelectOptions(carers), "All carers"),
    [carers]
  );
  const patientOptions = useMemo(
    () => withAllOption(toSelectOptions(patients), "All patients"),
    [patients]
  );
  const areaOptions = useMemo(
    () => withAllOption(SCHEDULE_AREA_OPTIONS, "All areas"),
    []
  );
  const statusOptions = useMemo(
    () =>
      withAllOption(
        [{ value: "unassigned", label: "Unassigned" }, ...VISIT_STATUS_OPTIONS],
        "All statuses"
      ),
    []
  );

  function update<K extends keyof ScheduleFilters>(key: K, value: string) {
    onFiltersChange({ ...filters, [key]: value as ScheduleFilters[K] });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ScheduleSelect
        aria-label="Filter by carer"
        size="sm"
        className="w-36"
        value={filters.carerId}
        options={carerOptions}
        onValueChange={(value) => update("carerId", value)}
      />
      <ScheduleSelect
        aria-label="Filter by patient"
        size="sm"
        className="w-36"
        value={filters.patientId}
        options={patientOptions}
        onValueChange={(value) => update("patientId", value)}
      />
      <ScheduleSelect
        aria-label="Filter by area"
        size="sm"
        className="w-32"
        value={filters.area}
        options={areaOptions}
        onValueChange={(value) => update("area", value)}
      />
      <ScheduleSelect
        aria-label="Filter by status"
        size="sm"
        className="w-36"
        value={filters.status}
        options={statusOptions}
        onValueChange={(value) => update("status", value)}
      />

      {hasActiveFilters(filters) && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onFiltersChange(DEFAULT_SCHEDULE_FILTERS)}
        >
          <X />
          Clear filters
        </Button>
      )}
    </div>
  );
}