import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PricingCard } from "@/components/subscription/pricing-card"
import { PRICING_PLANS } from "@/components/subscription/data"

const meta = {
  title: "Subscription/PricingCard",
  component: PricingCard,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof PricingCard>

export default meta
type Story = StoryObj<typeof meta>

export const Starter: Story = {
  args: {
    plan: PRICING_PLANS[0],
    cycle: "monthly",
    index: 0,
  },
}

export const Professional: Story = {
  args: {
    plan: PRICING_PLANS[1],
    cycle: "monthly",
    index: 1,
  },
}

export const Enterprise: Story = {
  args: {
    plan: PRICING_PLANS[2],
    cycle: "monthly",
    index: 2,
  },
}

export const AnnualBilling: Story = {
  args: {
    plan: PRICING_PLANS[1],
    cycle: "annual",
    index: 0,
  },
}