// stories/live-monitoring/ActivityTimeline.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ActivityTimeline from "@/app/(dashboard)/live-monitoring/_components/ActivityTimeline";

const meta: Meta<typeof ActivityTimeline> = {
  title: "Live Monitoring / ActivityTimeline",
  component: ActivityTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Vertical timeline of the last 2 hours' events. Each entry has a status icon (red X for escalated, green check for completed, blue play for started), a title, detail text, and a timestamp. A thin vertical rule connects the dots.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ActivityTimeline>;

export const Default: Story = {};

export const NarrowCard: Story = {
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};


