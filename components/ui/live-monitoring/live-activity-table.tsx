"use client";

import {
  EmptyState,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Radio } from "lucide-react";
import type { LiveActivityTableProps } from "types";
import { LiveActivityFilterTabs } from "./live-activity-filter-tabs";
import { LiveActivityRow } from "./live-activity-row";

const headClass = "text-xs font-semibold text-cf-ink-60";

export function LiveActivityTable({
  rows,
  filters,
  activeFilter,
  onFilterChange,
}: LiveActivityTableProps) {
  return (
    <div className="cf-glass-panel w-full rounded-xl overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-cf-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-cf-ink">Current Activity</h3>
        <LiveActivityFilterTabs
          filters={filters}
          value={activeFilter}
          onChange={onFilterChange}
        />
      </div>

      {rows.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={<Radio />}
            title="Nothing here right now"
            description="No visits currently match this filter."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-cf-surface-muted hover:bg-cf-surface-muted">
                <TableHead className={`${headClass} min-w-[200px]`}>Patient</TableHead>
                <TableHead className={`${headClass} min-w-[150px]`}>Carer</TableHead>
                <TableHead className={`${headClass} min-w-[120px]`}>Scheduled</TableHead>
                <TableHead className={`${headClass} min-w-[110px]`}>Status</TableHead>
                <TableHead className={`${headClass} text-right min-w-[140px]`}>Live</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <LiveActivityRow key={row.visit.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
