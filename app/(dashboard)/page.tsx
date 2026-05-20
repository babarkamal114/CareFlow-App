// app/(dashboard)/page.tsx
// Main Dashboard Page — assembles all dashboard section components

import DashboardHeader from "./_components/DashboardHeader";
import DashboardStats from "./_components/DashboardStats";
import TodaysVisits from "./_components/TodaysVisits";
import NeedsAttention from "./_components/NeedsAttention";
import WeeklyActivity from "./_components/WeeklyActivity";
import CQCBreakdown from "./_components/CQCBreakdown";
import ComplianceDue from "./_components/ComplianceDue";
import RevenuePanel from "./_components/RevenuePanel";
import VisitTrend from "./_components/VisitTrend";

export default function DashboardHomePage() {
  return (
    // Outer scroll container with light grey background matching design
    <div className="min-h-screen bg-[#F5F6FA] p-6 space-y-5">

      {/* ── Top Header: title, date, search, actions ── */}
      <DashboardHeader />

      {/* ── Row 1: 4 KPI stat cards ── */}
      <DashboardStats />

      {/* ── Row 2: Today's Visits table + Needs Attention panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <TodaysVisits />
        <NeedsAttention />
      </div>

      {/* ── Row 3: Weekly Activity | CQC Breakdown | Compliance Due ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <WeeklyActivity />
        <CQCBreakdown />
        <ComplianceDue />
      </div>

      {/* ── Row 4: Revenue April | Visit Trend 30 Days ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-5">
        <RevenuePanel />
        <VisitTrend />
      </div>

    </div>
  );
}
