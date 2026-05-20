// stories/live-monitoring/StatsBar.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import StatsBar from "@/app/(dashboard)/live-monitoring/_components/StatsBar";

const meta: Meta<typeof StatsBar> = {
  title: "Live Monitoring / StatsBar",
  component: StatsBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Top metrics row showing 7 KPIs: Total Today, Completed, In Progress (with live pulse), Late, Missed, Upcoming, and On-Time %. Animates in from above on mount.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof StatsBar>;

/** Default — shows all 7 stats as they appear on the Live Monitoring page */
export const Default: Story = {};

/** Wrapped in a border so it's easy to see boundaries in isolation */
export const WithBorder: Story = {
  decorators: [
    (Story) => (
      <div className="border border-[#E4E5EA] rounded-xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
