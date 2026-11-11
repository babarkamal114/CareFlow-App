"use client";

import { useRef, type MouseEvent } from "react"; 
import { CalendarX, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useLoadMore } from "hooks"; 
import type { DashboardVisit, DashboardVisitFilter } from "types";
import {
  DASHBOARD_VISIT_COLUMNS,
  DASHBOARD_VISIT_FILTER_OPTIONS,
  formatDashboardVisitRange,
  getCarerShortName,
} from "utils";

import { VisitPatientCell } from "./visit-patient-cell";
import { VisitStatusBadge } from "./visit-status-badge";

const VISITS_PAGE_SIZE = 10;
const SKELETON_ROW_COUNT = 5;

interface VisitsTableProps {
  visits: DashboardVisit[];
  filter: DashboardVisitFilter;
  onFilterChange: (filter: DashboardVisitFilter) => void;
  viewAllHref?: string;
  isLoading?: boolean;
  getPatientHref?: (visit: DashboardVisit) => string | undefined;
}

export function VisitsTable({
  visits,
  filter,
  onFilterChange,
  viewAllHref = "/scheduling",
  isLoading = false,
  getPatientHref,
}: VisitsTableProps) {
  const router = useRouter();
  // Used to keep keyboard focus in place after the last "Load more"
  const statusRef = useRef<HTMLParagraphElement>(null);

  const total = visits.length;

  const { visibleCount, hasMore, remaining, loadMore } = useLoadMore(total, VISITS_PAGE_SIZE, filter);

  const shownVisits = visits.slice(0, visibleCount);
  const isFiltered = filter !== "all";
  const isEmpty = !isLoading && total === 0;
  const showFooter = !isLoading && !isEmpty;

  const noun = total === 1 ? "visit" : "visits";
  const filterLabel = DASHBOARD_VISIT_FILTER_OPTIONS.find((o) => o.value === filter)?.label.toLowerCase();
  const visitWord = isFiltered && filterLabel ? `${filterLabel} ${noun}` : noun;

  const statusText = isLoading
    ? "Loading visits"
    : isEmpty
      ? `No ${visitWord}`
      : `Showing ${shownVisits.length} of ${total} ${visitWord}`;

  const handleLoadMore = () => {
    if (visibleCount + VISITS_PAGE_SIZE >= total) statusRef.current?.focus();
    loadMore();
  };

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, href: string) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    router.push(href);
  };

  return (
    <Card variant="elevated" className="w-full gap-0 py-0">
      <div className="flex items-center justify-between gap-3 border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-lg font-semibold text-cf-ink">Today&apos;s Visits</h2>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={viewAllHref} />}>
          <Eye />
          View All
        </Button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <CalendarX className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-cf-ink">
              {isFiltered ? `No ${visitWord} today` : "No visits scheduled today"}
            </p>
            <p className="mt-1 text-xs text-cf-ink-60">
              {isFiltered
                ? "There is nothing in this group right now."
                : "Visits will appear here once they are scheduled."}
            </p>
          </div>
          {isFiltered ? (
            <Button variant="outline" size="sm" onClick={() => onFilterChange("all")}>
              Show all visits
            </Button>
          ) : (
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={viewAllHref} />}>
              Go to scheduling
            </Button>
          )}
        </div>
      ) : (
        <div className="p-4" aria-busy={isLoading}>
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
              {isLoading &&
                Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} aria-hidden="true">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                shownVisits.map((visit) => {
                  const href = getPatientHref?.(visit);
                  return (
                    <TableRow
                      key={visit.id}
                      onClick={href ? (event) => handleRowClick(event, href) : undefined}
                      className={href ? "cursor-pointer" : undefined}
                    >
                      <TableCell>
                        <VisitPatientCell visit={visit} href={href} />
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
                  );
                })}
            </TableBody>
          </Table>
        </div>
      )}

      <div
        className={
          showFooter
            ? "flex flex-wrap items-center justify-between gap-3 border-t border-cf-border-light px-4 py-3"
            : "sr-only"
        }
      >
        <p ref={statusRef} tabIndex={-1} role="status" className="text-xs text-cf-ink-60 outline-none">
          {statusText}
        </p>
        {hasMore && (
          <Button variant="outline" size="sm" onClick={handleLoadMore}>
            {/* CHANGED: `remaining` comes from the hook */}
            Load more ({remaining} left)
          </Button>
        )}
      </div>
    </Card>
  );
}