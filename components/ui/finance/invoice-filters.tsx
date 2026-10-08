"use client";

import { Button, InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui";
import { Search } from "lucide-react";
import type { FundingSource, InvoiceFilters, InvoiceStatus } from "types";
import { FUNDING_SOURCE_OPTIONS, INVOICE_STATUS_OPTIONS } from "utils";
import { FinanceSelect } from "./finance-select";

const STATUS_OPTIONS: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...INVOICE_STATUS_OPTIONS,
];

const FUNDING_OPTIONS: { value: FundingSource | "all"; label: string }[] = [
  { value: "all", label: "All funders" },
  ...FUNDING_SOURCE_OPTIONS,
];

interface InvoiceFiltersProps {
  filters: InvoiceFilters;
  onChange: (next: InvoiceFilters) => void;
}

export function InvoiceFiltersBar({ filters, onChange }: InvoiceFiltersProps) {
  const isActive = filters.search !== "" || filters.status !== "all" || filters.funding !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="w-full max-w-xs bg-cf-surface">
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search invoice or patient…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          aria-label="Search invoices"
        />
      </InputGroup>

      <FinanceSelect
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(status) => onChange({ ...filters, status })}
        className="w-40"
      />
      <FinanceSelect
        value={filters.funding}
        options={FUNDING_OPTIONS}
        onChange={(funding) => onChange({ ...filters, funding })}
        className="w-40"
      />

      {isActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ search: "", status: "all", funding: "all" })}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}