"use client";

import { toast } from "@/components/ui";
import { COMPLIANCE_MOCK_TODAY, mockAuditLogs } from "lib";
import { validateAuditDateRange } from "lib";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AuditFilters, AuditLog } from "types";
import {
  AUDIT_ENTITY_HREF, buildAuditCsv, buildAuditEntryText, downloadTextFile, filterAuditLogs,
} from "utils";

const INITIAL_FILTERS: AuditFilters = { search: "", entity: "All", from: "", to: "" };
export const AUDIT_PAGE_SIZE = 10;
const RECENT_COUNT = 8;

export function useAuditTrail() {
  const router = useRouter();
  const asOf = COMPLIANCE_MOCK_TODAY;
  const [filters, setFiltersState] = useState<AuditFilters>(INITIAL_FILTERS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [page, setPage] = useState(1);

  const rangeErrors = useMemo(() => validateAuditDateRange(filters.from, filters.to), [filters.from, filters.to]);

  // An invalid range (end before start) is ignored until the user fixes it.
  const filtered = useMemo(
    () => filterAuditLogs(mockAuditLogs, rangeErrors.to ? { ...filters, from: "", to: "" } : filters),
    [filters, rangeErrors.to],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / AUDIT_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const selected = mockAuditLogs.find((l) => l.id === selectedId) ?? null;

  const setFilters = (next: AuditFilters) => {
    setFiltersState(next);
    setPage(1);
  };

  const openEntry = (log: AuditLog) => {
    setSelectedId(log.id);
    setDrawerOpen(true);
  };

  const exportCsv = () => {
    downloadTextFile("audit-trail.csv", buildAuditCsv(filtered, asOf), "text/csv;charset=utf-8");
    toast.success(`${filtered.length} audit entries exported`);
  };

  const downloadEntry = (log: AuditLog) => {
    downloadTextFile(`audit-record-${log.id}.txt`, buildAuditEntryText(log, asOf));
    toast.success("Audit record downloaded");
  };

  const viewRecord = (log: AuditLog) => {
    setDrawerOpen(false);
    setFullOpen(false);
    router.push(AUDIT_ENTITY_HREF[log.entity]);
  };

  return {
    asOf, filters, setFilters, resetFilters: () => setFilters(INITIAL_FILTERS), rangeErrors,
    recent: filtered.slice(0, RECENT_COUNT), filtered,
    pageRows: filtered.slice((safePage - 1) * AUDIT_PAGE_SIZE, safePage * AUDIT_PAGE_SIZE),
    page: safePage, pageCount, setPage,
    selected, drawerOpen, setDrawerOpen, fullOpen, setFullOpen,
    openEntry, exportCsv, downloadEntry, viewRecord,
  };
}
