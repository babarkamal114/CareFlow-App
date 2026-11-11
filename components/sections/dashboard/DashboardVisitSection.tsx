"use client";

import { VisitsTable } from "ui/dashboard/visits-table";
import type { DashboardVisit, DashboardVisitFilter } from "types";

interface DashboardVisitSectionProps {
  visits: DashboardVisit[];
  filter: DashboardVisitFilter;
  onFilterChange: (filter: DashboardVisitFilter) => void;
  isLoading?: boolean;
}

const getPatientProfileHref = (visit: DashboardVisit) =>
  visit.patientId ? `/patients/${visit.patientId}` : undefined;

export function DashboardVisitSection({ visits, filter, onFilterChange, isLoading }: DashboardVisitSectionProps) {
  return (
    <VisitsTable
      visits={visits}
      filter={filter}
      onFilterChange={onFilterChange}
      isLoading={isLoading}
      getPatientHref={getPatientProfileHref}
    />
  );
}