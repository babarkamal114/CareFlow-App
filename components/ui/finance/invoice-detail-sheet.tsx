"use client";

import {
  Button,
  Progress,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { CreditCard, Download } from "lucide-react";
import type { Invoice } from "types";
import {
  DAY_TYPE_LABEL,
  formatCurrency,
  formatShortDate,
  getInvoiceBalance,
  getInvoiceDisplayStatus,
} from "utils";
import { FundingSourceBadge } from "./funding-source-badge";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceDetailSheetProps {
  invoice: Invoice | null;
  asOf: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordPayment: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

export function InvoiceDetailSheet({
  invoice,
  asOf,
  open,
  onOpenChange,
  onRecordPayment,
  onDownload,
}: InvoiceDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {invoice && <InvoiceDetailBody invoice={invoice} asOf={asOf} onRecordPayment={onRecordPayment} onDownload={onDownload} />}
      </SheetContent>
    </Sheet>
  );
}

function InvoiceDetailBody({
  invoice,
  asOf,
  onRecordPayment,
  onDownload,
}: Omit<InvoiceDetailSheetProps, "open" | "onOpenChange" | "invoice"> & { invoice: Invoice }) {
  const status = getInvoiceDisplayStatus(invoice, asOf);
  const balance = getInvoiceBalance(invoice);
  const paidPct = invoice.subtotal > 0 ? (invoice.amountPaid / invoice.subtotal) * 100 : 0;
  const canPay = status !== "draft" && balance > 0;

  const meta = [
    { label: "Issued", value: formatShortDate(invoice.issueDate) },
    { label: "Due", value: formatShortDate(invoice.dueDate) },
    { label: "Period", value: `${formatShortDate(invoice.periodStart)} – ${formatShortDate(invoice.periodEnd)}` },
    { label: "Payer", value: invoice.payerName },
  ];

  return (
    <>
      <SheetHeader className="border-b border-cf-border-light pb-4">
        <div className="flex items-center gap-2 pr-10">
          <SheetTitle className="font-heading text-xl font-semibold text-cf-ink">{invoice.number}</SheetTitle>
          <InvoiceStatusBadge status={status} />
        </div>
        <SheetDescription className="flex items-center gap-2 text-cf-ink-60">
          {invoice.patientName}
          <FundingSourceBadge source={invoice.fundingSource} />
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5 px-4">
        <dl className="grid grid-cols-2 gap-3">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-[11px] font-bold tracking-[0.06em] text-cf-ink-40 uppercase">{item.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-cf-ink">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2 rounded-lg border border-cf-border-light bg-cf-surface-muted/50 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.06em] text-cf-ink-40 uppercase">Balance due</p>
              <p className="font-heading text-2xl font-bold text-cf-ink">{formatCurrency(balance)}</p>
            </div>
            <p className="text-xs text-cf-ink-60">
              {formatCurrency(invoice.amountPaid)} of {formatCurrency(invoice.subtotal)} paid
            </p>
          </div>
          <Progress value={paidPct} trackSize="sm" />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-cf-ink">Visits ({invoice.lines.length})</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Visit</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="whitespace-nowrap text-cf-ink-60">{formatShortDate(line.visitDate)}</TableCell>
                  <TableCell>
                    {line.durationMins} min
                    <span className="block text-xs text-cf-ink-60">{DAY_TYPE_LABEL[line.dayType]}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(line.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-auto flex gap-2 border-t border-cf-border-light p-4">
        {canPay && (
          <Button onClick={() => onRecordPayment(invoice)} className="flex-1">
            <CreditCard />
            Record payment
          </Button>
        )}
        <Button variant="outline" onClick={() => onDownload?.(invoice)} className="flex-1">
          <Download />
          Download PDF
        </Button>
      </div>
    </>
  );
}