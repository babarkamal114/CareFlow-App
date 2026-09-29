"use client";

import React, { useState } from "react";
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

import {
  VISIT_TABLE_COLUMNS,
  buildVisitFilterOptions,
  canSeeVisits,
  formatNameWithInitial,
  getStatusBadgeVariant,
  getTodaysVisitRows,
  getVisitFilterButtonLabel,
  statusLabelMap,
  toggleVisitStatusFilter,
  type VisitStatus,
} from "utils";

// Kept so other files that import these from here keep working.
export {
  statusPastelMap,
  statusLabelMap,
  getStatusBadgeVariant,
  formatNameWithInitial,
} from "utils";

const headClass = "text-xs font-semibold text-cf-ink-60";

function VisitsTable() {
  const [status, setStatus] = useState<VisitStatus | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const rows = getTodaysVisitRows(status);
  const filterOptions = buildVisitFilterOptions(status);

  return (
    <div className="cf-glass-panel w-full rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-cf-border">
        <h3 className="text-lg font-semibold text-cf-ink">Today&apos;s Visits</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters((s) => !s)}>
            <Filter className="h-3.5 w-3.5" />
            {getVisitFilterButtonLabel(status)}
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
          {filterOptions.map((option) => (
            <Button
              key={option.status}
              variant="outline"
              size="sm"
              className={option.isActive ? "bg-cf-brand-500/10 text-cf-brand-500" : ""}
              onClick={() => setStatus(toggleVisitStatusFilter(status, option.status))}
            >
              {option.text}
            </Button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-cf-surface-muted hover:bg-cf-surface-muted">
              {VISIT_TABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${headClass} ${col.align === "right" ? "text-right" : ""}`}
                  style={{ minWidth: col.minWidth }}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={VISIT_TABLE_COLUMNS.length}
                  className="py-10 text-center text-sm text-cf-ink-60"
                >
                  No visits found.
                </TableCell>
              </TableRow>
            )}

            {rows.map((visit) => (
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
