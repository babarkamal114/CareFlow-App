// components/ui/stories/progress-ring.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ProgressRing } from "@/components/ui/progress-ring"

const meta = {
  title: "UI/ProgressRing",
  component: ProgressRing,
  parameters: { controls: { expanded: true } },
  args: { value: 80, size: 40, strokeWidth: 4 },
} satisfies Meta<typeof ProgressRing>

export default meta
type Story = StoryObj<typeof meta>

/** Default — brand green ring */
export const Default: Story = {}

/** Low value — used for at-risk collection rate */
export const Low: Story = {
  args: { value: 32, color: "#A82B2B" },
}

/** Full — 100% */
export const Full: Story = {
  args: { value: 100 },
}

/** Larger size, e.g. for a standalone CQC-readiness-style ring */
export const Large: Story = {
  args: { value: 87, size: 72, strokeWidth: 6 },
}
