"use client";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { ReportColumn, ReportRow } from "types";
import { formatReportValue, REPORT_STATUS_BADGE } from "utils";

interface ReportTableProps { columns: ReportColumn[]; rows: ReportRow[]; maxHeight?: string }

const RIGHT = ["number", "percent", "currency"];

export function ReportTable({ columns, rows, maxHeight = "max-h-80" }: ReportTableProps) {
  if (rows.length === 0) return <p className="py-8 text-center text-sm text-cf-ink-40">No rows to show.</p>;
  return (
    <div className={`${maxHeight} overflow-auto`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => <TableHead key={c.key} className={RIGHT.includes(c.kind) ? "text-right" : undefined}>{c.label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              {columns.map((c) => {
                const value = r[c.key];
                const status = c.kind === "status" ? REPORT_STATUS_BADGE[String(value)] : undefined;
                return (
                  <TableCell key={c.key} className={`whitespace-nowrap ${RIGHT.includes(c.kind) ? "text-right tabular-nums" : ""}`}>
                    {c.kind === "status" ? (
                      <Badge variant={status?.variant ?? "pastel-neutral"} shape="pill" badgeSize="sm">{status?.label ?? String(value)}</Badge>
                    ) : formatReportValue(value, c.kind)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
