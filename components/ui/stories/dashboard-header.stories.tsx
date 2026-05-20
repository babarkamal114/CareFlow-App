// components/ui/stories/dashboard-header.stories.tsx
// Stories for the DashboardHeader — top bar with title, search, bell, CTA

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Bell, Plus, Search } from "lucide-react"

// ---------------------------------------------------------------------------
// Self-contained render — mirrors DashboardHeader exactly
// ---------------------------------------------------------------------------
function DashboardHeaderDemo({
  dateStr = "Wednesday, 2 April 2026",
  agency = "Sunrise Care Agency",
  showNotificationDot = true,
}: {
  dateStr?: string
  agency?: string
  showNotificationDot?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[#F5F6FA] p-6 rounded-xl">

      {/* Left: title + subtitle */}
      <div>
        <h1 className="text-[22px] font-bold text-[#111318] leading-tight">
          Dashboard
        </h1>
        <p className="text-xs text-[#8B8FA8] mt-0.5">
          {dateStr}{"\u00a0"}•{"\u00a0"}{agency}
        </p>
      </div>

      {/* Right: search + bell + CTA */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A3B1]" />
          <input
            type="text"
            placeholder="Search patients, carers…"
            className="pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E4E5EA] bg-white text-[#111318] placeholder:text-[#A0A3B1] focus:outline-none focus:ring-2 focus:ring-[#00C48C]/30 w-56"
          />
        </div>

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[#E4E5EA] bg-white hover:bg-[#F5F6FA] transition-colors">
          <Bell size={16} className="text-[#5C5F6A]" />
          {showNotificationDot && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316]" />
          )}
        </button>

        {/* New Visit */}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00C48C] hover:bg-[#00B07E] text-white text-sm font-semibold transition-colors shadow-sm">
          <Plus size={15} strokeWidth={2.5} />
          New Visit
        </button>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: "Dashboard/Header",
  parameters: { controls: { expanded: true } },
  args: {
    dateStr: "Wednesday, 2 April 2026",
    agency: "Sunrise Care Agency",
    showNotificationDot: true,
  },
  argTypes: {
    dateStr: { control: "text", description: "Date string shown below the title" },
    agency:  { control: "text", description: "Agency name shown in the subtitle" },
    showNotificationDot: { control: "boolean", description: "Show unread dot on bell icon" },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Interactive playground — tweak all props via controls */
export const Playground: Story = {
  render: (args) => <DashboardHeaderDemo {...args} />,
}

/** Default state with notification dot visible */
export const WithNotification: Story = {
  name: "With Notification Dot",
  args: { showNotificationDot: true },
  render: (args) => <DashboardHeaderDemo {...args} />,
}

/** Bell without the unread indicator */
export const NoNotification: Story = {
  name: "No Notification Dot",
  args: { showNotificationDot: false },
  render: (args) => <DashboardHeaderDemo {...args} />,
}
