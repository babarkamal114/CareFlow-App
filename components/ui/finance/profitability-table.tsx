"use client";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { ReactNode } from "react";
import { formatCurrency, formatPercent } from "utils";

export interface ProfitabilityColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
}

interface ProfitabilityTableProps<T> {
  rows: T[];
  columns: ProfitabilityColumn<T>[];
  getRowKey: (row: T) => string;
}

/** One table for all four reports (patient / area / carer / P&L) — each section just supplies columns. */
export function ProfitabilityTable<T>({ rows, columns, getRowKey }: ProfitabilityTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.align === "right" ? "text-right" : undefined}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.align === "right" ? "text-right tabular-nums" : undefined}>
                {col.render(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Money cell; negative values (a loss) turn red. */
export function MoneyCell({ value }: { value: number }) {
  return (
    <span className={value < 0 ? "font-semibold text-destructive" : undefined}>{formatCurrency(value, true)}</span>
  );
}

/** Margin pill: healthy >= 25%, watch 10–25%, loss-making below 10%. */
export function MarginBadge({ pct }: { pct: number }) {
  const variant = pct >= 25 ? "softSuccess" : pct >= 10 ? "softWarning" : "softDanger";
  return (
    <Badge variant={variant} shape="pill" badgeSize="md">
      {formatPercent(pct)}
    </Badge>
  );
}