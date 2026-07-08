// components/ui/stories/finance/PayrollSummaryCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import PayrollSummaryCard, {
  type PayrollEntry,
} from "@/app/(dashboard)/finance/_components/PayrollSummaryCard"

const meta: Meta<typeof PayrollSummaryCard> = {
  title: "Finance / PayrollSummaryCard",
  component: PayrollSummaryCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Sidebar card listing what's owed per carer for the current pay period.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof PayrollSummaryCard>

const SAMPLE_ENTRIES: PayrollEntry[] = [
  { id: "1", carerName: "Sarah W.", amount: 2140, initials: "SW", avatarColor: "bg-teal-500" },
  { id: "2", carerName: "Priya P.", amount: 1980, initials: "PP", avatarColor: "bg-violet-500" },
  { id: "3", carerName: "James O.", amount: 1410, initials: "JO", avatarColor: "bg-emerald-500" },
]

/** Default — three carers with a "View all" link */
export const Default: Story = {
  args: {
    entries: SAMPLE_ENTRIES,
    onViewAll: () => {},
  },
}

/** Without the "View all" link (e.g. when the list is already complete) */
export const NoViewAll: Story = {
  args: {
    entries: SAMPLE_ENTRIES,
  },
}
