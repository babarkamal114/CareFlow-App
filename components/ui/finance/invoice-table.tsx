"use client";

import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { CreditCard, Eye, FileText, MoreHorizontal } from "lucide-react";
import type { Invoice } from "types";
import {
  formatCurrency,
  formatShortDate,
  getDaysOverdue,
  getInvoiceBalance,
  getInvoiceDisplayStatus,
} from "utils";
import { FundingSourceBadge } from "./funding-source-badge";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceTableProps {
  invoices: Invoice[];
  asOf: Date;
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onView: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export function InvoiceTable({
  invoices,
  asOf,
  selectedIds,
  onSelectedIdsChange,
  onView,
  onRecordPayment,
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={<FileText />}
        title="No invoices found"
        description="Try changing or clearing your filters, or generate invoices for a billing period."
      />
    );
  }

  const allSelected = invoices.every((inv) => selectedIds.has(inv.id));
  const someSelected = !allSelected && invoices.some((inv) => selectedIds.has(inv.id));

  const toggleAll = (checked: boolean) =>
    onSelectedIdsChange(checked ? new Set(invoices.map((inv) => inv.id)) : new Set());

  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectedIdsChange(next);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={(checked) => toggleAll(checked === true)}
              aria-label="Select all invoices"
            />
          </TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Funder</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Due</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => {
          const status = getInvoiceDisplayStatus(invoice, asOf);
          const balance = getInvoiceBalance(invoice);
          const daysOverdue = getDaysOverdue(invoice, asOf);
          const canPay = status !== "draft" && balance > 0;

          return (
            <TableRow key={invoice.id} data-state={selectedIds.has(invoice.id) ? "selected" : undefined}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(invoice.id)}
                  onCheckedChange={(checked) => toggleOne(invoice.id, checked === true)}
                  aria-label={`Select ${invoice.number}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => onView(invoice)}
                    className="w-fit font-semibold text-cf-ink hover:text-brand-600 hover:underline"
                  >
                    {invoice.number}
                  </button>
                  {invoice.isSplitBilled && (
                    <Badge variant="outlineMuted" badgeSize="sm" className="w-fit">
                      Split billed
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap font-medium text-cf-ink">{invoice.patientName}</TableCell>
              <TableCell>
                <FundingSourceBadge source={invoice.fundingSource} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-cf-ink-60">
                {formatShortDate(invoice.periodStart)} – {formatShortDate(invoice.periodEnd)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="text-cf-ink-60">{formatShortDate(invoice.dueDate)}</span>
                {daysOverdue > 0 && (
                  <span className="block text-xs font-semibold text-destructive">{daysOverdue}d overdue</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(invoice.subtotal)}</TableCell>
              <TableCell
                className={`text-right tabular-nums ${status === "overdue" ? "font-semibold text-destructive" : ""}`}
              >
                {formatCurrency(balance)}
              </TableCell>
              <TableCell>
                <InvoiceStatusBadge status={status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${invoice.number}`} />}
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 border-cf-border bg-cf-surface">
                    <DropdownMenuItem onClick={() => onView(invoice)} className="gap-2">
                      <Eye className="size-4 text-cf-ink-60" />
                      View invoice
                    </DropdownMenuItem>
                    {canPay && (
                      <DropdownMenuItem onClick={() => onRecordPayment(invoice)} className="gap-2">
                        <CreditCard className="size-4 text-cf-ink-60" />
                        Record payment
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}