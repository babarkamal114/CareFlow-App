"use client";

import { Button, DatePicker, InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui";
import { format } from "date-fns";
import { Search } from "lucide-react";
import type { AuditEntity, AuditFilters, ComplianceFormErrors } from "types";
import { AUDIT_ENTITIES, parseLocalDate } from "utils";
import { FilterPill } from "./filter-pill";

interface AuditFiltersBarProps {
  filters: AuditFilters;
  errors: ComplianceFormErrors;
  onChange: (next: AuditFilters) => void;
  onReset: () => void;
}

const toIso = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : "");

/** Search + type pills + date range (Blueprint 3.4.2: searchable by user, patient, date range or action type). */
export function AuditFiltersBar({ filters, errors, onChange, onReset }: AuditFiltersBarProps) {
  const isActive = filters.search !== "" || filters.entity !== "All" || filters.from !== "" || filters.to !== "";

  return (
    <div className="space-y-2">
      <InputGroup className="bg-cf-surface-muted">
        <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
        <InputGroupInput placeholder="Search by user, patient or action…" value={filters.search} aria-label="Search audit trail"
          onChange={(e) => onChange({ ...filters, search: e.target.value })} />
      </InputGroup>

      <div className="flex flex-wrap gap-1.5">
        {AUDIT_ENTITIES.map((type) => (
          <FilterPill key={type} label={type} active={filters.entity === type} onClick={() => onChange({ ...filters, entity: type as AuditEntity | "All" })} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DatePicker className="min-w-0 text-xs" placeholder="From date" value={parseLocalDate(filters.from)}
          onChange={(d) => onChange({ ...filters, from: toIso(d) })} />
        <span className="text-xs text-cf-ink-40">to</span>
        <DatePicker className="min-w-0 text-xs" placeholder="To date" value={parseLocalDate(filters.to)}
          onChange={(d) => onChange({ ...filters, to: toIso(d) })} />
        {isActive && <Button variant="ghost" size="sm" onClick={onReset}>Clear filters</Button>}
      </div>
      {errors.to && <p role="alert" className="text-xs text-error">{errors.to}</p>}
    </div>
  );
}
