"use client";

import { toast } from "@/components/ui";
import { parseISO } from "date-fns";
import {
  FINANCE_MOCK_TODAY,
  mockInvoices,
  mockPayments,
  mockRateCard,
  mockRevenueTrend,
} from "lib";
import { useMemo, useState } from "react";
import type {
  GenerateInvoicesFormData,
  Invoice,
  Payment,
  PaymentMethod,
  RateCardEntry,
  RateFormData,
  RecordPaymentFormData,
} from "types";
import {
  countInvoicesByStatus,
  formatCurrency,
  getInvoiceDisplayStatus,
  getRevenueByFunding,
  round2,
  summarizeRevenue,
} from "utils";

interface OverlayState {
  id: string | null;
  open: boolean;
}

export function useFinanceWorkspace() {
  const asOf = FINANCE_MOCK_TODAY;

  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [rates, setRates] = useState<RateCardEntry[]>(mockRateCard);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [detail, setDetail] = useState<OverlayState>({ id: null, open: false });
  const [paying, setPaying] = useState<OverlayState>({ id: null, open: false });
  const [rateDialog, setRateDialog] = useState<{ entry: RateCardEntry | null; open: boolean }>({
    entry: null,
    open: false,
  });

  // ---- Derived data ----
  const summary = useMemo(() => summarizeRevenue(invoices, asOf), [invoices, asOf]);
  const byFunding = useMemo(() => getRevenueByFunding(invoices, asOf), [invoices, asOf]);
  const statusCounts = useMemo(() => countInvoicesByStatus(invoices, asOf), [invoices, asOf]);
  const overdueInvoices = useMemo(
    () => invoices.filter((inv) => getInvoiceDisplayStatus(inv, asOf) === "overdue"),
    [invoices, asOf],
  );

  // Overlays store ids (not objects) so they always show the latest invoice after an update.
  const detailInvoice = invoices.find((inv) => inv.id === detail.id) ?? null;
  const payingInvoice = invoices.find((inv) => inv.id === paying.id) ?? null;

  // ---- Open / close ----
  const openDetail = (invoice: Invoice) => setDetail({ id: invoice.id, open: true });
  const closeDetail = (open: boolean) => setDetail((prev) => ({ ...prev, open }));
  const openPayment = (invoice: Invoice) => {
    setDetail((prev) => ({ ...prev, open: false }));
    setPaying({ id: invoice.id, open: true });
  };
  const closePayment = (open: boolean) => setPaying((prev) => ({ ...prev, open }));
  const openRateDialog = (entry: RateCardEntry | null) => setRateDialog({ entry, open: true });
  const closeRateDialog = (open: boolean) => setRateDialog((prev) => ({ ...prev, open }));

  // ---- Actions ----
  const recordPayment = (invoice: Invoice, data: RecordPaymentFormData) => {
    const amount = Number(data.amount);
    const paid = round2(invoice.amountPaid + amount);

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, amountPaid: paid, status: paid >= inv.subtotal ? "paid" : "partially-paid" }
          : inv,
      ),
    );
    setPayments((prev) => [
      {
        id: `pay-new-${invoice.id}-${prev.length}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        patientName: invoice.patientName,
        fundingSource: invoice.fundingSource,
        amount,
        method: data.method as PaymentMethod,
        receivedDate: parseISO(data.receivedDate),
        reference: data.reference || "—",
      },
      ...prev,
    ]);
    closePayment(false);
    toast.success(`${formatCurrency(amount)} recorded against ${invoice.number}`);
  };

  const generateInvoices = (data: GenerateInvoicesFormData) => {
    // Mock behaviour: real generation will build invoices from confirmed visits for the period.
    const matching = invoices.filter(
      (inv) => inv.status === "draft" && data.fundingSources.includes(inv.fundingSource),
    );
    if (data.sendImmediately) {
      const ids = new Set(matching.map((inv) => inv.id));
      setInvoices((prev) => prev.map((inv) => (ids.has(inv.id) ? { ...inv, status: "sent" } : inv)));
    }
    setGenerateOpen(false);

    if (matching.length === 0) toast.info("No new invoices to generate for that period");
    else if (data.sendImmediately) toast.success(`${matching.length} invoice(s) generated and sent`);
    else toast.success(`${matching.length} draft invoice(s) ready to review`);
  };

  const sendInvoices = (ids: string[]) => {
    const idSet = new Set(ids);
    setInvoices((prev) =>
      prev.map((inv) => (idSet.has(inv.id) && inv.status === "draft" ? { ...inv, status: "sent" } : inv)),
    );
    toast.success(`${ids.length} invoice(s) sent`);
  };

  const sendReminders = (ids: string[]) => {
    setReminderOpen(false);
    toast.success(`Payment reminders sent for ${ids.length} overdue invoice(s)`);
  };

  const saveRate = (data: RateFormData) => {
    const entry: RateCardEntry = {
      id: `rate-${data.dayType}-${data.durationMins}`,
      durationMins: Number(data.durationMins) as RateCardEntry["durationMins"],
      dayType: data.dayType as RateCardEntry["dayType"],
      rate: Number(data.rate),
    };
    setRates((prev) =>
      prev.some((r) => r.id === entry.id) ? prev.map((r) => (r.id === entry.id ? entry : r)) : [...prev, entry],
    );
    closeRateDialog(false);
    toast.success("Rate saved");
  };

  const exportData = (label: string) => toast.info(`${label} export started`);

  return {
    asOf,
    invoices,
    payments,
    rates,
    trend: mockRevenueTrend,
    summary,
    byFunding,
    statusCounts,
    overdueInvoices,
    generateOpen,
    setGenerateOpen,
    reminderOpen,
    setReminderOpen,
    detail: { invoice: detailInvoice, open: detail.open },
    paying: { invoice: payingInvoice, open: paying.open },
    rateDialog,
    openDetail,
    closeDetail,
    openPayment,
    closePayment,
    openRateDialog,
    closeRateDialog,
    recordPayment,
    generateInvoices,
    sendInvoices,
    sendReminders,
    saveRate,
    exportData,
  };
}

export type FinanceWorkspace = ReturnType<typeof useFinanceWorkspace>;