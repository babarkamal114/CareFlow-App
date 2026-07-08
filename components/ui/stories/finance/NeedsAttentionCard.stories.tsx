// components/ui/stories/finance/NeedsAttentionCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import NeedsAttentionCard, {
  type AttentionItem,
} from "@/app/(dashboard)/finance/_components/NeedsAttentionCard"

const meta: Meta<typeof NeedsAttentionCard> = {
  title: "Finance / NeedsAttentionCard",
  component: NeedsAttentionCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Finance-flavored version of the Dashboard's Needs Attention panel — surfaces overdue invoices, expiring payment methods, and unsubmitted claims.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof NeedsAttentionCard>

const SAMPLE_ITEMS: AttentionItem[] = [
  { id: "1", severity: "critical", message: "Dorothy Chen invoice 4 days overdue", timeAgo: "1h" },
  { id: "2", severity: "warning", message: "Joan Lewis payment method expiring", timeAgo: "Today" },
  { id: "3", severity: "warning", message: "2 CHC claims pending submission", timeAgo: "2d" },
]

/** Default — mix of critical and warning items */
export const Default: Story = {
  args: {
    items: SAMPLE_ITEMS,
  },
}

/** Empty — nothing needs attention */
export const AllClear: Story = {
  args: {
    items: [],
  },
}

/** In a constrained sidebar width, mimicking the real layout */
export const SidebarWidth: Story = {
  args: {
    items: SAMPLE_ITEMS,
  },
  decorators: [
    (Story) => (
      <div className="w-[300px] rounded-xl border border-[#E4E5EA] bg-white p-4">
        <Story />
      </div>
    ),
  ],
}
