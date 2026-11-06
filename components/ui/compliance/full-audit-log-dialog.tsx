"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { AuditFilters, AuditLog, ComplianceFormErrors } from "types";
import { AuditFiltersBar } from "./audit-filters";
import { AuditLogTable } from "./audit-log-table";

interface FullAuditLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asOf: Date;
  rows: AuditLog[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  filters: AuditFilters;
  errors: ComplianceFormErrors;
  onFiltersChange: (next: AuditFilters) => void;
  onReset: () => void;
  onSelect: (log: AuditLog) => void;
  onExport: () => void;
}

export function FullAuditLogDialog({
  open, onOpenChange, asOf, rows, total, page, pageCount, onPageChange, filters, errors, onFiltersChange, onReset, onSelect, onExport,
}: FullAuditLogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="flex max-h-[88vh] flex-col gap-4 sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="font-heading text-lg text-cf-ink">Full audit log</DialogTitle>
              <DialogDescription>{total} entries · every action is logged and cannot be deleted</DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onExport}><Download />Export CSV</Button>
          </div>
        </DialogHeader>

        <AuditFiltersBar filters={filters} errors={errors} onChange={onFiltersChange} onReset={onReset} />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <AuditLogTable logs={rows} asOf={asOf} onSelect={onSelect} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-cf-ink-60">Page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft />Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Next<ChevronRight /></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
