"use client";
// features/patients/components/patient-list.tsx
// REPLACES the old simple list. Full Figma UI:
// stats cards → search/add → filter tabs → table → bottom panels

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import type { PatientDto } from "../schemas/patient.schema";
import { PatientStatsCards } from "./patient-stats-cards";
import { PatientFilterTabs, type FilterTab } from "./patient-filter-tabs";
import { PatientTable } from "./patient-table";
import { RiskDistribution } from "./risk-distribution";
import { RecentAdmissions } from "./recent-admissions";
import { CarePlanStatus } from "./care-plan-status";

const PER_PAGE = 12;

interface PatientListProps {
  patients: PatientDto[]; // passed from the server page
}

export function PatientList({ patients }: PatientListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);

  // ── Filter by tab ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = patients;

    if (activeTab === "Active")      list = list.filter((p) => p.status === "Active");
    if (activeTab === "On Hold")     list = list.filter((p) => p.status === "On Hold");
    if (activeTab === "High Risk")   list = list.filter((p) => p.risk === "High");
    if (activeTab === "Review Due")  list = list.filter((p) => p.carePlanStatus === "Review Due");
    if (activeTab === "New")         list = list.filter((p) => p.status === "New");

    // Search: name, NHS number, carer
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.displayName.toLowerCase().includes(q) ||
          (p.nhsNumber ?? "").toLowerCase().includes(q) ||
          p.carer.toLowerCase().includes(q),
      );
    }

    return list;
  }, [patients, activeTab, search]);

  // ── Paginate ───────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset to page 1 whenever filter/search changes
  function handleTab(tab: FilterTab) { setActiveTab(tab); setPage(1); }
  function handleSearch(q: string)   { setSearch(q);      setPage(1); }

  return (
    <div className="space-y-4">
      {/* ── 1. KPI stat cards ─────────────────────────────────────────────── */}
      <PatientStatsCards />

      {/* ── 2. Search + Add Patient ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0B3C3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search patients by name, NHS…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E4E5EA] text-[13px]
                       text-[#1A1D2E] placeholder:text-[#B0B3C3] bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#0EA472]/30
                       focus:border-[#0EA472] transition-all duration-150"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0EA472] text-white
                           text-[13px] font-semibold hover:bg-[#0c9062] active:scale-95
                           transition-all duration-150 shadow-sm">
          + Add Patient
        </button>
      </motion.div>

      {/* ── 3. Filter tabs ────────────────────────────────────────────────── */}
      <PatientFilterTabs active={activeTab} onChange={handleTab} />

      {/* ── 4. Table ──────────────────────────────────────────────────────── */}
      <PatientTable
        patients={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* ── 5. Bottom panels ──────────────────────────────────────────────── */}
      <div className="flex gap-4">
        <RiskDistribution />
        <RecentAdmissions />
        <CarePlanStatus />
      </div>
    </div>
  );
}
