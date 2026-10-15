"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui";
import { Download, Search } from "lucide-react";
import type { RegCategory, Regulation, RegulationFilters, RegStatus } from "types";
import { REG_CATEGORIES, REG_STATUS_PILL_TONE, REG_STATUSES, TONE_BAR } from "utils";
import { FilterPill } from "./filter-pill";
import { RegulationRow } from "./regulation-row";

interface AllRegulationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regs: Regulation[];
  total: number;
  counts: Record<RegStatus, number>;
  filters: RegulationFilters;
  onFiltersChange: (next: RegulationFilters) => void;
  onSelect: (reg: Regulation) => void;
  onExport: () => void;
}

const LEGEND: { status: RegStatus; tone: "success" | "warning" | "error" }[] = [
  { status: "Compliant", tone: "success" }, { status: "Attention", tone: "warning" }, { status: "Risk", tone: "error" },
];

export function AllRegulationsDialog({ open, onOpenChange, regs, total, counts, filters, onFiltersChange, onSelect, onExport }: AllRegulationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="flex max-h-[88vh] flex-col gap-0 p-0 sm:max-w-4xl">
        <DialogHeader className="flex-shrink-0 space-y-0 border-b border-cf-border-light px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="font-heading text-xl font-bold text-cf-ink">All CQC Regulations</DialogTitle>
              <DialogDescription className="mt-0.5">HSCA 2008 (Regulated Activities) Regulations 2014 — {total} regulations</DialogDescription>
            </div>
            <div className="flex flex-shrink-0 items-center gap-4 text-xs text-cf-ink-60">
              {LEGEND.map((l) => (
                <span key={l.status} className="flex items-center gap-1.5">
                  <span className={`inline-block size-2 rounded-full ${TONE_BAR[l.tone]}`} />{counts[l.status]} {l.status}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <InputGroup className="flex-1 bg-cf-surface-muted">
              <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
              <InputGroupInput placeholder="Search regulations…" value={filters.search} aria-label="Search regulations"
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })} />
            </InputGroup>
            <Button variant="outline" size="sm" onClick={onExport}><Download />Export</Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {REG_CATEGORIES.map((c) => (
                <FilterPill key={c} label={c} active={filters.category === c} onClick={() => onFiltersChange({ ...filters, category: c as RegCategory | "All" })} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REG_STATUSES.map((s) => (
                <FilterPill key={s} label={s} tone={REG_STATUS_PILL_TONE[s]} active={filters.status === s}
                  onClick={() => onFiltersChange({ ...filters, status: s as RegStatus | "All" })} />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {regs.length === 0 ? (
            <p className="py-12 text-center text-sm text-cf-ink-40">No regulations match your filters.</p>
          ) : (
            <div className="space-y-2">
              {regs.map((reg) => <RegulationRow key={reg.id} reg={reg} variant="full" onSelect={onSelect} />)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
