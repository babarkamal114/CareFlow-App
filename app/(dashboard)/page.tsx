import {
  DashboardAttentionBoard,
  DashboardComplianceDue,
  DashboardCQCBreakdown,
  DashboardOnShiftSection,
  DashboardStatSection,
  DashboardVisitSection,
  DashboardWeeklyActivity,
} from "sections";

export default function DashboardHomePage() {
  return (
    <div className="w-full p-6 bg-transparent">
      {/* One white rounded panel holding the heading AND everything
          below it — no overflow/scroll here, the shell's <main> is
          the only scroll container. */}
      <div className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-cf-ink-60">
              Overview of today&apos;s care operations
            </p>
          </div>
        </div>

        <DashboardStatSection />
        <div className="flex justify-between gap-x-4">
          <DashboardVisitSection />
          <div className="flex flex-col w-full max-w-sm gap-y-4">
            <DashboardAttentionBoard />
            <DashboardOnShiftSection />
          </div>
        </div>

        {/* Fixed row height so all three cards get a real, equal height
            to fill — and the chart's container has an actual number to
            compute against instead of leaving blank space below it. */}
        <div className="grid grid-cols-3 gap-4 h-[440px]">
          <DashboardWeeklyActivity />
          <DashboardCQCBreakdown />
          <DashboardComplianceDue />
        </div>
      </div>
    </div>
  );
}