"use client";

import { Button, RateCardGrid } from "@/components/ui";
import { Plus } from "lucide-react";
import type { RateCardEntry } from "types";

interface FinanceRatesSectionProps {
  rates: RateCardEntry[];
  onAdd: () => void;
  onEdit: (entry: RateCardEntry) => void;
}

/** Rate management (Blueprint 3.6.1): price per visit by length and day type. */
export function FinanceRatesSection({ rates, onAdd, onEdit }: FinanceRatesSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-cf-ink">Visit rate card</h2>
          <p className="text-xs text-cf-ink-60">
            Used when invoices are generated. Click a price to edit it.
          </p>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus />
          Add rate
        </Button>
      </div>
      <RateCardGrid rates={rates} onEdit={onEdit} />
    </div>
  );
}