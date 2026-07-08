// components/ui/stories/finance/FinanceHeader.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import FinanceHeader from "@/app/(dashboard)/finance/_components/FinanceHeader"

const meta: Meta<typeof FinanceHeader> = {
  title: "Finance / FinanceHeader",
  component: FinanceHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Top header bar for the Finance page — title/subtitle, search, notification bell, and the New Invoice CTA. Mirrors the structure of DashboardHeader.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof FinanceHeader>

/** Default */
export const Default: Story = {
  args: {
    onNewInvoice: () => {},
  },
}
