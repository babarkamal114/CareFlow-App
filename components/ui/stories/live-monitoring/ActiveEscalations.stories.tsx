// stories/live-monitoring/ActiveEscalations.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ActiveEscalations from "@/app/(dashboard)/live-monitoring/_components/ActiveEscalations";

const meta: Meta<typeof ActiveEscalations> = {
  title: "Live Monitoring / ActiveEscalations",
  component: ActiveEscalations,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Escalation cards panel. Shows CRITICAL (Missed Visit, red) and WARNING (Late Arrival, amber) cards. Each card has action buttons — 'Dismiss' removes the card from the list. Critical cards display a step-progress bar.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ActiveEscalations>;

/** Default — 3 active escalations (1 critical, 2 warnings) */
export const Default: Story = {};

/** In a constrained sidebar width, mimicking the real layout */
export const SidebarWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-[300px] bg-white border border-[#E4E5EA] rounded-xl p-4">
        <Story />
      </div>
    ),
  ],
};
