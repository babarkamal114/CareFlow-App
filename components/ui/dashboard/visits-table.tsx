"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import type { DashboardVisit, DashboardVisitFilter } from "types";
import {
  DASHBOARD_VISIT_COLUMNS,
  DASHBOARD_VISIT_FILTER_OPTIONS,
  formatDashboardVisitRange,
  getCarerShortName,
  getDashboardInitials,
} from "utils";

import { VisitStatusBadge } from "./visit-status-badge";

interface VisitsTableProps {
  visits: DashboardVisit[];
  filter: DashboardVisitFilter;
  onFilterChange: (filter: DashboardVisitFilter) => void;
  viewAllHref?: string;
}

/** Today's visits with a status filter. Rows arrive already filtered. */
export function VisitsTable({ visits, filter, onFilterChange, viewAllHref = "/scheduling" }: VisitsTableProps) {
  return (
    <Card variant="elevated" className="w-full gap-0 py-0">
      <div className="flex items-center justify-between gap-3 border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-lg font-semibold text-cf-ink">Today&apos;s Visits</h2>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={viewAllHref} />}>
          <Eye />
          View All
        </Button>
      </div>

      <div className="overflow-x-auto border-b border-cf-border-light px-4 py-3">
        <Tabs value={filter} onValueChange={(value) => onFilterChange(value as DashboardVisitFilter)}>
          <TabsList aria-label="Filter visits by status">
            {DASHBOARD_VISIT_FILTER_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="px-3">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              {DASHBOARD_VISIT_COLUMNS.map((col) => (
                <TableHead key={col.key} className={col.align === "right" ? "text-right" : undefined}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.length === 0 && (
              <TableRow>
                <TableCell colSpan={DASHBOARD_VISIT_COLUMNS.length} className="py-10 text-center text-cf-ink-60">
                  No visits match this filter.
                </TableCell>
              </TableRow>
            )}

            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar size="default">
                      <AvatarFallback className="bg-brand-50 text-brand-700">
                        {getDashboardInitials(visit.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-cf-ink">{visit.patientName}</p>
                      <p className="truncate text-xs text-cf-ink-60">{visit.careType}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-cf-ink-80">{getCarerShortName(visit.carerName)}</TableCell>
                <TableCell className="whitespace-nowrap tabular-nums text-cf-ink-80">
                  {formatDashboardVisitRange(visit)}
                </TableCell>
                <TableCell>
                  <VisitStatusBadge status={visit.status} minutesLate={visit.minutesLate} />
                </TableCell>
                <TableCell className="text-right tabular-nums text-cf-ink-80">{visit.durationMins} min</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}