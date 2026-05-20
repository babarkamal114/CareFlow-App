// components/ui/stories/patients/RiskBadge.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { RiskBadge } from "@/features/patients/components/ui/risk-badge";

const meta: Meta<typeof RiskBadge> = {
  title: "Patients / Badges / RiskBadge",
  component: RiskBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Colored dot + label: Low (emerald), Medium (amber), High (red).",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof RiskBadge>;

export const Low:    Story = { args: { risk: "Low"    } };
export const Medium: Story = { args: { risk: "Medium" } };
export const High:   Story = { args: { risk: "High"   } };

export const AllRisks: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      <RiskBadge risk="Low"    />
      <RiskBadge risk="Medium" />
      <RiskBadge risk="High"   />
    </div>
  ),
};
