"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { PnlMonth } from "types";
import { formatCurrency, getMarginPct, getPnlDirectCosts, getPnlGrossMargin, getPnlMarginPct } from "utils";
import { MarginBadge } from "./profitability-table";

/** Monthly P&L: revenue, direct costs, gross margin (Blueprint 3.6.3). */
export function PnlSummaryCard({ months }: { months: PnlMonth[] }) {
  const revenue = months.reduce((s, m) => s + m.revenue, 0);
  const costs = months.reduce((s, m) => s + getPnlDirectCosts(m), 0);

  return (
    <Card className="rounded-2xl border-cf-border-light shadow-cf-sm">
      <CardHeader>
        <CardTitle className="font-bold text-cf-ink">Monthly P&amp;L summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Carer pay</TableHead>
              <TableHead className="text-right">Travel</TableHead>
              <TableHead className="text-right">Expenses</TableHead>
              <TableHead className="text-right">Gross margin</TableHead>
              <TableHead className="text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {months.map((m) => (
              <TableRow key={m.month}>
                <TableCell className="font-medium text-cf-ink">{m.month}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(m.revenue, true)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(m.carerPay, true)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(m.travelCosts, true)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(m.expenses, true)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(getPnlGrossMargin(m), true)}</TableCell>
                <TableCell className="text-right"><MarginBadge pct={getPnlMarginPct(m)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(revenue, true)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(months.reduce((s, m) => s + m.carerPay, 0), true)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(months.reduce((s, m) => s + m.travelCosts, 0), true)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(months.reduce((s, m) => s + m.expenses, 0), true)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(revenue - costs, true)}</TableCell>
              <TableCell className="text-right"><MarginBadge pct={getMarginPct(revenue, costs)} /></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}