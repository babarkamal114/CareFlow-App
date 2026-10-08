"use client";

import {
  ExportMenu,
  INVOICE_EXPORT_OPTIONS,
  InvoiceBulkBar,
  InvoiceFiltersBar,
  InvoiceTable,
} from "@/components/ui";
import { useMemo, useState } from "react";
import type { Invoice, InvoiceFilters } from "types";
import { filterInvoices } from "utils";

interface FinanceInvoicesSectionProps {
  invoices: Invoice[];
  asOf: Date;
  onView: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
  onSendInvoices: (ids: string[]) => void;
  onExport: (label: string) => void;
}

export function FinanceInvoicesSection({
  invoices,
  asOf,
  onView,
  onRecordPayment,
  onSendInvoices,
  onExport,
}: FinanceInvoicesSectionProps) {
  const [filters, setFilters] = useState<InvoiceFilters>({ search: "", status: "all", funding: "all" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => filterInvoices(invoices, filters, asOf), [invoices, filters, asOf]);

  const handleSend = () => {
    onSendInvoices([...selectedIds]);
    setSelectedIds(new Set());
  };

  const handleExport = (id: string) => {
    const label = INVOICE_EXPORT_OPTIONS.find((o) => o.id === id)?.label ?? id;
    onExport(label);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <InvoiceFiltersBar filters={filters} onChange={setFilters} />
        <ExportMenu options={INVOICE_EXPORT_OPTIONS} onSelect={handleExport} />
      </div>

      <InvoiceTable
        invoices={filtered}
        asOf={asOf}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onView={onView}
        onRecordPayment={onRecordPayment}
      />

      <InvoiceBulkBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onSend={handleSend}
      />
    </div>
  );
}