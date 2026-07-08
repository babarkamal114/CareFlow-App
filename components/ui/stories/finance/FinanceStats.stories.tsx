// components/ui/stories/finance/FinanceStats.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import FinanceStats from "@/app/(dashboard)/finance/_components/FinanceStats"

const meta: Meta<typeof FinanceStats> = {
  title: "Finance / FinanceStats",
  component: FinanceStats,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Top KPI row for the Finance page: Revenue MTD, Outstanding, Payroll due, Collection rate. Built on the shared StatCard primitive so tones (brand/red/amber) stay consistent with the rest of the app.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof FinanceStats>

/** Default — typical month with a few overdue invoices */
export const Default: Story = {
  args: {
    data: {
      revenueMtd: 42380,
      revenueTrendPct: 8.2,
      outstandingAmount: 8230,
      overdueInvoiceCount: 3,
      payrollDueAmount: 28400,
      payrollDueDate: "18 April",
      collectionRatePct: 81,
    },
  },
}

/** Healthy month — nothing overdue, high collection rate */
export const HealthyMonth: Story = {
  args: {
    data: {
      revenueMtd: 51200,
      revenueTrendPct: 12.4,
      outstandingAmount: 0,
      overdueInvoiceCount: 0,
      payrollDueAmount: 29750,
      payrollDueDate: "18 April",
      collectionRatePct: 100,
    },
  },
}

/** At-risk month — heavy overdue balance, low collection rate */
export const AtRisk: Story = {
  args: {
    data: {
      revenueMtd: 31500,
      revenueTrendPct: -4.1,
      outstandingAmount: 19840,
      overdueInvoiceCount: 11,
      payrollDueAmount: 27200,
      payrollDueDate: "18 April",
      collectionRatePct: 48,
    },
  },
}
