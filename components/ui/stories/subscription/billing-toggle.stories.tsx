import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { BillingToggle, type BillingCycle } from "@/components/subscription/billing-toggle"

const meta = {
  title: "Subscription/BillingToggle",
  component: BillingToggle,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof BillingToggle>

export default meta
type Story = StoryObj<typeof meta>

function BillingToggleDemo() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  return <BillingToggle value={cycle} onChange={setCycle} />
}

export const Playground: Story = {
  args: {
    value: "monthly",
    onChange: () => {},
  },
  render: () => <BillingToggleDemo />,
}