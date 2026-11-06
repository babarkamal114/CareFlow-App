"use client";

import {
  GenerateInvoicesDialog,
  InvoiceDetailSheet,
  RateFormDialog,
  RecordPaymentDialog,
  SendReminderDialog,
} from "@/components/ui";
import { useFinanceWorkspace } from "lib";
import { FinanceHeaderSection } from "./FinanceHeaderSection";
import { FinanceStatsSection } from "./FinanceStatsSection";
import { FinanceTabsSection } from "./FinanceTabsSection";

/** Top-level Finance section: owns the workspace state and every dialog / drawer. */
export function FinanceWorkspaceSection() {
  const w = useFinanceWorkspace();
  const issuedCount = w.statusCounts.all - w.statusCounts.draft;

  return (
    <>
      <FinanceHeaderSection
        overdueCount={w.overdueInvoices.length}
        onGenerate={() => w.setGenerateOpen(true)}
        onSendReminders={() => w.setReminderOpen(true)}
      />
      <FinanceStatsSection summary={w.summary} issuedCount={issuedCount} overdueCount={w.overdueInvoices.length} />
      <FinanceTabsSection workspace={w} />

      <GenerateInvoicesDialog
        open={w.generateOpen}
        onOpenChange={w.setGenerateOpen}
        asOf={w.asOf}
        onSubmit={w.generateInvoices}
      />
      <InvoiceDetailSheet
        invoice={w.detail.invoice}
        open={w.detail.open}
        onOpenChange={w.closeDetail}
        asOf={w.asOf}
        onRecordPayment={w.openPayment}
        onDownload={(inv) => w.exportData(`${inv.number} PDF`)}
      />
      <RecordPaymentDialog
        invoice={w.paying.invoice}
        open={w.paying.open}
        onOpenChange={w.closePayment}
        asOf={w.asOf}
        onSubmit={w.recordPayment}
      />
      <SendReminderDialog
        open={w.reminderOpen}
        onOpenChange={w.setReminderOpen}
        overdueInvoices={w.overdueInvoices}
        asOf={w.asOf}
        onConfirm={w.sendReminders}
      />
      <RateFormDialog
        open={w.rateDialog.open}
        onOpenChange={w.closeRateDialog}
        entry={w.rateDialog.entry}
        onSubmit={w.saveRate}
      />
    </>
  );
}