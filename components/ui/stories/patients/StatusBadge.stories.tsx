// components/ui/stories/patients/StatusBadge.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "@/features/patients/components/ui/status-badge";

const meta: Meta<typeof StatusBadge> = {
  title: "Patients / Badges / StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Pill badge for Active (emerald), On Hold (amber), New (blue), Discharged (gray).",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Active:     Story = { args: { status: "Active"     } };
export const OnHold:     Story = { args: { status: "On Hold"    } };
export const New:        Story = { args: { status: "New"        } };
export const Discharged: Story = { args: { status: "Discharged" } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      <StatusBadge status="Active"     />
      <StatusBadge status="On Hold"    />
      <StatusBadge status="New"        />
      <StatusBadge status="Discharged" />
    </div>
  ),
};
