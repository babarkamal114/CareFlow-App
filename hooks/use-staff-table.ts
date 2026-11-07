"use client";

import { useMemo, useState } from "react";
import type { SortDirection, SortField, StaffMember } from "types";
import { sortStaff } from "utils";
import { toggleSetValue } from "utils";

export function useStaffTable(data: StaffMember[], onDelete?: (id: string) => void) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);

  const sortedData = useMemo(
    () => sortStaff(data, sortField, sortDirection),
    [data, sortField, sortDirection]
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const isSelected = prev.has(id);
      // only flip the set when the checkbox state actually differs
      return checked === isSelected ? prev : toggleSetValue(prev, id);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? new Set(sortedData.map((s) => s.id)) : new Set());
  };

  const clearSelection = () => setSelectedRows(new Set());

  const handleDeleteSelected = () => {
    selectedRows.forEach((id) => onDelete?.(id));
    clearSelection();
  };

  const handleView = (staff: StaffMember) => {
    setViewingStaff(staff);
    setDrawerOpen(true);
  };

  const allSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const someSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  return {
    sortField,
    sortDirection,
    sortedData,
    selectedRows,
    allSelected,
    someSelected,
    drawerOpen,
    setDrawerOpen,
    viewingStaff,
    handleSort,
    handleSelectRow,
    handleSelectAll,
    clearSelection,
    handleDeleteSelected,
    handleView,
  };
}
