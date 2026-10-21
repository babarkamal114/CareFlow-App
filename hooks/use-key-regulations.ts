"use client";

import { toast } from "@/components/ui";
import { KEY_REGULATION_IDS, mockRegulations } from "lib";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AssignActionFormData, Regulation, RegulationFilters } from "types";
import { buildRegulationsCsv, countRegulationsByStatus, downloadTextFile, filterRegulations, parseLocalDate } from "utils";

const INITIAL_FILTERS: RegulationFilters = { search: "", category: "All", status: "All" };

export function useKeyRegulations() {
  const router = useRouter();
  const [regs, setRegs] = useState<Regulation[]>(mockRegulations);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [filters, setFilters] = useState<RegulationFilters>(INITIAL_FILTERS);

  const keyRegs = useMemo(() => regs.filter((r) => KEY_REGULATION_IDS.includes(r.id)), [regs]);
  const filtered = useMemo(() => filterRegulations(regs, filters), [regs, filters]);
  const counts = useMemo(() => countRegulationsByStatus(regs), [regs]);
  const selected = regs.find((r) => r.id === selectedId) ?? null;

  const select = (reg: Regulation) => {
    setSelectedId(reg.id);
    setListOpen(false);
    setDrawerOpen(true);
  };

  const assignAction = (data: AssignActionFormData) => {
    if (!selected) return;
    const due = parseLocalDate(data.dueDate)?.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) ?? data.dueDate;
    const action = { id: `a-${selected.id}-${Date.now()}`, label: data.label.trim(), owner: data.owner, due };
    setRegs((prev) => prev.map((r) => (r.id === selected.id ? { ...r, actions: [...r.actions, action] } : r)));
    setAssignOpen(false);
    toast.success(`Action assigned to ${data.owner}`);
  };

  const completeAction = (regId: number, actionId: string) => {
    setRegs((prev) => prev.map((r) => (r.id === regId ? { ...r, actions: r.actions.filter((a) => a.id !== actionId) } : r)));
    toast.success("Action marked as done");
  };

  const exportRegulations = (list: Regulation[], filename: string) => {
    downloadTextFile(filename, buildRegulationsCsv(list), "text/csv;charset=utf-8");
    toast.success(`${list.length} regulation(s) exported`);
  };

  return {
    keyRegs, filtered, counts, total: regs.length, selected,
    drawerOpen, setDrawerOpen, listOpen, setListOpen, assignOpen, setAssignOpen,
    filters, setFilters, resetFilters: () => setFilters(INITIAL_FILTERS),
    select, assignAction, completeAction, exportRegulations,
    openLinked: (href: string) => router.push(href),
  };
}
