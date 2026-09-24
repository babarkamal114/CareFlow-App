"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  BadgeProps,
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui";
import { Filter, Eye } from "lucide-react";
import Link from "next/link";

import { useTodaysVisits } from "hooks";
import {
  VISIT_STATUSES,
  canSeeVisits,
  formatNameWithInitial,
  getStatusBadgeVariant,
  mapVisitToRow,
  statusLabelMap,
  type VisitStatus,
} from "utils";

export {
  statusPastelMap,
  statusLabelMap,
  getStatusBadgeVariant,
  formatNameWithInitial,
} from "utils";

const COLUMN_COUNT = 5;

const headClass = "text-xs font-semibold text-cf-ink-60";

function MessageRow({ children }: { children: React.ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={COLUMN_COUNT} className="py-10 text-center text-sm text-cf-ink-60">
        {children}
      </TableCell>
    </TableRow>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, r) => (
        <TableRow key={r}>
          {Array.from({ length: COLUMN_COUNT }).map((__, c) => (
            <TableCell key={c}>
              <div className="h-4 w-3/4 rounded bg-cf-ink-40/20 animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function VisitsTable() {
  const [status, setStatus] = useState<VisitStatus | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, error, refetch } = useTodaysVisits(status);
  const rows = useMemo(() => (data?.visits ?? []).map(mapVisitToRow), [data]);

  return (
    <div className="cf-glass-panel w-full rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-cf-border">
        <h3 className="text-lg font-semibold text-cf-ink">Today&apos;s Visits</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters((s) => !s)}>
            <Filter className="h-3.5 w-3.5" />
            {status ? `Filter · ${statusLabelMap[status]}` : "Filter"}
          </Button>
          <Link href="/visits">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-cf-brand-500">
              <Eye className="h-3.5 w-3.5" />
              View All
            </Button>
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-cf-border">
          {VISIT_STATUSES.map((s) => {
            const active = status === s;
            const count = data?.statusCounts[s];
            return (
              <Button
                key={s}
                variant="outline"
                size="sm"
                className={active ? "bg-cf-brand-500/10 text-cf-brand-500" : ""}
                onClick={() => setStatus(active ? undefined : s)}
              >
                {statusLabelMap[s]}
                {count !== undefined && ` (${count})`}
              </Button>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-cf-surface-muted hover:bg-cf-surface-muted">
              <TableHead className={`${headClass} min-w-[200px]`}>Patient</TableHead>
              <TableHead className={`${headClass} min-w-[150px]`}>Carer</TableHead>
              <TableHead className={`${headClass} min-w-[120px]`}>Time</TableHead>
              <TableHead className={`${headClass} min-w-[100px]`}>Status</TableHead>
              <TableHead className={`${headClass} text-right min-w-[80px]`}>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <SkeletonRows />}

            {!isLoading && error && (
              <MessageRow>
                Couldn&apos;t load visits.{" "}
                <Button onClick={refetch} className="font-semibold text-cf-ink underline">
                  Retry
                </Button>
              </MessageRow>
            )}

            {!isLoading && !error && rows.length === 0 && (
              <MessageRow>No visits found.</MessageRow>
            )}

            {!isLoading &&
              !error &&
              rows.map((visit) => (
                <TableRow key={visit.id} className="hover:bg-cf-surface-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={visit.patient.avatar} alt={visit.patient.name} />
                        <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-xs font-medium">
                          {visit.patient.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-cf-ink">{visit.patient.name}</p>
                        <p className="text-xs text-cf-ink-60">{visit.patient.careType}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-cf-ink-60">
                      {formatNameWithInitial(visit.carer)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-cf-ink-60">{visit.time}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      shape={"pill"}
                      variant={getStatusBadgeVariant(visit.status) as BadgeProps["variant"]}
                    >
                      {statusLabelMap[visit.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-cf-ink-60">{visit.duration} min</span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface DashboardVisitSectionProps {
  role: string;
}

function DashboardVisitSection({ role }: DashboardVisitSectionProps) {
  if (!canSeeVisits(role)) return null;
  return <VisitsTable />;
}

export default DashboardVisitSection;