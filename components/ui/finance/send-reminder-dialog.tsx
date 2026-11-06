"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Send } from "lucide-react";
import type { Invoice } from "types";
import { formatCurrency, getDaysOverdue, getInvoiceBalance } from "utils";

interface SendReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overdueInvoices: Invoice[];
  asOf: Date;
  onConfirm: (invoiceIds: string[]) => void;
}

/** Confirms a payment reminder for every overdue invoice (Blueprint 3.6.2). */
export function SendReminderDialog({ open, onOpenChange, overdueInvoices, asOf, onConfirm }: SendReminderDialogProps) {
  const total = overdueInvoices.reduce((sum, inv) => sum + getInvoiceBalance(inv), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-cf-ink">Send payment reminders</DialogTitle>
          <DialogDescription>
            {overdueInvoices.length} overdue {overdueInvoices.length === 1 ? "invoice" : "invoices"} · {formatCurrency(total)} outstanding
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-64 divide-y divide-cf-border-light overflow-y-auto rounded-lg border border-cf-border-light">
          {overdueInvoices.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-cf-ink">{inv.number} · {inv.patientName}</p>
                <p className="text-xs text-destructive">{getDaysOverdue(inv, asOf)} days overdue</p>
              </div>
              <span className="font-semibold tabular-nums text-cf-ink">{formatCurrency(getInvoiceBalance(inv))}</span>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={overdueInvoices.length === 0} onClick={() => onConfirm(overdueInvoices.map((i) => i.id))}>
            <Send />
            Send reminders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}