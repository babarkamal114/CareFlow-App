// components/ui/stories/finance/RevenueByServiceCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import RevenueByServiceCard, {
  type ServiceRevenueShare,
} from "@/app/(dashboard)/finance/_components/RevenueByServiceCard"

const meta: Meta<typeof RevenueByServiceCard> = {
  title: "Finance / RevenueByServiceCard",
  component: RevenueByServiceCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal progress bars showing revenue share per service type, reusing the same visual pattern as the Dashboard's CQCBreakdown card.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof RevenueByServiceCard>

const SAMPLE_SERVICES: ServiceRevenueShare[] = [
  { label: "Personal care", pct: 70 },
  { label: "Medication", pct: 45 },
  { label: "Nutrition", pct: 30 },
]

/** Default — three service types */
export const Default: Story = {
  args: {
    services: SAMPLE_SERVICES,
  },
}

/** More service types, mixed colors */
export const Extended: Story = {
  args: {
    services: [
      { label: "Personal care", pct: 62 },
      { label: "Medication", pct: 40 },
      { label: "Nutrition", pct: 28 },
      { label: "Mobility support", pct: 22, color: "#00C48C" },
      { label: "Dementia support", pct: 18, color: "#F59E0B" },
    ],
  },
}
