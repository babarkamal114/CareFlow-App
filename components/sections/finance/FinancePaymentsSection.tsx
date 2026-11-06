"use client";

import {
  Button,
  EmptyState,
  FundingSourceBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { BellRing, CheckCircle2, CreditCard } from "lucide-react";
import { useMemo } from "react";
import type { Invoice, Payment } from "types";
import { formatCurrency, formatShortDate, getInvoiceBalance, PAYMENT_METHOD_LABEL } from "utils";

interface FinancePaymentsSectionProps {
  payments: Payment[];
  overdueInvoices: Invoice[];
  onSendReminders: () => void;
}

/** Payment tracking + overdue reminders (Blueprint 3.6.2). */
export function FinancePaymentsSection({ payments, overdueInvoices, onSendReminders }: FinancePaymentsSectionProps) {
  const sorted = useMemo(
    () => [...payments].sort((a, b) => b.receivedDate.getTime() - a.receivedDate.getTime()),
    [payments],
  );
  const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + getInvoiceBalance(inv), 0);
  const hasOverdue = overdueInvoices.length > 0;

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
          hasOverdue ? "border-destructive/30 bg-cf-red-50" : "border-brand-200 bg-brand-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {hasOverdue ? (
            <BellRing className="size-5 text-destructive" />
          ) : (
            <CheckCircle2 className="size-5 text-brand-600" />
          )}
          <div>
            <p className="text-sm font-semibold text-cf-ink">
              {hasOverdue
                ? `${overdueInvoices.length} overdue ${overdueInvoices.length === 1 ? "invoice" : "invoices"} · ${formatCurrency(overdueTotal)}`
                : "No overdue invoices"}
            </p>
            <p className="text-xs text-cf-ink-60">
              {hasOverdue ? "Send an automatic reminder to each payer." : "Everything issued is paid or within terms."}
            </p>
          </div>
        </div>
        {hasOverdue && (
          <Button variant="outline" size="sm" onClick={onSendReminders}>
            Review &amp; send reminders
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<CreditCard />} title="No payments yet" description="Payments you record against invoices will appear here." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Funder</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="whitespace-nowrap text-cf-ink-60">{formatShortDate(p.receivedDate)}</TableCell>
                <TableCell className="font-medium text-cf-ink">{p.reference}</TableCell>
                <TableCell>{p.invoiceNumber}</TableCell>
                <TableCell className="whitespace-nowrap">{p.patientName}</TableCell>
                <TableCell><FundingSourceBadge source={p.fundingSource} /></TableCell>
                <TableCell>{PAYMENT_METHOD_LABEL[p.method]}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(p.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}