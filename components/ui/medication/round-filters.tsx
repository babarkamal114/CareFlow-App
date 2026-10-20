"use client";

import { Button, InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui";
import { Search } from "lucide-react";
import type { MedicationPatient, RoundFilter, RoundFilters } from "types";
import { ROUND_FILTER_OPTIONS } from "utils";
import { MedSelect } from "./med-select";

interface MedicationRoundFiltersProps { filters: RoundFilters; patients: MedicationPatient[]; onChange: (next: RoundFilters) => void; onReset: () => void }

export function MedicationRoundFilters({ filters, patients, onChange, onReset }: MedicationRoundFiltersProps) {
  const patientOptions: { value: string; label: string }[] = [{ value: "all", label: "All patients" }, ...patients.map((p) => ({ value: p.id, label: p.name }))];
  const active = filters.search !== "" || filters.status !== "all" || filters.patientId !== "all";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="w-full max-w-xs bg-cf-surface">
        <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
        <InputGroupInput placeholder="Search patient or medication…" value={filters.search} aria-label="Search the round" onChange={(e) => onChange({ ...filters, search: e.target.value })} />
      </InputGroup>
      <MedSelect<RoundFilter> value={filters.status} options={ROUND_FILTER_OPTIONS} onChange={(status) => onChange({ ...filters, status })} className="w-44" />
      <MedSelect value={filters.patientId} options={patientOptions} onChange={(patientId) => onChange({ ...filters, patientId })} className="w-44" />
      {active && <Button variant="ghost" size="sm" onClick={onReset}>Clear filters</Button>}
    </div>
  );
}
