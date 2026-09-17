import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PricingCards } from "@/components/subscription/pricing-cards"

const meta = {
  title: "Subscription/PricingCards",
  component: PricingCards,
  parameters: {
    controls: { expanded: true },
    layout: "fullscreen",
  },
} satisfies Meta<typeof PricingCards>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <div className="p-10">
      <PricingCards />
    </div>
  ),
}