"use client";

import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  StaffFormFieldRow,
} from "@/components/ui";
import { validateRecordPayment } from "lib";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import type { FinanceFormErrors, Invoice, RecordPaymentFormData } from "types";
import { formatCurrency, getInvoiceBalance, PAYMENT_METHOD_OPTIONS } from "utils";
import { FinanceSelect } from "./finance-select";

interface RecordPaymentDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asOf: Date;
  onSubmit: (invoice: Invoice, data: RecordPaymentFormData) => void;
}

export function RecordPaymentDialog({ invoice, open, onOpenChange, asOf, onSubmit }: RecordPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        {invoice && (
          <RecordPaymentForm
            invoice={invoice}
            asOf={asOf}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RecordPaymentForm({
  invoice,
  asOf,
  onSubmit,
  onCancel,
}: Pick<RecordPaymentDialogProps, "asOf" | "onSubmit"> & { invoice: Invoice; onCancel: () => void }) {
  const balance = getInvoiceBalance(invoice);
  const [form, setForm] = useState<RecordPaymentFormData>({
    invoiceId: invoice.id,
    amount: balance,
    method: "",
    receivedDate: format(asOf, "yyyy-MM-dd"),
    reference: "",
  });
  const [errors, setErrors] = useState<FinanceFormErrors>({});

  const update = <K extends keyof RecordPaymentFormData>(key: K, value: RecordPaymentFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const next = validateRecordPayment(form, balance);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(invoice, form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Record payment</DialogTitle>
        <DialogDescription>
          {invoice.number} · {invoice.patientName} · {formatCurrency(balance)} outstanding
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <StaffFormFieldRow label="Amount" required htmlFor="pay-amount" error={errors.amount}>
          <InputGroup className="h-10">
            <InputGroupAddon>£</InputGroupAddon>
            <InputGroupInput
              id="pay-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={form.amount}
              aria-invalid={Boolean(errors.amount)}
              onChange={(e) => update("amount", e.target.value === "" ? "" : Number(e.target.value))}
            />
            <InputGroupAddon align="inline-end">
              <Button variant="ghost" size="xs" onClick={() => update("amount", balance)}>
                Pay in full
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </StaffFormFieldRow>

        <div className="grid grid-cols-2 gap-3">
          <StaffFormFieldRow label="Method" required htmlFor="pay-method" error={errors.method}>
            <FinanceSelect
              id="pay-method"
              value={form.method}
              options={PAYMENT_METHOD_OPTIONS}
              onChange={(method) => update("method", method)}
              invalid={Boolean(errors.method)}
            />
          </StaffFormFieldRow>
          <StaffFormFieldRow label="Date received" required htmlFor="pay-date" error={errors.receivedDate}>
            <DatePicker
              id="pay-date"
              className="w-full min-w-0"
              value={form.receivedDate ? parseISO(form.receivedDate) : undefined}
              onChange={(d) => update("receivedDate", d ? format(d, "yyyy-MM-dd") : "")}
            />
          </StaffFormFieldRow>
        </div>

        <StaffFormFieldRow label="Reference" optional htmlFor="pay-ref" error={errors.reference}>
          <Input
            id="pay-ref"
            value={form.reference}
            placeholder="e.g. bank reference"
            aria-invalid={Boolean(errors.reference)}
            onChange={(e) => update("reference", e.target.value)}
          />
        </StaffFormFieldRow>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Record payment</Button>
      </DialogFooter>
    </>
  );
}