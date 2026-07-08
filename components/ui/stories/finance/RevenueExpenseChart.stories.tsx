// components/ui/stories/finance/RevenueExpenseChart.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import RevenueExpenseChart, {
  type RevenueExpensePoint,
} from "@/app/(dashboard)/finance/_components/RevenueExpenseChart"

const meta: Meta<typeof RevenueExpenseChart> = {
  title: "Finance / RevenueExpenseChart",
  component: RevenueExpenseChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bar chart showing revenue trend across months, styled to match the Dashboard's Weekly Activity chart. The current month is highlighted in brand green.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof RevenueExpenseChart>

const SAMPLE_DATA: RevenueExpensePoint[] = [
  { label: "Nov", revenuePct: 55 },
  { label: "Dec", revenuePct: 62 },
  { label: "Jan", revenuePct: 58 },
  { label: "Feb", revenuePct: 70 },
  { label: "Mar", revenuePct: 66 },
  { label: "Apr", revenuePct: 80, isCurrent: true },
]

/** Default — 6 month trend, upward trajectory */
export const Default: Story = {
  args: {
    data: SAMPLE_DATA,
  },
}

/** Declining trend — for visual QA on a downward trajectory */
export const Declining: Story = {
  args: {
    data: [
      { label: "Nov", revenuePct: 85 },
      { label: "Dec", revenuePct: 78 },
      { label: "Jan", revenuePct: 68 },
      { label: "Feb", revenuePct: 60 },
      { label: "Mar", revenuePct: 50 },
      { label: "Apr", revenuePct: 40, isCurrent: true },
    ],
  },
}
