"use client";

import { VisitsTable } from "@/components/ui";
import type { DashboardVisit, DashboardVisitFilter } from "types";

interface DashboardVisitSectionProps {
  visits: DashboardVisit[];
  filter: DashboardVisitFilter;
  onFilterChange: (filter: DashboardVisitFilter) => void;
}

/** Today's visits table with its status filter. */
export function DashboardVisitSection({ visits, filter, onFilterChange }: DashboardVisitSectionProps) {
  return <VisitsTable visits={visits} filter={filter} onFilterChange={onFilterChange} />;
}