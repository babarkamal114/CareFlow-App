// components/ui/stories/finance/FundingSourceCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import FundingSourceCard, {
  type FundingSourceShare,
} from "@/app/(dashboard)/finance/_components/FundingSourceCard"

const meta: Meta<typeof FundingSourceCard> = {
  title: "Finance / FundingSourceCard",
  component: FundingSourceCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Revenue split by funding source (Private pay / LA funded / CHC funded) — ties back to the same funding tags shown on the Patients page's Recent Admissions list.",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof FundingSourceCard>

const SAMPLE_SOURCES: FundingSourceShare[] = [
  { label: "Private pay", pct: 61, dotColor: "bg-[#00C48C]" },
  { label: "LA funded", pct: 27, dotColor: "bg-[#3574D4]" },
  { label: "CHC funded", pct: 12, dotColor: "bg-[#F59E0B]" },
]

/** Default — typical mixed funding split */
export const Default: Story = {
  args: {
    sources: SAMPLE_SOURCES,
  },
}

/** Mostly private-pay clients */
export const PrivateHeavy: Story = {
  args: {
    sources: [
      { label: "Private pay", pct: 88, dotColor: "bg-[#00C48C]" },
      { label: "LA funded", pct: 8, dotColor: "bg-[#3574D4]" },
      { label: "CHC funded", pct: 4, dotColor: "bg-[#F59E0B]" },
    ],
  },
}
