// components/ui/stories/dashboard-stats.stories.tsx
// Stories for the 4 KPI stat cards row

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Activity, AlertTriangle, CheckCircle2, Users } from "lucide-react"

// ---------------------------------------------------------------------------
// Shared StatCard component (mirrors DashboardStats.tsx)
// ---------------------------------------------------------------------------
interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string | number
  badge?: { text: string; color: string }
  sub?: string
  accent?: string
  accentColor?: string
}

function StatCard({ icon, iconBg, label, value, badge, sub, accent, accentColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {/* Sparkline placeholder */}
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none" className="opacity-40">
          <polyline points="0,20 16,14 32,16 48,8 64,4" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-[#00C48C]" />
        </svg>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8B8FA8]">
        {label}
      </p>

      <div className="flex items-end gap-2">
        <span className="text-[32px] font-extrabold leading-none text-[#111318]">{value}</span>
        {badge  && <span className={`text-xs font-semibold mb-1 ${badge.color}`}>{badge.text}</span>}
        {accent && <span className={`text-xs font-medium mb-1 ${accentColor}`}>{accent}</span>}
      </div>

      {sub && <p className="text-[11px] text-[#A0A3B1] -mt-1">{sub}</p>}
    </div>
  )
}

// All 4 cards together
function StatsRow() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 p-6 bg-[#F5F6FA] rounded-xl">
      <StatCard
        icon={<CheckCircle2 size={18} className="text-[#00C48C]" />}
        iconBg="bg-[#E6FAF4]"
        label="Visits Today"
        value={127}
        badge={{ text: "▲ 96%", color: "text-[#00C48C]" }}
        sub="90 completed · 28 in progress"
      />
      <StatCard
        icon={<Users size={18} className="text-[#3B82F6]" />}
        iconBg="bg-[#EFF6FF]"
        label="Active Carers"
        value={23}
        accent="• Live"
        accentColor="text-[#3B82F6]"
        sub="+17 off total · 6 on leave"
      />
      <StatCard
        icon={<AlertTriangle size={18} className="text-[#F97316]" />}
        iconBg="bg-[#FFF4EC]"
        label="Alerts"
        value={7}
        badge={{ text: "2 critical", color: "text-[#EF4444]" }}
        sub="Timed out · 1 Safeguarding"
      />
      <StatCard
        icon={<Activity size={18} className="text-[#00C48C]" />}
        iconBg="bg-[#E6FAF4]"
        label="CQC Readings"
        value="87/100"
        badge={{ text: "+4 this month", color: "text-[#00C48C]" }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: "Dashboard/Stats Cards",
  parameters: { controls: { expanded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All 4 KPI cards in their natural grid */
export const AllCards: Story = {
  name: "All 4 KPI Cards",
  render: () => <StatsRow />,
}

/** Single card in isolation — useful for visual regression */
export const SingleVisitsCard: Story = {
  name: "Single — Visits Today",
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-64">
      <StatCard
        icon={<CheckCircle2 size={18} className="text-[#00C48C]" />}
        iconBg="bg-[#E6FAF4]"
        label="Visits Today"
        value={127}
        badge={{ text: "▲ 96%", color: "text-[#00C48C]" }}
        sub="90 completed · 28 in progress"
      />
    </div>
  ),
}

/** Alert card showing critical state */
export const SingleAlertsCard: Story = {
  name: "Single — Alerts (Critical)",
  render: () => (
    <div className="p-6 bg-[#F5F6FA] w-64">
      <StatCard
        icon={<AlertTriangle size={18} className="text-[#F97316]" />}
        iconBg="bg-[#FFF4EC]"
        label="Alerts"
        value={7}
        badge={{ text: "2 critical", color: "text-[#EF4444]" }}
        sub="Timed out · 1 Safeguarding"
      />
    </div>
  ),
}
