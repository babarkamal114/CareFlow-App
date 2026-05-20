// components/ui/stories/patients/CarePlanBar.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { CarePlanBar } from "@/features/patients/components/ui/care-plan-bar";

const meta: Meta<typeof CarePlanBar> = {
  title: "Patients / Badges / CarePlanBar",
  component: CarePlanBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "4-segment progress bar for care plan status. Filled segments and color change per status.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CarePlanBar>;

export const Current:   Story = { args: { status: "Current"    } };
export const ReviewDue: Story = { args: { status: "Review Due" } };
export const Overdue:   Story = { args: { status: "Overdue"    } };
export const InSetup:   Story = { args: { status: "In Setup"   } };
export const Paused:    Story = { args: { status: "Paused"     } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 w-48">
      {(["Current", "Review Due", "Overdue", "In Setup", "Paused"] as const).map((s) => (
        <CarePlanBar key={s} status={s} />
      ))}
    </div>
  ),
};
