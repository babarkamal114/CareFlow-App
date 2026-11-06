"use client";

import { Button } from "@/components/ui";
import { Send } from "lucide-react";

interface InvoiceBulkBarProps {
  selectedCount: number;
  onClear: () => void;
  onSend: () => void;
}

/** Appears under the invoice table when rows are ticked (batch send, Blueprint 3.6.1). */
export function InvoiceBulkBar({ selectedCount, onClear, onSend }: InvoiceBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-cf-border-light bg-cf-surface-muted/50 px-4 py-3">
      <p className="text-sm font-medium text-cf-ink">{selectedCount} selected</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" onClick={onSend}>
          <Send />
          Send {selectedCount === 1 ? "invoice" : "invoices"}
        </Button>
      </div>
    </div>
  );
}